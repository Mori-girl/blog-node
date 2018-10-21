var sessions={};
var key='session_id';
var EXPIRES=20*60*1000;

function generate(){
  var session={};
  session.id=(new Date()).getTime()+Math.random();
  session.cookie={
      expire:(new Date()).getTime()+EXPIRES
  };
  sessions[session.id]=session;
  return session;
}
function serialize(name,val,opt){
    var pairs=[name+'='+encodeURIComponent(val)];
    opt=opt||{};
    if(opt.maxAge) pairs.push('Max-Age='+opt.maxAge);
    if(opt.domain) pairs.push('Domain='+opt.domain);
    if(opt.path) pairs.push('Path='+opt.path);
    if(opt.expires) pairs.push('Expires='+expires.toUTCString());
    if(opt.httpOnly) pairs.push('HttpOnly');
    if(opt.secure) pairs.push('secure');
    return pairs.join('; ');
}
module.exports={
    sessions:sessions,
    key:key,
    EXPIRES:EXPIRES,
    generate:generate,
    serialize:serialize
}