import mongoose from 'mongoose';
const schema=new mongoose.Schema({ name:{type:String,required:true,unique:true,trim:true}, slug:{type:String,required:true,unique:true,lowercase:true}, parent:{type:mongoose.Schema.Types.ObjectId,ref:'MarketplaceCategory',default:null}, deletedAt:{type:Date,default:null,index:true}},{timestamps:true});
export const MarketplaceCategory=mongoose.model('MarketplaceCategory',schema);
