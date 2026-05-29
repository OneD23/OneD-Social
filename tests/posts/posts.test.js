import { calculatePostScore } from '../../src/modules/feed/services/feedRanking.service.js';
describe('FeedRankingService', () => { it('scores engagement and freshness', () => { const score = calculatePostScore({ likes: [1], comments: [{}, {}], sharesCount: 1, createdAt: new Date() }); expect(score).toBeGreaterThan(10); }); });
