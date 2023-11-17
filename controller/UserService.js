const UserModule = require("../module/UserModule");

const bycrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { UpdateHandler, DeleteHandler, GetHandler } = require("./GlobalService");

const ErrorHandler = require("../utils/ErroHandler");

const asynchandler = require("express-async-handler");
const PostModule = require("../module/PostModule");

// per admin
// desc create user
// url api/v1/user
exports.CreateUserService = asynchandler(async (req, res, next) => {
  const user = await UserModule.create(req.body);

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SUCRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });

  return res.status(201).json({ message: "create success", data: user, token });
});

// update user info
// per user
// url api/v1/user/:id
exports.UpdateUserService = UpdateHandler(UserModule);

// delete user
// per admin
// url api/v1/users/:id
exports.DeleteUserService = DeleteHandler(UserModule);

// get users
// per user admin manager
// url api/v1/users
exports.GetUsersService = GetHandler(UserModule);

// ##############################user############################//

// url api/v1/users
// put
// desactive account

exports.DesactiveAccountUserService = asynchandler(async (req, res, next) => {
  const user = await UserModule.findOne({ _id: req.user._id });

  user.active = false;

  user.desactiveAt = Date.now() + 10 * 24 * 3600 * 1000;

  await user.save();

  return res.status(201).json({
    message:
      "this user had desactived account success you have 10 days for recory your account ",
  });
});

// url api/v1/users
// put
// active account
exports.ActivateAccountOfUserService = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModule.findOne({ email });

  if (!user) return next(new ErrorHandler("this user not found", 404));

  const Isvalid = bycrypt.compareSync(password, user.password);

  if (!Isvalid)
    return next(new ErrorHandler("password or email not incorected ", 404));

  user.active = true;

  user.desactiveAt = undefined;

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SUCRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });

  return res.status(201).json({ message: "account active", token });
});

// get spicifique user
// get
// active
exports.GetUserService = asynchandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserModule.findOne({ _id: id });

  console.log(user);

  if (!user) return next(new ErrorHandler("this user not found", 404));

  return res.status(201).json({ data: user });
});

// get post user
// per logged user
// api/v1/user/myposts
exports.GetUserPostsService = asynchandler(async (req, res, next) => {
  const user = await UserModule.findOne({ _id: req.user._id });

  const info_posts = user.posts.map(async (ele) => {
    const post = await PostModule.findOne({ _id: ele }).populate("comments");
    return post;
  });

  response.posts = info_posts;

  return res.status(201).json({ data: info_posts, result: info_posts.length });
});

// change possword
// per Logged user
// url api/v1/user/change-password
exports.ChangePasswordService = asynchandler(async (req, res, next) => {

  const user = await UserModule.findOne(
    { _id: req.user._id },
  );

  user.password = req.body.password ;
  user.changepasswordAt = Date.now()
  await user.save()
  
  return res
    .status(201)
    .json({ message: "password is changed , please log again" });
});

// get profile
// per user
// url api/v1/user/profile

exports.GetUserProfile = asynchandler(async (req, res, next) => {
  const user = await UserModule.findOne({ _id: req.user._id });

  if (!user) return next(new ErrorHandler("user not found "), 404);

  return res.status(201).json({ data: user });
});

// per user
// url user/profile
// update profile

exports.UpdateProfile = asynchandler(async (req, res, next) => {
  const user = await UserModule.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, email: req.body.email, profile: req.body.profile },
    { new: true }
  );

  return res.status(201).json({data : user});
});
