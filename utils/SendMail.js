

const nodemailer = require('nodemailer');

const SendMail = async ( email , rest_code , name   ) => {

    const transport = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port :process.env.EMAIL_PORT,
        secure : false,
        auth : {
            user : process.env.EMAIL_USER ,
            pass : process.env.EMAIL_PASS
        }
    });

    const email_content =  `Hi ${name}\n
    we are send this email for rest code \n
    \t\t\t\t${rest_code}\t\t\t\t\n
    we are time of media app thank you for waiting`

    const emailOpts = {
        from : 'elhaj',
        subject : ' rest code',
        to : email ,
        text : email_content
    }
    

    await transport.sendMail(emailOpts).catch((e)=> console.log(e))

} 


module.exports = SendMail;