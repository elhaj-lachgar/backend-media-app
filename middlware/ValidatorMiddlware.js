

const {validationResult } = require('express-validator')

const validatorMiddlware =  async ( req , res , next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors : errors.array() , message : 'from validitor'});
    }
    return next();
} 

module.exports = validatorMiddlware;