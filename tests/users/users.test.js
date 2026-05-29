import { roles } from '../../src/middleware/rbac.js';
describe('rbac roles', () => { it('keeps production role hierarchy', () => { expect(roles).toEqual(['user','moderator','admin','superadmin']); }); });
