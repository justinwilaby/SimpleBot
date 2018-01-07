import { SimpleBot } from './simpleBot/SimpleBot';
import { startServer } from './http';
import { logger } from './services/loggerService';

async function bootstrap() {
    const started = await startServer();
    if (started) {
        return new SimpleBot();
    }
    throw new Error('The server could not be started');
}

bootstrap()
    .then(() => logger.info('Server started and application bootstrapped successfully'))
    .catch(() => logger.error('The server could not be started'));
