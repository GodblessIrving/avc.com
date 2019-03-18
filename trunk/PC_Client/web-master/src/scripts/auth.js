import router from './router'
import store from './store'

function getChildrenAuth(path){
    var auth=store.state.auth;
    return getChildAuth(path,auth);
}

function getChildAuth(path,auth){  
    if(auth&&auth.length>0){
        for(var i=0;i<auth.length;i++){
          var a=auth[i];
          if(path==a.path){
              if(a.children&&a.children.length>0){
                return a.children;
              }else{
                return a.meta.handleauth;
              }
          }else if(path.indexOf(a.path)>-1){
              return getChildAuth(path,a.children);
          }
        }
    }
    return [];
}

//鉴权函数
function handleAuth(id,menus){
        var auth;
        if(menus){
          auth=menus;
        }else{
          auth=router.currentRoute.meta.handleauth;
        }
       
       if(auth&&auth.length>0){
        for(var i=0;i<auth.length;i++){
            var handle=auth[i];
            if(handle.id==id){
                return true;
            }
        }
       }
       return false;
}


export {getChildrenAuth,handleAuth};
