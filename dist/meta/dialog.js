"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dialogsByType = new WeakMap();
function WaterfallStep({ id, matches, stepIndex = 0 }) {
    return (target, propertyKey, descriptor) => {
        createDialogInjectorHook(target, id, descriptor.value.name, matches, stepIndex);
        return descriptor;
    };
}
exports.WaterfallStep = WaterfallStep;
function applyHooks(target, descriptorMap) {
    const dialogIds = Object.keys(descriptorMap);
    dialogIds.forEach(dialogId => {
        const descriptors = descriptorMap[dialogId].sort(sortByIndex);
        const refs = fetchFunctionRefs(target, descriptors);
        target.dialog(dialogId, refs).triggerAction({ matches: descriptors[0].matches });
    });
}
function createDialogInjectorHook(target, dialogId, functionName, matches, stepIndex) {
    if (dialogsByType.has(target)) {
        const info = dialogsByType.get(target);
        const waterfallSteps = info[dialogId] || (info[dialogId] = []);
        waterfallSteps.push({ functionName, matches, stepIndex });
        return;
    }
    dialogsByType.set(target, { [dialogId]: [{ functionName, matches, stepIndex }] });
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
function sortByIndex(a, b) {
    if (a.stepIndex < b.stepIndex) {
        return -1;
    }
    if (b.stepIndex < a.stepIndex) {
        return 1;
    }
    return 0;
}
function fetchFunctionRefs(target, descriptors) {
    return descriptors.map(descriptor => target[descriptor.functionName]);
}
