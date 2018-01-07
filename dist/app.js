"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleBot_1 = require("./simpleBot/SimpleBot");
const http_1 = require("./http");
const loggerService_1 = require("./services/loggerService");
async function bootstrap() {
    const started = await http_1.startServer();
    if (started) {
        return new SimpleBot_1.SimpleBot();
    }
    throw new Error('The server could not be started');
}
bootstrap()
    .then(() => loggerService_1.logger.info('Server started and application bootstrapped successfully'))
    .catch(() => loggerService_1.logger.error('The server could not be started'));
