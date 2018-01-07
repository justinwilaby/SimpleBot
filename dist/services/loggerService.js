"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require("bunyan");
exports.logger = new Logger({
    name: 'SimpleBot',
    stream: process.stdout,
    level: 'info'
});
