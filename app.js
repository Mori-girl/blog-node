// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const bodyParser=require('koa-bodyparser');
const controller=require('./controller');
const templating=require('./templating');
const validate=require('./validate');
//const reactView=require('./react-view');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';

// 第一个middleware，记录url以及页面执行时间
app.use(async (ctx,next)=>{
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    var
        start=new Date().getTime(),
        execTime;
    await next();
    execTime=new Date().getTime()-start;
    ctx.response.set('X-Response-Time',`${execTime}ms`);
});
app.use(validate);
if(!isProduction){
    let staticFiles=require('./static-files');
    app.use(staticFiles('/static/',__dirname+'/static'));
}
app.use(bodyParser());
//app.use(reactView());
app.use(templating('views/admin',{
    noCache:!isProduction,
    watch:!isProduction
}));
app.use(controller());
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');