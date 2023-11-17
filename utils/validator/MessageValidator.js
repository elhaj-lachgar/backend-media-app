

const validatorMiddlware = require('../../middlware/ValidatorMiddlware');

const { check } = require ('express-validator');

// const UserModule = require ('../../module/UserModule');

// const SectionMessageModule = require ('../../module/SectionMessageModule');


exports.CreateSectionValidator = [

    check('respector')
    .notEmpty()
    .withMessage('respector is required')
    .isMongoId()
    .withMessage('respector is not valid'),

    validatorMiddlware,
]


exports.AddMSMValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id is not valid'),

    
    check('respector')
    .notEmpty()
    .withMessage('respector is required')
    .isMongoId()
    .withMessage('respector is not valid'),

    validatorMiddlware,
]

exports.DeleteMessageValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id is not valid'),

    
    check('respector')
    .notEmpty()
    .withMessage('respector is required')
    .isMongoId()
    .withMessage('respector is not valid'),

    validatorMiddlware,
]

exports.GetSectionValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id is not valid'),

    validatorMiddlware,
]

exports.GetMSMSValidator = [
    check('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id is not valid'),

    
    check('respector')
    .notEmpty()
    .withMessage('respector is required')
    .isMongoId()
    .withMessage('respector is not valid'),

    validatorMiddlware,
]