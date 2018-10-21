const db=require('../db');

module.exports=db.defineModel('cat_article',{
    id:{
        type:db.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    category_id:db.INTEGER,
    article_id:db.INTEGER
});