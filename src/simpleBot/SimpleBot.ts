import { IEvent, LuisRecognizer, Prompts, Session, UniversalBot } from 'botbuilder';
import { defaultConnector } from 'botbuilder/lib/consts';

import { ConnectEnabled, Receiver, WaterfallStep } from '../meta';
import { logger } from '../services/loggerService';
import { ChoiceEnum } from '../enums/ChoiceEnum';

@ConnectEnabled
export class SimpleBot extends UniversalBot {

    constructor() {
        super();
        const {LUIS_MODEL_URL = ''} = process.env;
        this.recognizer(new LuisRecognizer(LUIS_MODEL_URL.trim()));
    }

    @WaterfallStep({id: '*:/'})
    private defaultDialog(session: Session): void {
        logger.info(`"${session.message.text}" was not understood by the bot`);
        session.send(`I'm sorry, I don't understand what you mean when you say "${session.message.text}".`);
    }

    @WaterfallStep({id: 'Greeting', matches: 'Greeting'})
    private greetingDialog(session: Session): void {
        session.send('Hello here! How can I help you?');
    }

    @WaterfallStep({id: 'Goodbye', matches: 'Goodbye'})
    private farewellDialog(session: Session): void {
        session.endDialog('Cya Later!');
    }

    @WaterfallStep({id: 'JobAvailability', matches: 'JobAvailability'})
    private jobsDialog(session: Session): void {
        session.send('Ok sure, I have the following job opportunities available: "Software Design Engineer 3"');

        setTimeout(() => {
            Prompts.choice(session, 'Would you like me to try to match you with the skill requirements?', [ChoiceEnum.YES, ChoiceEnum.NO]);
        }, 1000);
    }

    @WaterfallStep({id: 'JobAvailability', stepIndex: 1})
    private applyChoiceResult(session: Session, result: any): void {
        const {response} = result;
        if (response.entity === '' + ChoiceEnum.YES) {
            Prompts.text(session, 'Great! Please list your skills so I can determine if you are a match');
        } else {
            session.endDialog('Thank you for stopping by, Goodbye');
        }
    }

    @WaterfallStep({id: 'JobAvailability', stepIndex: 2})
    private skillsList(session: Session, result: any): void {
        const {response} = result;
        if (/(typescript|javascript|node)/i.test(response)) {
            session.send('Impressive skill set! Please build a simple bot and post it to GitHub as a coding exercise.');
        } else {
            session.send(`Although you're not a match for this position, keep looking!`);
        }
        setTimeout(() => {
            session.endDialog('Good Luck!')
        }, 3000);
    }

    @Receiver()
    private receiverIntercept(events: IEvent | IEvent[], done?: (err: Error) => void): void {
        super.receive(events, done);
        logger.info(`Received events ${events}`);
    }
}
