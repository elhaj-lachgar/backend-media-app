

const mongoose = require ('mongoose') ;



const PostSchema =  new mongoose.Schema({

    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'user',
        required : [ true , 'user is required ']
    },
    image : {
        type : String ,
        // required : [true , 'image is required'],
    },
    title : {
        type : String ,
    },
    content : {
        type : String ,
        required : [true , 'content is required ']
    },
    count_comments : {
        type : Number ,
        default : 0 
    },
    comments: [{
        type : mongoose.Schema.ObjectId ,
        ref : 'comment'
    }]

}, {timestamps : true})


PostSchema.post(["save","init"] , async function (doc) {
    if ( doc.image) {
        const NameOfroute = doc.image.split('-')[0]
        const UrlOfProfile = `${process.env.DOMINE_NAME}/${NameOfroute}/${doc.image}`
        doc.image = UrlOfProfile;
    }
})

PostSchema.pre(/^find/, function (next) {
    
    this.populate({ path: "user", select: "name profile email" }).populate(
      {
        path : "comments" ,
        populate : { path : "user" , select : "name profile"}
      }
    );
  
    next();
  });

const PostModule = mongoose.model('post' , PostSchema);

module.exports = PostModule;