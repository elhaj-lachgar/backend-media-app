
const mongoose = require('mongoose');


const SectionMessageSchama  = new mongoose.Schema({

    first_user : {
        type  : mongoose.Schema.ObjectId,
        ref:"user",
        required : [ true , ' user is required ']
    },

    second_user : {
        type  : mongoose.Schema.ObjectId,
        ref:"user",
        required : [ true , ' user is required ']
    },

    messages : [{
        id : mongoose.Schema.ObjectId,
        user : {
            type : mongoose.Schema.ObjectId,
            ref  : 'user'
        },
        content : String ,
    }]

},{timestamps : true});


const MessageModule  = mongoose.model('message' , SectionMessageSchama );

module.exports = MessageModule ;