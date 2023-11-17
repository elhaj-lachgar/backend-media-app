const express = require("express");

const router = express();

const {
  CreateCommentService,
  DeleteComentsService,
  UpdateCommentService,
} = require("../controller/CommentService");

const {
  CreateCommentValidator,
  DeleteCommentValidator,
  UpdateCommentValidator,
} = require("../utils/validator/CommentValidator");

const { AuthService, allwodTo } = require("../controller/Auth");

router.post(
  "/",
  AuthService,
  allwodTo("user"),
  CreateCommentValidator,
  CreateCommentService
);

router
  .route("/:id")
  .delete(
    AuthService,
    allwodTo("user"),
    DeleteCommentValidator,
    DeleteComentsService
  )
  .put(
    AuthService,
    allwodTo("user"),
    UpdateCommentValidator,
    UpdateCommentService
  );


module.exports = router ;