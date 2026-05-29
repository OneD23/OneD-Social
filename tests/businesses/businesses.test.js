import { getPagination } from '../../src/utils/pagination.js';
describe('pagination', () => { it('caps list limits', () => { expect(getPagination({ page: '2', limit: '500' })).toMatchObject({ page: 2, limit: 100, skip: 100 }); }); });
