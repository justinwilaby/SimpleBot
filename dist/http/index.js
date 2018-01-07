"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = require("restify");
const meta_1 = require("../meta");
const server = restify_1.createServer();
const { PORT = 3978 } = process.env;
function startServer() {
    return new Promise(resolve => {
        server.listen(PORT, () => {
            resolve(true);
        });
        server.post('/api/messages', meta_1.connectorListen());
    });
}
exports.startServer = startServer;
