const asynchandler = require("express-async-handler");

const MessageModule = require("../module/SectionMessageModule");

const UserModule = require("../module/UserModule");

const ErrorHandler = require("../utils/ErroHandler");

exports.CreateSectionService = asynchandler(async (req, res, next) => {
  // check if respector is existe

  const respector = await UserModule.findOne({ _id: req.body.respector });

  if (!respector) return next(new ErrorHandler("respector not found", 404));

  // check if section existe

  const first_section = await MessageModule.findOne({
    first_user: req.user._id,
    second_user : req.body.respector
  });

  const second_section = await MessageModule.findOne({
    second_user: req.user._id,
    first_user : req.body.respector
  });

 

  if (first_section || second_section)
    return next(new ErrorHandler("section already existe", 404));

  if ( first_section && second_section ) 
    return next(new ErrorHandler("sys error", 404));

  // create section

  const section = await MessageModule.create({
    first_user: req.user._id,
    second_user: req.body.respector,
  });

  return res.status(201).json({ message: "section is created", data: section });
});

// add message to section
// per Logged User
// url api/v1/message/:id
exports.AddMessageService = asynchandler(async (req, res, next) => {
  const first_section = await MessageModule.findOne({
    first_user: req.user._id,
    _id: req.params.id,
    second_user: req.body.respector,
  });

  const second_section = await MessageModule.findOne({
    first_user: req.body.respector,
    _id: req.params.id,
    second_user: req.user._id,
  });

  if (!second_section && !first_section)
    return next(new ErrorHandler("section not existe", 404));

  if (second_section && first_section)
    return next(new ErrorHandler("error two pro are existe ", 404));

  const section = first_section || second_section;

  //   add message to section

  section.messages.push({ user: req.user._id, content: req.body.content });

  await section.save();

  return res.status(201).json({ message: "message is created", data: section });
});

// delete message from section
// per Logged User
// url api/v1/message/:id
// steal working in it 
exports.DeleteMessageService = asynchandler(async (req, res, next) => {
  const first_section = await MessageModule.findOne({
    first_user: req.user._id,
    _id: req.params.id,
    second_user: req.body.respector,
  });

  const second_section = await MessageModule.findOne({
    first_user: req.body.respector,
    _id: req.params.id,
    second_user: req.user._id,
  });

  if (!second_section && !first_section)
    return next(new ErrorHandler("section not existe", 404));

  if (second_section && first_section)
    return next(new ErrorHandler("error two pro are existe ", 404));

  const section = first_section || second_section;

  const index = section.messages.findIndex((ele) => {
    return ele._id === req.body.messageId;
  });

  if (index <= -1)
    return next(new ErrorHandler("this message not existe", 404));

  section.messages[index].content = "this message is delete from ather user";

  await section.save();

  return res.status(201).json({ message: "message is delete it " });
});

// get user section
// per Logged User
// url api/v1/message
exports.GetSectionsService = asynchandler(async (req, res, next) => {
  const first_section = await MessageModule.find({
    first_user: req.user._id,
  }).populate('second_user');

  const second_section = await MessageModule.find({
    second_user: req.user._id,
  }).populate('first_user');

  const perSection = first_section.concat(second_section);

  const section = Array.from(new Set (perSection));

  return res.status(201).json({ data:section });
});

// get message of section
// peer logged User
//url api/v1/message/:id
exports.GetMessageOfService = asynchandler(async (req,res, next) => { 

  const first_section = await MessageModule.findOne({
    _id: req.params.id,
    first_user: req.user._id,
    second_user: req.body.respector,
  }).populate("messages.user").populate('second_user');

  const second_section = await MessageModule.findOne({
    _id: req.params.id,
    first_user: req.body.respector,
    second_user:req.user._id ,
    }).populate("messages.user").populate('first_user');

  if (!second_section && !first_section)
    return next(new ErrorHandler("section not existe", 404));

  if (second_section && first_section)
    return next(new ErrorHandler("error two pro are existe ", 404));

  const section = first_section || second_section;

  return res.status(201).json({data : section});
});
