"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const consts_1 = require("botbuilder/lib/consts");
const { MICROSOFT_APP_ID: appId, MICROSOFT_APP_PASSWORD: appPassword } = process.env;
const connector = new botbuilder_1.ChatConnector({ appId, appPassword });
const receiversByType = new WeakMap();
function ConnectEnabled(constructor) {
    const settings = { storage: connector };
    const connectors = Object.freeze({ [consts_1.defaultConnector]: connector });
    Object.defineProperties(constructor.prototype, {
        connectors: {
            get: () => connectors,
            set: function () {
                const { constructor: conztructor } = Object.getPrototypeOf(this);
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
            value: (channelId, connectorValue) => {
                if (connectorValue) {
                    throw new TypeError('Connectors are no longer configurable for this object.');
                }
                return connector;
            },
            writable: false
        }
    });
}
exports.ConnectEnabled = ConnectEnabled;
function Receiver() {
    return (target, propertyKey, descriptor) => {
        receiversByType.set(target.constructor, descriptor.value.name);
        return descriptor;
    };
}
exports.Receiver = Receiver;
exports.connectorListen = connector.listen.bind(connector);
