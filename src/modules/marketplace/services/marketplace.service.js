import { MarketplaceItem } from '../models/marketplaceItem.model.js';
import { createCrudService } from '../../../utils/crudFactory.js';
export const service = createCrudService(MarketplaceItem, { ownerField: 'seller' });
