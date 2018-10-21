const model = require('../../model');

let Category=model.Category;
 let Cat_Article=model.Cat_Article;
module.exports={
    'GET /admin/home/catalogs':async(ctx,next)=>{
        const catalogs=await Category.findAll();
        for(let c of catalogs){
            let temp=await Cat_Article.findAll({
                where:{
                    category_id:c.id
                }
            });
            c.dataValues.num=temp.length;
        }
        ctx.response.body={
            "status":200,
            "catalogList":catalogs
        }
    },
    "POST /admin/home/addCatalog":async(ctx,next)=>{
        const body=ctx.request.body;
        const cName=body.cName;
        let catalogs=await Category.findAll();
        for(let c of catalogs){
            if(c.name==cName){
                ctx.response.body={
                    "status":203,
                    "info":"fail"
                }
                return;
            }
        }
        try{
            let catalog=await Category.create({
                name:cName
            });
        }catch(err){
             ctx.response.body={
                    "status":203,
                    "info":"fail"
             }
        }
        ctx.response.body={
            "status":200,
            "info":"success"
        }
    }
}