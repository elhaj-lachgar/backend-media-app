const express = require("express");

const router = express.Router();

// controller
const {
  LoginService,
  SingUpService,
  ForgotPasswordService,
  SetPasswordService,
  VerifyRestCodeService,
} = require("../controller/Auth");

// validator
const {
  LoginValidator,
  SingUpValidator,
  ForgotPasswordValidator,
  SetPassowrdValidator,
  VerfieRestCodeValidator,
} = require("../utils/validator/AuthValidator");

// upload image handler
const { ProfileUpload } = require("../middlware/UploadImage");

// singup for user
router.post("/login", LoginValidator, LoginService);

router.post("/singup", SingUpValidator, ProfileUpload, SingUpService);



// rest password 
router.post("/forgotpassword" ,ForgotPasswordValidator ,ForgotPasswordService );

router.post("/verfiecode" , VerfieRestCodeValidator , VerifyRestCodeService)

router.post("/setpassword" , SetPassowrdValidator,SetPasswordService)

module.exports = router;
