const db=require('../db');

module.exports=db.defineModel('users',{
    id:{
        type:db.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    email:db.STRING(100),
    password:db.STRING(100),
    name:db.STRING(100)
});