import { emitToConversation } from '../../src/realtime/socket.js';
describe('chat realtime adapter', () => { it('is safe before socket server is registered', () => { expect(() => emitToConversation('c1', 'typing:start', {})).not.toThrow(); }); });
