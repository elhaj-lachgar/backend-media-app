
const { check } = require('express-validator')

const validatorMiddlware = require('../../middlware/ValidatorMiddlware')

const UserModule = require('../../module/UserModule')

const bycrypt = require('bcryptjs')

exports.CreateUserValidator = [
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage(' emil not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(user) throw new Error('this email already used');
        return true;
    }),

    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short'),

    check('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min : 4})
    .withMessage('name is to short'),

    check('role')
    .optional()
    .custom((value)=>{
        const Isvalid = ['admin','manager','user'].includes(value);
        if ( ! Isvalid ) throw new Error('this role not include to systeme');
        return true;
    }),
    validatorMiddlware
]

exports.UpdateUserValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id not valid'),

    check('email')
    .optional()
    .isEmail()
    .withMessage(' emil not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(user) throw new Error('this email already used');
        return true;
    }),


    check('name')
    .optional()
    .isLength({min : 4})
    .withMessage('name is to short'),

    check('role')
    .optional()
    .custom((value)=>{
        const Isvalid = ['admin','manager','user'].includes(value);
        if ( ! Isvalid ) throw new Error('this role not include to systeme');
        return true;
    }),
    validatorMiddlware
]

exports.DeleteUserValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id not valid'),
    validatorMiddlware
]

exports.GetUserValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id not valid'),
    validatorMiddlware
]

exports.ActiveUserAccountValidator  = [
    check('email')
    .optional()
    .isEmail()
    .withMessage(' emil not valid '),

    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short'),
]

exports.ChangePasswordValidator = [
    check('current_password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short')
    .custom( async( value , { req } ) => {
        console.log(req.body);
        const Isvalid = await bycrypt.compare(value , req.user.password);
        if ( ! Isvalid ) throw new Error ('current password incorect');
        return true ;
    }),

    check('newpass')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short'),

    check('confirmpass')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short')
    .custom ((value , { req } ) => {
        const Isvalid = value === req.body.newpass;
        if ( ! Isvalid ) throw new Error ('confirm password incorrect');
        req.body.password = req.body.newpass;
        return true ;
    }),
    validatorMiddlware
]


exports.UpdateProfileValidator = [
   
    check('email')
    .optional()
    .isEmail()
    .withMessage(' email not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(user) throw new Error('this email already used');
        return true;
    }),


    check('name')
    .optional()
    .isLength({min : 4})
    .withMessage('name is to short'),

    validatorMiddlware
]