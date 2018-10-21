const db=require('../db');

module.exports=db.defineModel('tag_article',{
    id:{
        type:db.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    tag_id:db.INTEGER,
    article_id:db.INTEGER
});