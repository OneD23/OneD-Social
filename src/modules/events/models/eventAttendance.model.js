import mongoose from 'mongoose';
const schema=new mongoose.Schema({ event:{type:mongoose.Schema.Types.ObjectId,ref:'Event',required:true,index:true}, user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, status:{type:String,enum:['going','interested','not_going'],default:'going'}},{timestamps:true});
schema.index({event:1,user:1},{unique:true});
export const EventAttendance=mongoose.model('EventAttendance',schema);
