const db=require('../db');

module.exports=db.defineModel('category',{
    id:{
        type:db.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name:db.STRING(200),
});