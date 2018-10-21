const model = require('../../model');
const Cookie_Session=require('../../Cookie_Handler');
const {sessions,key,EXPIRES,generate,serialize}=Cookie_Session;
let User=model.User;

module.exports={
    'POST /admin/signin':async(ctx,next)=>{
        console.log(ctx.cookies.get(key));
        if(ctx.cookies&&ctx.cookies.get(key)){  
            var id=ctx.cookies.get(key);
            var session=sessions[id];   
            if(session){
                if(session.cookie.expire>(new Date()).getTime()){
                    console.log(ctx.cookies.get('session_id'));
                    //更新超时时间
                    session.cookie.expire=(new Date()).getTime()+EXPIRES;
                    ctx.render('index.html',{
                        username:ctx.cookies.get('user')
                    });        
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
            //第一次登录
            var 
            email=ctx.request.body.email||'',
            password=ctx.request.body.password||'',
            user=[];
            user= await User.findAll({
                where: {
                        email:email,
                        password:password
                }
            });
            if(user.length){
                var session=generate();
                ctx.cookies.set('user',user[0].name,{path:'/admin'});
                ctx.cookies.set(key,session.id,{path:'/admin'});
                ctx.render('index.html',{
                    username:user[0].name
                });
            }else{
                ctx.render('signin-fail.html', {
                    title: 'Sign In Failed'
                });
            }
        }
    },
    'GET /admin/signin':async(ctx,next)=>{
        ctx.response.redirect('/admin/login');
    }
}
