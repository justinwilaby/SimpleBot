import { ChatConnector, IConnector } from 'botbuilder';
import { defaultConnector } from 'botbuilder/lib/consts';

const {MICROSOFT_APP_ID: appId, MICROSOFT_APP_PASSWORD: appPassword} = process.env;
const connector = new ChatConnector({appId, appPassword});
const receiversByType = new WeakMap();

export function ConnectEnabled(constructor: Function): void {
    const settings = {storage: connector};
    const connectors = Object.freeze({[defaultConnector]: connector});
    Object.defineProperties(constructor.prototype, {
        connectors: {
            get: () => connectors,
            set: function () {
                const {constructor: conztructor} = Object.getPrototypeOf(this);
                const receiverFunctionName = receiversByType.get(conztructor);
                connector.onEvent(this[receiverFunctionName].bind(this));
            }
        },
        settings: {
            get: () => settings,
            set: settingsValue => Object.assign(settings, settingsValue)
        }
    });

    let proto = constructor.prototype;
    while (typeof proto !== 'function' && !proto.hasOwnProperty('connector')) {
        proto = Object.getPrototypeOf(proto);
    }
    Object.defineProperties(proto, {
        connector: {
            value: (channelId: string, connectorValue: IConnector) => {
                if (connectorValue) {
                    throw new TypeError('Connectors are no longer configurable for this object.')
                }
                return connector;
            },
            writable: false
        }
    });
}

export function Receiver() {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        receiversByType.set(target.constructor, descriptor.value.name);
        return descriptor;
    }
}

export const connectorListen = connector.listen.bind(connector);
