import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);


export default new Vuex.Store({
	state:{
		user:{},
		online:false,
		auth:[],
		token:null,
		logoinfo:{}
	},
	mutations:{
		login:(state,data)=>{
			state.user=data;
			state.token=data.token;
			state.online=true;
		},
		logout:(state)=>{
			state.user={};
			state.auth=[];
			state.online=false;
		},
		updateAuth:(state,data)=>{
			state.auth=data;
		},
		updateToken:(state,data)=>{
			state.token=data;	
		},
		updateInfo:(state,data)=>{
			state.user.count=data.count;
			state.user.avatar=data.avatar;
			state.user.realname=data.realname;
		},
		setLogo:(state,data)=>{
			state.logoinfo=data;
		}
	}
})