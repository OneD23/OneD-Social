import { ApiError } from '../../../utils/ApiError.js';
import { JobApplication } from '../models/jobApplication.model.js';
import { Job } from '../models/job.model.js';
export const applyToJob = async (userId, jobId, payload) => { const job=await Job.findOne({_id:jobId,status:'open',deletedAt:null}); if(!job) throw new ApiError(404,'Open job not found'); return JobApplication.create({job:jobId,applicant:userId,...payload}); };
export const saveJob = async (userId, jobId) => { const job=await Job.findByIdAndUpdate(jobId,{$addToSet:{savedBy:userId}},{new:true}); if(!job) throw new ApiError(404,'Job not found'); return {saved:true}; };
