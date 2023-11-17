const asynchandler = require("express-async-handler");

const ErroHandler = require("../utils/ErroHandler");

const GetFeature = require("../utils/GetFeature");



exports.UpdateHandler = (module) =>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;

    const documment = await module.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!documment) return next(new ErroHandler("thid doc not found ", 404));

    return res.status(201).json({ message: "update success", data: documment });
  });



exports.DeleteHandler = (module) =>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;

    const documment = await module.findOne({ _id: id });

    if (!documment)
      return next(new ErroHandler("documment is not found ", 404));

    await documment.deleteOne();

    return res.status(201).json({ message: "doc is deleted " });
  });



exports.GetHandler = (module,optsPopulate, moduleName ) =>
  asynchandler(async (req, res, next) => {


    const documment_count = await module.countDocuments();

    const { MongoQuery, Objpagination } = new GetFeature(req.query, module)
      .filter()  
      .fields()
      .pagination(documment_count)
      .sort()
      .search(moduleName)
      ;
    

    let documment = await MongoQuery;

 

    return res.status(201).json({ Objpagination ,data : documment})
  });


exports.GetSpicifiqueHandler = (module  ) => asynchandler (async ( req , res , next )=> {

  const {id} = req.params;

  const documment = await module.findOne({_id : id });

  
  if (! documment )return next (new ErroHandler ('doucement not found' , 404));

  return res.status(201).json({data : documment })
})