//更改路由判断逻辑
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import {resolveRoutes} from  './routes.config.js' 

Vue.use(VueRouter)

//不控制权限的路由
const routes=[
    {
      path: '/',
      redirect: 'login'
    },
    {
        path:'/login',
        name:'登录',
        component:(resolve)=>require(['../views/LoginView'],resolve),
        meta:{
            requireauth:0
        }
    },
    {
        path:'/live/detail/',
        name:'直播详情',
        component:(resolve)=>require(['../components/live/liveDetail'],resolve),
        meta:{
            requireauth:1
        }
    },
    {
        path:'/live/search',
        name:'直播搜索',
        component:(resolve)=>require(['../views/LivesearchView'],resolve),
        meta:{
            requireauth:1
        }
    },
    {
        path:'/resource/video/detail',
        name:'视频详情',
        component:(resolve)=>require(['../views/VideoView.vue'],resolve),
        meta:{
            requireauth:1
        }
    },
    {
        path:'/resource/audio/detail',
        name:'音频详情',
        component:(resolve)=>require(['../views/AudioView.vue'],resolve),
        meta:{
            requireauth:1
        }
    },
    {
        path:'/resource/picture/detail',
        name:'图片详情',
        component:(resolve)=>require(['../views/PictureView.vue'],resolve),
        meta:{
            requireauth:1
        }
    },    
    {
        path:'/resource/draft/detail',
        name:'文稿详情',
        component:(resolve)=>require(['../views/WordView.vue'],resolve),
        meta:{
            requireauth:1
        }
    },
    {
        path:'/resource/search',
        name:'资源搜索',
        component:(resolve)=>require(['../views/SearchView.vue'],resolve),
        meta:{
            requireauth:1
        }
    },
    {
        path:'/personCenter',
        name:'个人中心',
        component:(resolve)=>require(['../views/PersonView.vue'],resolve),
        meta:{
            requireauth:1
        }
    },
    // {
    //     path:'/resource/titleCenter',
    //     name:'个人专题',
    //     component:(resolve)=>require(['../components/resource/titlecontent.vue'],resolve),
    //     meta:{
    //         requireauth:1
    //     }
    // }
];

let router =new VueRouter({
	routes
})
router.beforeEach((to,from,next)=>{
	// 防止直接在地址栏敲地址进入系统;
             if(localStorage.avc_info){
                var data = JSON.parse(localStorage.avc_info);
                 store.commit('login',data);
                const routes=resolveRoutes(data.features);
                router.addRoutes(routes);
                store.commit('updateAuth',routes); 
             }
            if(to.matched.some(r=>typeof to.meta.requireauth==='number')){
                if(to.meta.requireauth){
                    if(store.state.online){
                        next();
                    }else{
                        next({
                            path:'/login',
                        });
                    }
                }else{
                    next();
                }
            }else{
                if(store.state.online){
                    let redirect = to.path;
                    next({path:redirect})
                }else{
                    next({
                        path:'/login',
                    });
                }
            }
})

//页面刷新时，重新赋值token和auth
if(sessionStorage.avc_info){
    var data=JSON.parse(sessionStorage.avc_info);
    store.commit('login',data);

    const routes=resolveRoutes(data.features);
    router.addRoutes(routes);
    store.commit('updateAuth',routes);
}
if(sessionStorage.avc_logo){
    var data=JSON.parse(sessionStorage.avc_logo);
    store.commit('setLogo',data);
}

export default router;