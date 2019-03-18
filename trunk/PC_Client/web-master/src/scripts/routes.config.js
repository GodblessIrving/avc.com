/*
存放权限相关的组件路径
注意：tab页的页签不能使用懒加载
*/
var com=[];

//登录
com['/login']=(resolve)=>require(['../views/LoginView'],resolve);//懒加载

//直播
com['/live']=(resolve)=>require(['../components/Live/LiveIndex'],resolve);

//资源
com['/resource']=(resolve)=>require(['../views/IndexView'],resolve);
com['/resource/video']=require('../components/resource/videocontent');
com['/resource/audio']=require('../components/resource/audiocontent');
com['/resource/picture']=require('../components/resource/piccontent');
com['/resource/draft']=require('../components/resource/artcontent');
com['topic']=require('../components/resource/titlecontent');


//我的资源
com['/myresource']=(resolve)=>require(['../views/MyresourceView'],resolve);
com['/myresource/allres']=(resolve)=>require(['../components/myresource/AllRes'],resolve);
com['/myresource/myvideo']=(resolve)=>require(['../components/myresource/MyVideo'],resolve);
com['/myresource/myaudio']=(resolve)=>require(['../components/myresource/MyAudio'],resolve);
com['/myresource/mypic']=(resolve)=>require(['../components/myresource/MyPic'],resolve);
com['/myresource/mydraft']=(resolve)=>require(['../components/myresource/MyWord'],resolve);
com['/myresource/myclips']=(resolve)=>require(['../components/myresource/MyClips'],resolve);
com['/myresource/synthesis']=(resolve)=>require(['../components/myresource/Synthesis'],resolve);
com['/myresource/storage']=(resolve)=>require(['../components/myresource/storage'],resolve);
com['/myresource/mymark']=(resolve)=>require(['../components/myresource/MyMark'],resolve);

//任务管理
com['/task']=(resolve)=>require(['../views/TaskView'],resolve);
com['/task/mytask']=require('../components/task/mytask');
com['/task/tasklist']=require('../components/task/tasklist');

//数据统计
com['/data']=(resolve)=>require(['../views/StatisticalView'],resolve);
com['/data/contentdata']=require('../components/datastical/content');
com['/data/topicdata']=require('../components/datastical/title');
com['/data/resourcedata']=require('../components/datastical/resourcecal');
com['/data/userdata']=require('../components/datastical/usercal');

//系统管理
com['/system']=(resolve)=>require(['../views/SystemView'],resolve);
com['/system/logo']=(resolve)=>require(['../components/system/logo/logo'],resolve);
com['/system/livemanager']=(resolve)=>require(['../components/system/live/live'],resolve);
com['/system/datamanager']=(resolve)=>require(['../components/system/dataManager/dataManager'],resolve);
com['/system/hot']=(resolve)=>require(['../components/system/hot/hot'],resolve);
com['/system/transcoding']=(resolve)=>require(['../components/system/transcoding/transcoding'],resolve);
com['/system/scan']=(resolve)=>require(['../components/system/scanning/scanning'],resolve);
com['/system/user']=(resolve)=>require(['../components/system/user/user'],resolve);
com['/system/role']=(resolve)=>require(['../components/system/role/role'],resolve);
com['/system/log']=(resolve)=>require(['../components/system/logbook/logbook'],resolve);

function getCom(key){
	return com[key];
}

export function resolveRoutes(data){
          for(var i=0;i<data.length;i++){
              var route=data[i];
              if(!route.path){
              	data.splice(i, 1);
              	i--;
              	continue;
              }
              route.component=getCom(route.path);
              if(route.children){
                  resolveRoutes(route.children);
              }
          }
          return data;
}