module.exports={
    'GET /admin':async(ctx,next)=>{
       ctx.response.redirect('/admin/login');
    },
    'GET /admin/login':async(ctx,next)=>{
        console.log(ctx.url);
        ctx.render('signin.html',{
              title:'The entry of admin'
        });
    }
}