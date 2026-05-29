import { Event } from '../models/event.model.js';
import { createCrudService } from '../../../utils/crudFactory.js';
export const service = createCrudService(Event, { ownerField: 'owner' });
