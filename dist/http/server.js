"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = require("restify");
const loggerService_1 = require("../services/loggerService");
const meta_1 = require("../meta");
const server = restify_1.createServer();
const { PORT = 3978 } = process.env;
function startServer() {
    server.listen(PORT, () => loggerService_1.logger.info(`${server.name} listening to ${server.url}`));
    server.post('/api/messages', meta_1.listen());
}
exports.startServer = startServer;
