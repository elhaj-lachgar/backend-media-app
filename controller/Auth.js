
const bycrypt = require('bcryptjs');

const UserModule = require('../module/UserModule');

const asynchandler = require ('express-async-handler');

const jwt = require('jsonwebtoken');

const ErrorHandler = require('../utils/ErroHandler');

const sendMail = require('../utils/SendMail');

const crypt = require ('crypto')


// post
// sinup user 
// url api/v1/auth/singup
exports.SingUpService = asynchandler ( async ( req , res , next ) => {

    const user = await UserModule.create(req.body);

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SUCRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRED,
    });
  
    return res.status(201).json({ message: "create success", data: user, token });

})


// post
// singin 
// url api/v1/singin
exports.LoginService =  asynchandler ( async ( req , res , next ) => {

    const { email, password } = req.body;

    const user = await UserModule.findOne({ email });
  
    if (!user) return next(new ErrorHandler("this user not found", 404));

  
    const Isvalid = await bycrypt.compare(req.body.password,user.password);
  

    if (!Isvalid) return next(new ErrorHandler("password or email not incorected ", 404));


    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SUCRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRED,
      });
    
    return res.status(201).json({ data: user, token });
})




// handler requiste 
exports.AuthService = asynchandler ( async ( req , res , next ) => {

    // check headers
    if ( ! req.headers.authorization ) return next (new ErrorHandler('unathorize' , 401))

    // get token

    const reqToken = req.headers.authorization.split(' ')[1];

    // get info from token 

    const reqToken_payload =  jwt.verify(reqToken,process.env.TOKEN_SUCRET_KEY);

    if (!reqToken_payload) return next (new ErrorHandler('unathorize' , 401))

    const { userId } = reqToken_payload ;

    const user = await UserModule.findOne({_id : userId});
    

    if (!user) return next (new ErrorHandler('user not found' , 404));

    // check if user change password after jwt

    if ( user.changepasswordAt ){
      const dure = parseInt( user.changepasswordAt / 1000 ) ;
      if ( dure > reqToken_payload.iat) return next( new ErrorHandler ('please login again' , 401))
    }

    if ( !user.active ) return next( new ErrorHandler ('account is desactive' , 401));

    req.user = user;


    return next ();
})

// per

exports.allwodTo = (...roles)=> asynchandler ( async ( req , res , next ) => {

  const Isvalid = roles.includes(req.user.role);


  if ( ! Isvalid) return next (new ErrorHandler ('this user has not access to this action' , 401));

  return next()
})




// ############################forgot password section ############## //


exports.ForgotPasswordService  = asynchandler ( async ( req , res , next ) => {
  // find user by email
  const user = await UserModule.findOne({email : req.body.email});

  if ( ! user ) return next ( new ErrorHandler ('this user bot found' , 404));

  // generate rest_code 

  const rest_code = Math.floor(100000 + Math.random() * 9000000).toString();

  // hashed rest code

  const hashedCode = crypt.createHash('sha256').update(rest_code).digest('hex')


    // upadte rest code and date at it

    await sendMail(req.body.email , rest_code , user.name  )

    user.rest_code = hashedCode ;

    const date_now  = new Date(Date.now())

    const Exprid_date  = date_now.setMinutes( date_now.getMinutes() + 10 );

    user.rest_codeAt = Exprid_date  ;

    console.log(user.rest_code);

    await user.save();

  return res.status(201).json({message : 'action s done'})
})


exports.VerifyRestCodeService = asynchandler ( async ( req , res , next  ) => {

  const user = await UserModule.findOne({email : req.body.email});

  if ( ! user ) return next (new ErrorHandler ('this user not found ' ) , 404);

  const reqRestCode  = crypt.createHash('sha256').update(req.body.rest_code.toString()).digest('hex');

  const Isvalid = reqRestCode === user.rest_code

  
  if ( ! Isvalid ) return next ( new ErrorHandler ("unauthorize" , 403));

  if ( user.rest_codeAt < Date.now() ) return next ( new ErrorHandler ("rest code is expride"));

  user.rest_value = true ;

  await user.save()

  return res.status(201).json({ message : 'rest code is correct '})

})


exports.SetPasswordService = asynchandler ( async ( req , res , next ) => {

  const user = await UserModule.findOne({email : req.body.email});


  if ( ! user ) return next ( new ErrorHandler ('this user not found' , 404));

  if ( ! user.rest_value ) return next ( new ErrorHandler ( 'this user not rest code ' , 401)) ;

  user.password = req.body.password ;

  
  user.changepasswordAt = Date.now()


  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SUCRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });



  return res.status(201).json({message : 'password is changed' , data : user , token});
})


