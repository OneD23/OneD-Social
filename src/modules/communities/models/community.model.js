import mongoose from 'mongoose';
const schema=new mongoose.Schema({ owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null,index:true}, name:{type:String,required:true,unique:true,index:true}, slug:{type:String,required:true,unique:true,lowercase:true}, description:{type:String,default:'',maxlength:1000}, location:{type:String,required:true,index:true}, featuredBusinesses:[{type:mongoose.Schema.Types.ObjectId,ref:'Business'}], moderators:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}], deletedAt:{type:Date,default:null,index:true}},{timestamps:true});
schema.index({name:'text',description:'text',location:'text'});
export const Community=mongoose.model('Community',schema);
