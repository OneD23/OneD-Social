import { Community } from '../models/community.model.js';
import { createCrudService } from '../../../utils/crudFactory.js';
export const service = createCrudService(Community, { ownerField: 'owner' });
