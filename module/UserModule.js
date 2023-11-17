

const mongoose = require ('mongoose');

const bycrypt  = require('bcryptjs')

const  {GeneratePopulation} = require('./FactryDB')
const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [ true , 'email is required'] ,
        unique : [ true , 'email must be unique '],
        trim : true 
    },
    name : {
        type : String,
        required : [ true , 'email is required'] ,
        trim : true ,
        minlength : [ 4, 'name is to short'],
    },
    password : {
        type : String,
        required : [ true , 'email is required'] ,
        minlength : [ 6, 'password is to short'],
    },
    changepasswordAt : Date ,
    posts : [{
        type : mongoose.Schema.ObjectId,
        ref : 'post'
    }],
    comments : [{
        type : mongoose.Schema.ObjectId,
        ref : 'post'
    }],
    count_posts : {
        type : Number ,
        default : 0 ,
    },
    count_comments : {
        type : Number ,
        default : 0 ,
    },
    active : {
        type : Boolean ,
        default : true ,
    },
    desactiveAt : Date ,
    profile : String ,
    role : {
        type : String ,
        enum : [ 'user' , 'admin' , 'manager'],
        default : 'user'
    },
    rest_code : String ,
    rest_codeAt : Date,
    rest_value : {
        type  : Boolean,
        default : false ,
    },
    new_message : [{
        count_message : Number,
        user : mongoose.Schema.ObjectId,
    }],

    messages : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : "user",
            },
        }
    ]
} , {timestamps : true })


UserSchema.pre('save' , async function(next) {
    this.password = bycrypt.hashSync(this.password);
    console.log("hi");
    next()
})

UserSchema.post(["save","init"] , async function (doc) {
    if ( doc.profile ) {
        const NameOfroute = doc.profile.split('-')[0]
        const UrlOfProfile = `${process.env.DOMINE_NAME}/${NameOfroute}/${doc.profile}`
        doc.profile = UrlOfProfile;
    }
})


const UserModule = mongoose.model('user' ,UserSchema);


module.exports = UserModule;