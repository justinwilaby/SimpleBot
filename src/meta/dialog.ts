import { IDialogWaterfallStep, Library } from 'botbuilder';

declare interface IWaterfallDescriptor {
    functionName: string;
    matches: string;
    stepIndex: number;
}

declare interface IWaterfallDescriptorMap {
    [dialogId: string]: IWaterfallDescriptor[]
}

const dialogsByType = new WeakMap();

export function WaterfallStep({id, matches, stepIndex = 0}: { id: string, matches?: string, stepIndex?: number }) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        createDialogInjectorHook(target, id, descriptor.value.name, matches, stepIndex);
        return descriptor;
    }
}

function applyHooks(target: Library, descriptorMap: IWaterfallDescriptorMap): void {
    const dialogIds = Object.keys(descriptorMap);
    dialogIds.forEach(dialogId => {
        const descriptors = descriptorMap[dialogId].sort(sortByIndex);
        const refs = fetchFunctionRefs(target, descriptors);
        target.dialog(dialogId, refs).triggerAction({matches: descriptors[0].matches});
    });
}

function createDialogInjectorHook(target: Object, dialogId: string, functionName: string, matches: string, stepIndex: number): void {
    if (dialogsByType.has(target)) {
        const info = dialogsByType.get(target);
        const waterfallSteps = info[dialogId] || (info[dialogId] = []);
        waterfallSteps.push({functionName, matches, stepIndex});
        return;
    }
    dialogsByType.set(target, {[dialogId]: [{functionName, matches, stepIndex}]} as IWaterfallDescriptorMap);
    let dialogs;
    Object.defineProperty(target, 'dialogs', {
        get: () => dialogs,
        set: function (value) {
            dialogs = value;
            if (dialogs) {
                applyHooks(this, dialogsByType.get(target));
            }
        }
    });
}

function sortByIndex(a, b): 0 | 1 | -1 {
    if (a.stepIndex < b.stepIndex) {
        return -1;
    }
    if (b.stepIndex < a.stepIndex) {
        return 1;
    }
    return 0;
}

function fetchFunctionRefs(target: any, descriptors: IWaterfallDescriptor[]): IDialogWaterfallStep[] {
    return descriptors.map(descriptor => target[descriptor.functionName]);
}
