const db=require('../db');

module.exports=db.defineModel('tags',{
    id:{
        type:db.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name:db.STRING(200),
});