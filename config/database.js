
const mongoose = require ('mongoose') ;


const  ConnectToDb =  () =>  {
    mongoose.connect(process.env.DATABASE_URL)
    .then(conx =>{
        console.log(`DB is connected : ${conx.connection.host}`);
    })
    .catch((err)=> {
        console.log(`DB not coonected : ${err}` )
    })
}


module.exports = ConnectToDb ;