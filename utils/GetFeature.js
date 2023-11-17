
class GetFeature {

    constructor ( query , module ){
        this.sortValue = query.sort ;
        this.keywordValue = query.keyword;
        this.fieldsValue = query.fields;
        this.pageValue = query.page;
        this.limitValue = query.limit;  
        this.MongoQuery = module ;
        this.query = query;
    }

    filter () {
        delete this.query.sort;
        delete this.query.keyword;
        delete this.query.fields;
        delete this.query.page;
        delete this.query.limit;


        const QueryStr = JSON.stringify(this.query);
        const RegQuery = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query = JSON.parse(RegQuery);
        
        this.MongoQuery = this.MongoQuery.find(this.query);

        return this;
    }
    sort () {
        if ( this.sortValue){
            const sortStr = this.sortValue;
            const sort = sortStr.splite(',').join(' ');
            this.MongoQuery = this.MongoQurey.sort(sort);
            
        }
        return this;
    }
    search( moduleName ) {
        
        if (this.keywordValue){
            let search_query = {};
            if (!moduleName){
                search_query.$or = [
                    {name : {$regex :this.keywordValue ,$options : 'i' }},
                ]
            }
            else{
                search_query.$or = [
                    {title : {$regex : this.keywordValue , $options :'i '}},
                    {content : {$regex : this.keywordValue , $options : 'i'}}
                ]
            }
    
            this.MongoQuery = this.MongoQuery.find(search_query);
        }
        
        return this ;
    }
    pagination (count_doc) {


        const page = + this.pageValue || 1 ;

        const limit = + this.limitValue || 10 ;

        const skip  = limit * (page - 1 )  ;

        const endPage = Math.ceil( count_doc / limit ) ;

        const Objpagination = { }
        Objpagination.limit = limit ;
        Objpagination.count_page = endPage;
        Objpagination.current_page = page; 

        if (  endPage > page )Objpagination.next_page = page + 1 ;
        if ( endPage <= page  )Objpagination.per_page =  page - 1 ;

    


        this.MongoQuery = this.MongoQuery.find({}).skip(skip).limit(limit);

        this.Objpagination = Objpagination;

        return this;

    }
    fields () {

        let fieldsStr ;

        if ( this.fieldsValue){
            fieldsStr = this.fieldsValue.split(',').join(' ')
        }
        else{
            fieldsStr = "-createdAt"
        }
        this.MongoQuery = this.MongoQuery.select(fieldsStr);
        return this ;
    }

}


module.exports = GetFeature;