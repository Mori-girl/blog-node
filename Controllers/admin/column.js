const model = require('../../model');

let Category=model.Category;
let Article=model.Article;
let Cat_Article=model.Cat_Article;
let Tag_Article=model.Tag_Article;
module.exports={
    'GET /admin/column/previews':async(ctx,next)=>{
        const cKey=ctx.query.id;
        const result={
            cName:'',
            previewList:[]
        };
        let previewItem={};
        const category=await Category.findAll({
            where:{
                id:cKey
            }
        });
        const cName=category[0].name;
        result.cName=cName;
        const cat_articles=await Cat_Article.findAll({
            where:{
                category_id:cKey
            }
        });
        previews=cat_articles.map((item)=>{
            return item.article_id;
        });
        for(let i=0,len=previews.length;i<len;i++){
            previewItem={};
            const article=await Article.findAll({
                where:{
                    id:previews[i]
                }
            });
            previewItem.id=previews[i];
            previewItem.title=article[0].title;
            previewItem.createdAt=article[0].createdAt;
            previewItem.updatedAt=article[0].updatedAt;
            result.previewList.push(previewItem);
        }
        ctx.response.body={
            "status":200,
            "previewTable":result
        }
    },
    'DELETE /admin/column/article':async(ctx,next)=>{
        const aKey=ctx.query.id;
        let article=await Article.findAll({
            where:{
                id:aKey
            }
        });
        try{
            await article[0].destroy();
        }catch(err){
            console.log(err);
            ctx.response.body={status:203,info:'failed'};
            return;
        }
        let cat_article=await Cat_Article.findAll({
            where:{
                article_id:aKey
            }
        });
        try{
            await cat_article[0].destroy();
        }catch(err){
            console.log(err);
            ctx.response.body={status:203,info:'failed'};
            return;
        }
        let tag_articles=await Tag_Article.findAll({
            where:{
                article_id:aKey
            }
        });
        for(let t of tag_articles){
            try{
                await t.destroy();
            }catch(err){
                console.log(err);
                ctx.response.body={status:203,info:'failed'};
                return;
            }
        }
        ctx.response.body={status:200,info:'success'}
    }
}