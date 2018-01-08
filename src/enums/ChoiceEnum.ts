import { IChoice } from 'botbuilder';

declare type Choice = 'Yes' | 'No';

export class ChoiceEnum implements IChoice {
    public static YES = new ChoiceEnum('Yes');
    public static NO = new ChoiceEnum('No');

    public value;

    constructor(choice: Choice) {
        this.value = choice;
    }

    public toString(): string {
        return this.value;
    }
}
