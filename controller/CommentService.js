const asynchandler = require("express-async-handler");

const CommentModule = require("../module/CommentModule");

const UserModule = require("../module/UserModule");

const ErrorHandler = require("../utils/ErroHandler");

const PostModule = require('../module/PostModule')

// create comment
// per Logged User
// url : api/v1/comment
exports.CreateCommentService = asynchandler(async (req, res, next) => {

  const user = await UserModule.findOne({ _id: req.user._id });

  const post = await PostModule.findOne({_id : req.body.postId});

  if ( ! post ) return next ( new ErrorHandler ('post not found'))

  const comment = await CommentModule.create(req.body);
 //update user doc   
  user.count_comments += 1;

  user.comments.push(comment._id);

  await user.save();

//update post doc  

  post.comments.push(comment._id);

  post.count_comments += 1 ;

  await post.save();
  
  return res.status(201).json({ data: comment });
});




// update comment
// per Logged User
// url : api/v1/comment/:id
exports.UpdateCommentService = asynchandler(async (req, res, next) => {

  const post = await PostModule.findOne({_id : req.body.postId});
 

  if (!post)
  return next(new ErrorHandler("post not found  ", 404));


//   check if comment include user comments
  const valid = req.user.comments.includes(req.params.id)
  if (! valid )
  return next(new ErrorHandler("comment not found in list of user ", 404));

// check if comment include in post
  const truth = post.comments.findIndex((ele)=>{
    return ele._id.toString() == req.params.id
  });

  console.log(truth)
  if ( truth <= -1 )
  return next(new ErrorHandler("can't found this comments in post", 404));



  const comment = await CommentModule.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );


  return res.status(201).json({message : 'comment is updated ' , data : comment })
});


//delete comments 
// per logged user 
// url : api/v1/comment/:id
exports.DeleteComentsService = asynchandler ( async ( req , res , next ) => {

  const post = await PostModule.findOne({_id : req.body.postId});

  if (!post)
  return next(new ErrorHandler("post not found  ", 404));



//   check if comment include user comments
  const valid = req.user.comments.includes(req.params.id)

  if (! valid )
  return next(new ErrorHandler("comment not found in list of user ", 404));

  // check if comment include in post


  const truth = post.comments.findIndex((ele)=>{
    return ele._id.toString() == req.params.id
  });

  if ( truth <= -1 )
  return next(new ErrorHandler("can't found this comments in post", 404));



  const user = await UserModule.findOne({_id : req.user._id});

  const comment_index  = user.comments.findIndex((ele) => {
    return ele._id.toString() === req.params.id
  });

  user.comments.splice(comment_index , 1 );

  user.count_comments -= 1 ;

  const index  = post.comments.findIndex((ele) => {
    return  ele._id.toString() === req.params.id
  });



  const comment  =  await CommentModule.findOneAndDelete({_id : req.params.id }); 

  
  post.comments.splice(index , 1 );

  post.count_comments -= 1 ;

  await user.save();

  await post.save();

  return res.status(201).json({message : 'comments is delete '});
})