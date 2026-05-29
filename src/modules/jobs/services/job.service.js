import { Job } from '../models/job.model.js';
import { createCrudService } from '../../../utils/crudFactory.js';
export const service = createCrudService(Job, { ownerField: 'owner' });
