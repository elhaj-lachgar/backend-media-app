

exports.GeneratePopulation = ( schema ,  opts ) => {
    schema.pre(/^find/, function ( next ){
        this.populate({ path : opts.path , select : opts.select });
        next();
    })
}