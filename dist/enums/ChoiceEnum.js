"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChoiceEnum {
    constructor(choice) {
        this.value = choice;
    }
    toString() {
        return this.value;
    }
}
ChoiceEnum.YES = new ChoiceEnum('Yes');
ChoiceEnum.NO = new ChoiceEnum('No');
exports.ChoiceEnum = ChoiceEnum;
