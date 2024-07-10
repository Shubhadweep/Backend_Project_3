const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    item_Name:{
        type: String,
        required: true
    },
    item_Category:{
        type: String,
        required: true
    },
    item_Price:{
        type: Number,
        required: true
    },
    item_FirstImage:{
        type: String,
        required: true
    },
    item_SecondImage:{
        type: String,
        required: false
    },
    item_Description:{
        type: String,
        required: false
    },
    isDeleted:{
        type:Boolean,
        default: false

    }
},
{
    timestamps: true,
    versionKey:false
})

const adminModel = new mongoose.model("Items",itemSchema);
module.exports = adminModel;