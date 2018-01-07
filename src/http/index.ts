import { createServer } from 'restify';
import { connectorListen } from '../meta';

const server = createServer();
const {PORT = 3978} = process.env;

export function startServer(): Promise<boolean> {
    return new Promise(resolve => {
        server.listen(PORT, () => {
            resolve(true);
        });
        server.post('/api/messages', connectorListen());
    });
}
