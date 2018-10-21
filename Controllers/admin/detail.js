const model = require('../../model');
const hljs = require('highlight.js');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});
let Category=model.Category;
let Tag=model.Tag;
let Article=model.Article;
let Cat_Article=model.Cat_Article;
let Tag_Article=model.Tag_Article;

module.exports={
    'GET /admin/detail/article':async(ctx,next)=>{
        const aKey=ctx.query.id;
        let article=await Article.findAll({
            where:{
                id:aKey
            }
        });
        let aData={};
        if(article.length){
            aData.title=article[0].title;
            aData.createdAt=article[0].createdAt;
            aData.updatedAt=article[0].updatedAt;
            aData.author=article[0].author;
            aData.content=md.render(article[0].content);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            let cat_article=await Cat_Article.findAll({
                where:{
                    article_id:aKey
                }
            });
            if(cat_article.length){
                let cId=cat_article[0].category_id;
                let catagory=await Category.findAll({
                    where:{
                        id:cId
                    }
                });
                aData.catalog=catagory[0].name;
            }
            aData.tags='';
            let tag_article=await Tag_Article.findAll({
                where:{
                    article_id:aKey
                }
            });
            if(tag_article.length){
                let tName=[];
                for(let i=0,len=tag_article.length;i<len;i++){
                    let tag=await Tag.findAll({
                        where:{
                            id:tag_article[i].tag_id
                        }
                    });
                    tName.push(tag[0].name);
                }
                aData.tags=tName.join('|');
            }
            ctx.response.body={
                "status":200,
                "aData":aData
            }
        }else{
             ctx.response.body={
                "status":404,
                "info":"Can not find this article"
            }
        }

    },
    'GET /admin/edit/article':async(ctx,next)=>{
        const aKey=ctx.query.id;
        let article=await Article.findAll({
            where:{
                id:aKey
            }
        });
        let aData={};
        if(article.length){
            aData.title=article[0].title;
            aData.createdAt=article[0].createdAt;
            aData.updatedAt=article[0].updatedAt;
            aData.author=article[0].author;
            aData.content=article[0].content;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            let cat_article=await Cat_Article.findAll({
                where:{
                    article_id:aKey
                }
            });
            if(cat_article.length){
                let cId=cat_article[0].category_id;
                let catagory=await Category.findAll({
                    where:{
                        id:cId
                    }
                });
                aData.catalog=catagory[0].name;
            }
            aData.tags='';
            let tag_article=await Tag_Article.findAll({
                where:{
                    article_id:aKey
                }
            });
            if(tag_article.length){
                let tName=[];
                for(let i=0,len=tag_article.length;i<len;i++){
                    let tag=await Tag.findAll({
                        where:{
                            id:tag_article[i].tag_id
                        }
                    });
                    tName.push(tag[0].name);
                }
                aData.tags=tName.join('|');
            }
            ctx.response.body={
                "status":200,
                "aData":aData
            }
        }else{
             ctx.response.body={
                "status":404,
                "info":"Can not find this article"
            }
        }

    }
}