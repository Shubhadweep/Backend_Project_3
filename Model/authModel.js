const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_Email:{
        type:String,
        required: true
    },
    user_Password:{
        type:String,
        required: true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true,
    versionKey:false
}
);

const authModel = new mongoose.model("User_Authentication",userSchema);
module.exports = authModel;