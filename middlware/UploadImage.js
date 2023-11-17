
const multer = require ('multer');

const { v4 : uuidv4 } = require('uuid')

const sharp = require ('sharp');

const StorgeMulter = multer.memoryStorage();

const Upload = multer({storage : StorgeMulter })

const PostHandler = async ( req , res , next ) => {

    if ( req.file){
        const NameOfRouteWithQuery = req.baseUrl.split('\/')[3];
        const NameOfRoute = NameOfRouteWithQuery.split('?')[0];
        const { buffer } = req.file;
        const filename = `${NameOfRoute}-${uuidv4()}-${Date.now()}.jpeg` ;

        const demantion = { width : 400 , height : 300 };
        req.body.image = filename;
        ImageParams( NameOfRoute , buffer , filename , demantion)
        
      }
      next();

} 


const ProfileHandler = async ( req , res , next ) => {


    if ( req.file){
        const NameOfRouteWithQuery = req.baseUrl.split('\/')[3];
        const NameOfRoute = NameOfRouteWithQuery.split('?')[0];
        const { buffer } = req.file;
        const filename = `${NameOfRoute}-${uuidv4()}-${Date.now()}.jpeg` ;
        const demantion =  { width : 200 , height : 200 }
        req.body.profile= filename ;
        ImageParams( NameOfRoute , buffer , filename , demantion)
        
      }
      next();

} 


const ImageParams = ( routename , buffer , filename , demantion )=> {
    sharp( buffer )
    .resize(200,200)
    .toFormat('jpeg')
    .toFile(`upload/${routename}/${filename}`);
  }
  
exports.ProfileUpload = [
    Upload.single('profile'),
    ProfileHandler,
]
exports.PostImage = [
    Upload.single('image'),
    PostHandler,
]