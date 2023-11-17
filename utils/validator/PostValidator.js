
const { check } = require ('express-validator');

const validatorMiddlware = require('../../middlware/ValidatorMiddlware');


exports.CreatePostValidator = [
    check('title')
    .optional()
    .isLength({max : 24})
    .withMessage('title is to long'),

    check('content')
    .notEmpty()
    .withMessage('content is required')
    .isLength({min : 10})
    .withMessage('content is to short')
    .custom((value , {req}) => {
        req.body.user = req.user._id;
        return true ;
    }),
    validatorMiddlware
]

exports.UpdatePostValidator = [

    check('id')
    .notEmpty()
    .withMessage('id of post is required')
    .isMongoId()
    .withMessage('id not valid'),
    check('content')
    .notEmpty()
    .withMessage("content is required"),
    validatorMiddlware

]

exports.DeletePostValidator = [

    check('id')
    .notEmpty()
    .withMessage('id of post is required')
    .isMongoId()
    .withMessage('id not valid'),
    validatorMiddlware
]

