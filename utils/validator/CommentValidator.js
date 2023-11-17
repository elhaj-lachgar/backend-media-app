
const {check} = require ('express-validator');

const validatorMiddlware = require('../../middlware/ValidatorMiddlware');


exports.CreateCommentValidator = [
    check('title')
    .optional()
    .isLength({max : 15})
    .withMessage('title is to long '),

    check('postId')
    .notEmpty()
    .withMessage(' post id is require ')
    .isMongoId()
    .withMessage('post id not valid '),

    check('content')
    .notEmpty()
    .withMessage('content is required')
    .custom((value , { req } )=> {
        req.body = {
            content : value,
            title : req.body.title,
            user : req.user._id,
            postId  : req.body.postId
        }

        return true
    }),

    validatorMiddlware
]


exports.UpdateCommentValidator = [

    check('content')
    .notEmpty()
    .withMessage('content is required')
    .custom((value , {req } ) => {
        req.body = {
            content : value,
            title : req.body.title,
            user : req.user._id,
            postId : req.body.postId
        }
        return true ;
    }),

    check('id')
    .notEmpty()
    .withMessage(' comment id is required')
    .isMongoId()
    .withMessage(' id of comment not valid '),

    check('postId')
    .notEmpty()
    .withMessage(' comment id is required')
    .isMongoId()
    .withMessage(' id of comment not valid '),

    validatorMiddlware

]


exports.DeleteCommentValidator = [
    check('id')
    .notEmpty()
    .withMessage(' comment id is required')
    .isMongoId()
    .withMessage(' id of comment not valid '),

    check('postId')
    .notEmpty()
    .withMessage(' comment id is required')
    .isMongoId()
    .withMessage(' id of comment not valid '),
]