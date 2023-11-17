
const express = require('express');

const morgan = require('morgan')

const cors = require ('cors')

const dotenv = require ('dotenv')

dotenv.config({path : './config.env'})

const app = express()

const path = require('path');

const ConnectToDb = require('./config/database')

const ApiError = require('./middlware/ApiError')

const UndefinedRoute = require ('./middlware/UndefinedRoute')

const UserRoute = require('./api/UserRoute')

const AuthRoute = require('./api/AuthRoute')

const PostRoute = require('./api/PostRoute')

const CommentRoute = require('./api/CommentRoute')

const MessageRoute = require ('./api/MessageRoute')

// connect to data base 
ConnectToDb();



app.use(cors())
app.options('*' , cors());


app.use(morgan("dev"))

// parse requiste to json
app.use(express.json({limit  : process.env.NORMAL_REQUISET}));

// shearing file of image
app.use(express.static(path.join(__dirname ,'upload')))

// user route 
app.use('/api/v1/user' , UserRoute);

// auth route 
app.use('/api/v1/auth' , AuthRoute)

// Post route 
app.use ('/api/v1/post' , PostRoute)

// comment route 
app.use('/api/v1/comment' , CommentRoute)

// message route 
app.use('/api/v1/message' , MessageRoute);

// route handle undefined route
app.all('*' , UndefinedRoute)

// route of error handler 
app.use(ApiError);



const server = app.listen(process.env.PORT, function (){console.log('port is listen')})

// Unhanle errores
process.on('unhandledRejection' , (err) =>{

    console.log(`unhandledRejection ${err}`)
    
// use it to shot down server after complete all requiste 
    server.close(()=>{
        console.log('app shot down ')
        process.exit(1)
    })
    
})




