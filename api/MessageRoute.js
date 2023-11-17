const express = require("express");

const router = express.Router();

// controller
const {
  AddMessageService,
  CreateSectionService,
  DeleteMessageService,
  GetMessageOfService,
  GetSectionsService,
} = require("../controller/MessageService");

// authorization
const { AuthService, allwodTo } = require("../controller/Auth");

// validator
const {
  AddMSMValidator,
  CreateSectionValidator,
  DeleteMessageValidator,
  GetMSMSValidator,
  GetSectionValidator,
} = require("../utils/validator/MessageValidator");

router.post(
  "/",
  AuthService,
  allwodTo("user"),
  CreateSectionValidator,
  CreateSectionService
);

router
  .get("/",AuthService, allwodTo("user"), GetSectionsService);

router
  .route("/:id")
  .post(AuthService, allwodTo("user"), AddMSMValidator, AddMessageService)
  .delete(
    AuthService,
    allwodTo("user"),
    DeleteMessageValidator,
    DeleteMessageService
  )
 

router.post(
  "/section/:id",
  AuthService,
  allwodTo("user"),
  GetMSMSValidator,
  GetMessageOfService
);


module.exports = router ;