import * as Logger from 'bunyan';

export const logger = new Logger({
    name: 'SimpleBot',
    stream: process.stdout,
    level: 'info'
});