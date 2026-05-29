import mongoose from 'mongoose';
const schema=new mongoose.Schema({ owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, business:{type:mongoose.Schema.Types.ObjectId,ref:'Business',default:null,index:true}, title:{type:String,required:true,maxlength:140}, description:{type:String,required:true,maxlength:4000}, location:{type:String,required:true,index:true}, salary:{type:String,default:''}, contactEmail:{type:String,default:''}, status:{type:String,enum:['open','closed'],default:'open',index:true}, savedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}], deletedAt:{type:Date,default:null,index:true}},{timestamps:true});
schema.index({title:'text',description:'text',location:'text'});
export const Job=mongoose.model('Job',schema);
