const express = require("express");

const router = express.Router();

// controller
const {
  ActivateAccountOfUserService,
  CreateUserService,
  DeleteUserService,
  DesactiveAccountUserService,
  GetUsersService,
  UpdateUserService,
  GetUserService,
  ChangePasswordService,
  GetUserProfile, 
  UpdateProfile
} = require("../controller/UserService");

// authorized
const { AuthService, allwodTo } = require("../controller/Auth");

// validator
const {
  CreateUserValidator,
  DeleteUserValidator,
  GetUserValidator,
  UpdateUserValidator,
  ActiveUserAccountValidator,
  ChangePasswordValidator,
  UpdateProfileValidator
} = require("../utils/validator/UserValidator");


router.put(
  "/change-password",
  AuthService,
  allwodTo("user"),
  ChangePasswordValidator,
  ChangePasswordService
);

router.get("/profile" , AuthService , allwodTo('user') , GetUserProfile )
router.put("/profile" , AuthService ,allwodTo('user') ,UpdateProfileValidator,UpdateProfile)

// admin
router
  .route("/")
  .get(AuthService, allwodTo("user"), GetUsersService)
  .post(AuthService, allwodTo("admin"), CreateUserValidator, CreateUserService);

// admin
router
  .route("/:id")
  .delete(
    AuthService,
    allwodTo("admin"),
    DeleteUserValidator,
    DeleteUserService
  )
  .get(AuthService, allwodTo("user"), GetUserValidator, GetUserService)
  .put(AuthService, allwodTo("user"), UpdateUserValidator, UpdateUserService);

// user

router.get(
  "/active",
  AuthService,
  allwodTo("user"),
  ActiveUserAccountValidator,
  ActivateAccountOfUserService
);

router.put(
  "/desactive",
  AuthService,
  allwodTo("user"),
  DesactiveAccountUserService
);




module.exports = router;
