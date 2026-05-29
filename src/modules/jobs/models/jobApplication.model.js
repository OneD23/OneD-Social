import mongoose from 'mongoose';
const schema=new mongoose.Schema({ job:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true,index:true}, applicant:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, coverLetter:{type:String,default:'',maxlength:2000}, resumeUrl:{type:String,default:''}, status:{type:String,enum:['submitted','reviewing','accepted','rejected'],default:'submitted',index:true}},{timestamps:true});
schema.index({job:1,applicant:1},{unique:true});
export const JobApplication=mongoose.model('JobApplication',schema);
