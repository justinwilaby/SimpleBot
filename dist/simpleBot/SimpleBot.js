"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const meta_1 = require("../meta");
const loggerService_1 = require("../services/loggerService");
const ChoiceEnum_1 = require("../enums/ChoiceEnum");
let SimpleBot = class SimpleBot extends botbuilder_1.UniversalBot {
    constructor() {
        super();
        const { LUIS_MODEL_URL = '' } = process.env;
        this.recognizer(new botbuilder_1.LuisRecognizer(LUIS_MODEL_URL.trim()));
    }
    defaultDialog(session) {
        loggerService_1.logger.info(`"${session.message.text}" was not understood by the bot`);
        session.send(`I'm sorry, I don't understand what you mean when you say "${session.message.text}".`);
    }
    greetingDialog(session) {
        session.send('Hello there! How can I help you?');
    }
    farewellDialog(session) {
        session.endDialog('Cya Later!');
    }
    jobsDialog(session) {
        session.send('Ok sure, I have the following job opportunities available: "Software Design Engineer 3"');
        setTimeout(() => {
            botbuilder_1.Prompts.choice(session, 'Would you like me to try to match you with the skill requirements?', [ChoiceEnum_1.ChoiceEnum.YES, ChoiceEnum_1.ChoiceEnum.NO]);
        }, 1000);
    }
    applyChoiceResult(session, result) {
        const { response } = result;
        if (response.entity === '' + ChoiceEnum_1.ChoiceEnum.YES) {
            botbuilder_1.Prompts.text(session, 'Great! Please list your skills so I can determine if you are a match');
        }
        else {
            session.endDialog('Thank you for stopping by, Goodbye');
        }
    }
    skillsList(session, result) {
        const { response } = result;
        if (/(typescript|javascript|node)/i.test(response)) {
            session.send('Impressive skill set! Please build a simple bot and post it to GitHub as a coding exercise.');
        }
        else {
            session.send(`Although you're not a match for this position, keep looking!`);
        }
        setTimeout(() => {
            session.endDialog('Good Luck!');
        }, 3000);
    }
    receiverIntercept(events, done) {
        super.receive(events, done);
        loggerService_1.logger.info(`Received events ${events}`);
    }
};
__decorate([
    meta_1.WaterfallStep({ id: '*:/' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [botbuilder_1.Session]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "defaultDialog", null);
__decorate([
    meta_1.WaterfallStep({ id: 'Greeting', matches: 'Greeting' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [botbuilder_1.Session]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "greetingDialog", null);
__decorate([
    meta_1.WaterfallStep({ id: 'Goodbye', matches: 'Goodbye' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [botbuilder_1.Session]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "farewellDialog", null);
__decorate([
    meta_1.WaterfallStep({ id: 'JobAvailability', matches: 'JobAvailability' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [botbuilder_1.Session]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "jobsDialog", null);
__decorate([
    meta_1.WaterfallStep({ id: 'JobAvailability', stepIndex: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [botbuilder_1.Session, Object]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "applyChoiceResult", null);
__decorate([
    meta_1.WaterfallStep({ id: 'JobAvailability', stepIndex: 2 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [botbuilder_1.Session, Object]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "skillsList", null);
__decorate([
    meta_1.Receiver(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", void 0)
], SimpleBot.prototype, "receiverIntercept", null);
SimpleBot = __decorate([
    meta_1.ConnectEnabled,
    __metadata("design:paramtypes", [])
], SimpleBot);
exports.SimpleBot = SimpleBot;
