const path=require('path');
const ReactDOMServer = require('react-dom/server');
options={
   viewpath: '/views/admin',                 // the root directory of view files
   doctype: '<!DOCTYPE html>',
   extname: '.js',                     // view层直接渲染文件名后缀
   writeResp: true,                    // 是否需要在view层直接输出
}
function templating(){
    const opts=options;
    return async(ctx,next)=>{
        //给ctx绑定render函数
        ctx.renderR=function(filename, _locals, children) {
            let filepath = path.join(options.viewpath, filename);

            let render = opts.internals
                ? ReactDOMServer.renderToString
                : ReactDOMServer.renderToStaticMarkup;

            // merge koa state
            let props = Object.assign({}, this.state, _locals);
            let markup = options.doctype || '<!DOCTYPE html>';

            try {
                let component = require(__dirname+filepath+'.js');
                // Transpiled ES6 may export components as { default: Component }
                component = component.default || component;
                markup += render(React.createElement(component, props, children));
            } catch (err) {
                err.code = 'REACT';
                throw err;
            }
            if (options.writeResp) {
                this.type = 'html';
                this.body = markup;
            }
            return markup;
        };
        await next();
    }
}
module.exports=templating;