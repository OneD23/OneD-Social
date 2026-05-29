import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/admin.service.js';
export const banUser=asyncHandler(async(req,res)=>res.json(await service.banUser(req.user._id,req.params.userId,req)));
export const verifyUser=asyncHandler(async(req,res)=>res.json(await service.verifyUser(req.user._id,req.params.userId,req)));
export const suspendBusiness=asyncHandler(async(req,res)=>res.json(await service.suspendBusiness(req.user._id,req.params.businessId,req)));
export const verifyBusiness=asyncHandler(async(req,res)=>res.json(await service.verifyBusiness(req.user._id,req.params.businessId,req)));
export const deletePost=asyncHandler(async(req,res)=>res.json(await service.deletePost(req.user._id,req.params.postId,req)));
export const listReports=asyncHandler(async(req,res)=>res.json(await service.listReports(req.query)));
