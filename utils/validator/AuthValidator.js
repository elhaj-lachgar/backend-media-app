
const validatorMiddlware = require ( '../../middlware/ValidatorMiddlware');

const { check } = require('express-validator');

const UserModule = require('../../module/UserModule')

const bycrypt = require('bcryptjs')



exports.SingUpValidator = [

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

    check('confirmpass')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short')
    .custom (async ( value , {req } ) => {

        const Isvalid = value === req.body.password ;

        if ( !Isvalid ) throw new Error ('comfirm password not correct');

        return true ;
    }),

    check('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min : 4})
    .withMessage('name is to short'),
    validatorMiddlware

]

exports.LoginValidator = [

    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({min : 6})
    .withMessage('pssword to short'),

    
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage(' email not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(!user) throw new Error('user not found');
        return true;
    }),

    validatorMiddlware
]


exports.ForgotPasswordValidator = [
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage(' emil not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(!user) throw new Error('user not found');
        return true;
    }),
    validatorMiddlware
]

exports.VerfieRestCodeValidator = [
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage(' email not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(!user) throw new Error('user not found');
        return true;
    }), 
    
    check('rest_code')
    .notEmpty()
    .withMessage(' rest code is required ')
    .isInt({max :10000000 , min : 10000})
    .withMessage('rest code not valid '),

    validatorMiddlware
]

exports.SetPassowrdValidator = [

    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage(' email not valid ')
    .custom(async(value)=> {
        const user = await UserModule.findOne({email : value });
        if(!user) throw new Error('user not found');
        return true;
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
        req.body = {
            email : req.body.email,
            password : req.body.newpass
        }
        return true ;
    }),

]


