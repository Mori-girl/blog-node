const model = require('../../model');
const fs=require('fs');
const path = require('path');
let Category=model.Category;
let Tag=model.Tag;
let Article=model.Article;
let Cat_Article=model.Cat_Article;
let Tag_Article=model.Tag_Article;
const dir=path.resolve(__dirname,'../../static/upload/');
const outputDir='/static/upload/';
module.exports={
    'POST /admin/editModule/upload':async(ctx,next)=>{
      const body=ctx.request.body;
      const aKey=body.aKey;
      const aData=body.article;
      let article;
      if(aKey===0){           //创建文章
            aData.createdAt=aData.updatedAt=new Date().getTime();   //创建时间和修改时间以服务器时间为准
            try{
                article=await Article.create({
                    title:aData.title,
                    createdAt:aData.createdAt,
                    updatedAt:aData.updatedAt,
                    content:aData.content,
                    author:aData.author
                });
            }catch(err){
                ctx.response.body={status:203,info:'failed'};
                return;
            }
            let articleId=article.id;
            try{
                let cat_article=await Cat_Article.create({
                    category_id:aData.catalogId,
                    article_id:articleId
                })
            }catch(err){
                ctx.response.body={status:203,info:'failed'};
                return;
            }
            if(aData.tags!==''){
                let tags=aData.tags.split('|');
                for(let t of tags){
                    let tag=await Tag.findAll({
                        where:{
                            name:t
                        }
                    });
                    if(!tag.length){  //该标签尚未存在
                        try{
                            var newTag=await Tag.create({
                                name:t
                            });
                        }catch(err){
                            ctx.response.body={status:203,info:'failed'};
                            return;
                        }
                    }
                    let tag_id=tag.length>0?tag[0].id:newTag.id;
                    try{
                        let tag_article=await Tag_Article.create({
                            tag_id:tag_id,
                            article_id:articleId
                        })
                    }catch(err){
                        ctx.response.body={status:203,info:'failed'};
                        return;
                    }
                }
            }
         
            ctx.response.body={status:200,info:'success'};
      }else{      //修改文章
           let article=await Article.findAll({
                where:{
                    id:aKey
                }
           });
           article[0].title=aData.title;
           article[0].author=aData.author;
           article[0].content=aData.content;
           article[0].updatedAt=new Date().getTime();
           try{
                await article[0].save();
           }catch(err){
                console.log(err);
                ctx.response.body={status:203,info:'failed'};
                return;
           }
           let tags=await Tag_Article.findAll({
                where:{
                    article_id:aKey
                }
            });
            for(let t of tags){
                await t.destroy();
            }   
            tags=aData.tags.split('|');
            for(let t of tags){
                let tag=await Tag.findAll({
                    where:{
                        name:t
                    }
                });
                if(!tag.length){  //该标签尚未存在
                    try{
                        var newTag=await Tag.create({
                            name:t
                        });
                    }catch(err){
                        console.log(err);
                        ctx.response.body={status:203,info:'failed'};
                        return;
                    }
                }
                let tag_id=tag.length>0?tag[0].id:newTag.id;
                try{
                    let tag_article=await Tag_Article.create({
                        tag_id:tag_id,
                        article_id:aKey
                    });
                }catch(err){
                    console.log(err);
                    ctx.response.body={status:203,info:'failed'};
                    return;
                }
            }
         
      }
      ctx.response.body={status:200,info:'modify success'};
    },
    'POST /admin/editModule/uploadImg':async(ctx,next)=>{
        const iData=ctx.request.body;
        let result=[];
        let flag=1;
        for(let i in iData){
            let prefix=iData[i].split(',')[0];
            let format=prefix.match(/^data:image\/(\w+);base64/)[1];
            let imgData=iData[i].replace(/^data:image\/\w+;base64,/,"");
            let dataBuffer=new Buffer(imgData,'base64');
            let image=await parseImgData(dataBuffer,format);
            let imgUrl=outputDir+image;
            if(typeof imgUrl!=='undefined'){
                 result.push('<img src="'+imgUrl+'"/>');
                 console.log(result);
            }else{
                flag=0;
                break;             
            }
        }
        if(flag==1){
             ctx.response.body={status:200,images:result};
        }else{
            ctx.response.body={status:203,info:'failed'};
        }
        // function receiveImgData(ctx){
        //     return new Promise((resolve,reject)=>{
        //         try{
        //             let iData="";
        //             ctx.req.addListener('data',(data)=>{
        //                 iData+=data;
        //             });
        //             ctx.req.addListener('end',(data)=>{
        //                 iData+=data;
        //                 resolve(iData);
        //             });
        //        }catch(err){
        //             console.log("err",err);
        //             reject();
        //       }
        //    })
        // }
        // let imgFiles=await receiveImgData(ctx);
        // if(typeof imgFiles!=="undefined"){
        //     console.log(typeof imgFiles);
        //     console.log(imgFiles);
        //     parseImgData(ctx,imgFiles);
        //     ctx.response.body={status:200,info:'success'};
        // }else{
        //     ctx.response.body={status:203,info:'failed'};
        // }
       
    }
}
function parseImgData(dataBuffer,format){         //将图片数据写进文件
    return new Promise((resolve,reject)=>{
        try{
            let uid=guid();
            let image=uid+'.'+format;
            let imgUrl=path.resolve(dir,'./'+image);
            fs.writeFile(imgUrl,dataBuffer,function(err){
                if(err){
                    console.log('err',err);
                    reject();
                }else{
                    resolve(image);
                }
            });
        }catch(err){
            console.log('err',err);
            reject();
        }
    })
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
