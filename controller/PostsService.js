
const asynchandler = require ('express-async-handler');

const {GetHandler , GetSpicifiqueHandler} = require ('./GlobalService')

const UserModule = require ('../module/UserModule')

const CommentModule = require ('../module/CommentModule');

const PostModule = require ('../module/PostModule');

const ErrorHandler = require('../utils/ErroHandler')

// create post
// url api/v2/posts
// per Logged user
exports.CreatePostService = asynchandler ( async ( req , res , next ) => {
    const post = await PostModule.create(req.body);

    const user = await UserModule.findOneAndUpdate({_id : req.user._id},{$addToSet : {posts : post._id}});

    user.count_posts +=1;

    await user.save();

    return res.status(201).json({ data : post , message : 'create posts success'});
})

// update posts
// url api/v1/posts/:id
// per logged user 
exports.UpdatePostService = asynchandler ( async ( req , res , next ) => {



    const user = await UserModule.findOne({_id : req.user._id});

    const IsValid = user.posts.includes(req.params.id);

    if ( ! IsValid ) return next ( new ErrorHandler ('this post not found in your posts' , 404));

    const post = await PostModule.findOneAndUpdate({_id : req.params.id}, req.body , { new : true });

    if ( ! post ) return next ( new ErrorHandler ('this post not found ' , 404));


    return res.status(201).json({ message : 'update seccess' , data : post})

})


// delete posts
// url api/v1/posts/:id
// per logged User
exports.DeleteUserPostService= asynchandler ( async ( req , res , next ) => {

    const user = await UserModule.findOne({_id : req.user._id});

    const IsValid = user.posts.includes(req.params.id);

    if ( ! IsValid ) return next ( new ErrorHandler  ('this post not found in your posts' , 404));

    const post = await PostModule.findOne({_id : req.params.id});

    if ( ! post ) return next ( new ErrorHandler  ('this post not found ' , 404));


    const index_user_post = user.posts.findIndex((ele) =>{
        return ele._id.toString() === req.params.id
    });




    // delete comments of delete posts 


    // delete all comments of post from use list of comments 
    const users = await UserModule.find({ comments : {$in : post.comments}})
    if ( users.length > 0 ){ 
        users.forEach(element => {
            post.comments.forEach( async (ele) =>{
                const index = element.comments.findIndex(( e =>{
                    return e.toString() === ele._id.toString()
                }))

                if ( index > -1 ){
                    element.comments.splice(index , 1 );
                    if ( element._id.toString() === user._id.toString() ){
                        // delete post from user list 
                        element.posts.splice(index_user_post,1 );
                    }

                    await element.save()
                }  
           })
        });
    }
    else {
        user.posts.splice(index_user_post,1 );
        await user.save();
    }

    // create list of comments 

    const List_comments = post.comments.map((ele) =>{
        return ele._id.toString()
    })

   

    // delete comments of post 
    const comments = await CommentModule.deleteMany({_id  : List_comments });




    await post.deleteOne();


    return res.status(201).json({ message : 'delete seccess' })

})


// Object Population 
const optsPopulate = [  'user' ,'comments' ,'comments.user']

// get posts 
// per *
// url api/v1/posts
exports.GetPostsService = GetHandler(PostModule , optsPopulate  ,"post");

// get post
// per * 
// url api/v1/posts/:id
exports.GetPostService = GetSpicifiqueHandler(PostModule , optsPopulate , "post" );



exports.GetUserPostsService= asynchandler ( async ( req , res , next ) => {


    const posts = await PostModule.find({ user : req.user._id });

    return res.status(201).json({ result : posts.length , data:posts });
})