const db=require('../db');

module.exports=db.defineModel('articles',{
    id:{
        type:db.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    title:db.STRING(200),
    createdAt:db.BIGINT,
    updatedAt:db.BIGINT,
    content:db.STRING(10000),
    author:db.STRING(200)
});