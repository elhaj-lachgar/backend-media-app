const express = require("express");

const router = express.Router();


// controller
const {
  CreatePostService,
  DeleteUserPostService,
  GetPostService,
  GetPostsService,
  UpdatePostService,
  GetUserPostsService
} = require("../controller/PostsService");

// auth
const { AuthService, allwodTo } = require("../controller/Auth");

// validator 
const {CreatePostValidator , DeletePostValidator ,UpdatePostValidator} = require ('../utils/validator/PostValidator')

// upload image handler 

const { PostImage } = require('../middlware/UploadImage')

router
  .get('/myposts' , AuthService , allwodTo('user') , GetUserPostsService )

router
  .route("/")
  .get(GetPostsService)
  .post(AuthService, allwodTo("user"),PostImage,CreatePostValidator ,CreatePostService);

router
  .route("/:id")
  .put(AuthService, allwodTo("user"),PostImage , UpdatePostValidator ,UpdatePostService)
  .get(GetPostService)
  .delete(AuthService, allwodTo("user"), DeletePostValidator, DeleteUserPostService);




module.exports = router