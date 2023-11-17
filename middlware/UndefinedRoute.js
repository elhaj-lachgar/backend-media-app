
const ErroHandler = require('../utils/ErroHandler')

const UndefinedRoute = async ( req , res , next ) => {
    return next( new ErroHandler ('this route not include in appilaction' , 404 ))
}

module.exports = UndefinedRoute;