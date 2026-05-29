import mongoose from 'mongoose';
const schema=new mongoose.Schema({ owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, business:{type:mongoose.Schema.Types.ObjectId,ref:'Business',default:null,index:true}, community:{type:mongoose.Schema.Types.ObjectId,ref:'Community',default:null,index:true}, title:{type:String,required:true,maxlength:160}, description:{type:String,default:'',maxlength:4000}, startsAt:{type:Date,required:true,index:true}, endsAt:{type:Date,default:null}, location:{type:String,required:true,index:true}, coverUrl:{type:String,default:''}, deletedAt:{type:Date,default:null,index:true}},{timestamps:true});
schema.index({title:'text',description:'text',location:'text'});
export const Event=mongoose.model('Event',schema);
