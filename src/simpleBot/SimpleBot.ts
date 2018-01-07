import { IEvent, LuisRecognizer, Session, UniversalBot } from 'botbuilder';
import { defaultConnector } from 'botbuilder/lib/consts';

import { ConnectEnabled, Receiver, WaterfallStep } from '../meta';
import { logger } from '../services/loggerService';

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

    @WaterfallStep({id: 'JobAvailability', matches: 'JobAvailability'})
    private jobsDialog(session: Session): void {
        session.send('Ok sure, I have the following job opportunities available');
    }

    @Receiver()
    private receiverIntercept(events: IEvent | IEvent[], done?: (err: Error) => void): void {
        super.receive(events, done);
        logger.info(`Received events ${events}`);
    }
}
