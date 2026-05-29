import { EventAttendance } from '../models/eventAttendance.model.js';
export const attendEvent = (user, event, status='going') => EventAttendance.findOneAndUpdate({user,event},{user,event,status},{upsert:true,new:true,setDefaultsOnInsert:true});
