

const mongoose = require ('mongoose');


const CommentSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'user',
        required : [true , 'user is required']
    },
    title : {
        type : String ,
    },
    content : {
        type : String ,
        required : [true , 'content is required ']
    },

},{timestamps : true }) ;


const CommentModule = mongoose.model('comment' , CommentSchema);


module.exports = CommentModule;
