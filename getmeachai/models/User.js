import mongoose from "mongoose";

const { Schema, model} = mongoose;

const UserSchema = new Schema({
    name : {type: String},
    bio : {type: String},
    email : {type: String, required:true},
    username : {type: String, required:true},
    profilepic : {type: String},
    coverpic : {type: String},
    razorpayid : {type: String},
    razorpaysecret : {type: String},
    createdAt : {type: Date, default: Date.now},
    updatedAt : {type: Date, default: Date.now},
})

export default mongoose.models.User || model("User", UserSchema)