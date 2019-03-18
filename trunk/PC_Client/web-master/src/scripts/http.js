/**
http配置

@baseURL  axios的api地址
@ahaxBaseUrl  ajax的api地址
*/
import Vue from 'vue'
import axios from 'axios'
import store from './store'
import router from './router'
import $ from 'jquery'


// axios 配置
axios.defaults.timeout=10000;
axios.defaults.withCredentials=true;//表示跨域请求时是否需要使用凭证；
axios.defaults.baseURL=window.config.host+'/api';

Vue.prototype.ajaxBaseUrl=window.config.host+'/api';
//http request 拦截器
axios.interceptors.request.use(
	config=>{
		if(store.state.token){
			config.headers.Authorization='token '+store.state.token;
		}
		return config;
	},
	err=>{
		return Promise.reject(err);
	});

//http response 拦截器
axios.interceptors.response.use(
	response=>{
		if(response.status==200&&response.data){
			var d=(JSON.parse(response.data));

			if(d.msgid==-1){//表示没有该接口权限;

			}
			if(d.msgid==-2){//session到期
				store.commit('logout');
				sessionStorage.removeItem('avc_info');
				router.replace({
					path:'/login',
					query:null
				})
			}
		}
		return response;
	},
	err=>{
		if(err.response){
			switch(err.response.status){
				case 401:
				//token无效;
				//token改为每个用户对应一个，1天更新一次;
					break;
				case 403:
					//后端给的权限校验
					store.commit('logout');
					sessionStorage.removeItem('avc_info');
					router.replace({
						path:'/login',
						query:null
					});
					break;
			}
		}
	});


export default axios;