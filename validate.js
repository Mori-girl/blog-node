const model = require('./model');
const Cookie_Session=require('./Cookie_Handler');
const {sessions,key,EXPIRES,generate,serialize}=Cookie_Session;

let User=model.User;

module.exports=async (ctx,next)=>{
    const url=ctx.url;
    const method=ctx.method;
    const pattern1=/^\/admin(\/login\/?)?|\/static\/.+$/;
    const pattern2=/^\/admin\/signin\/?$/
    if(pattern1.test(url)||(pattern2.test(url))){
        await next();
    }else{   
        if(ctx.cookies&&ctx.cookies.get(key)){  
            var id=ctx.cookies.get(key);
            var session=sessions[id];
            if(session){
                if(session.cookie.expire>(new Date()).getTime()){
                    //更新超时时间
                    session.cookie.expire=(new Date()).getTime()+EXPIRES;
                    await next();             
                }else{
                    //超时，删除旧的数据
                    delete sessions[id];
                    ctx.response.redirect('/admin/login');
                }
            }else{
                //口令不对或者session过期
                ctx.response.redirect('/admin/login');
            }
        }else{
            ctx.response.redirect('/admin/login');
        }
    }
}