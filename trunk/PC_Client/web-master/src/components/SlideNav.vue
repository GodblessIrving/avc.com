<template>
  <div class="slide-nav" style="display:none;">
	<div class="nav">
		<ul>
			<li>
			<template v-if="logoinfo&&logoinfo.logo">
				<p v-if='logoinfo.logo' class="logopic" v-bind:style = " { 'background-image' : 'url('+logoinfo.logo+')'} "></p>
				<p v-if="logoinfo.name" class="title" :title="logoinfo.name">{{logoinfo.name}}</p>
			</template>
			<template v-else>
				<p class="logopic"></p>
				<p class="title">TFAVCC</p>
			</template>
			</li>
			<li @click="openNav()">
				<div v-if="user.avatar" class="pic" v-bind:style = " { 'background-image' : 'url('+user.avatar+')'} ">
				</div>
				<div v-else class="pic"></div>
				<p class="name" style="color:#fff; font-size:1em;" :title="user.realname">{{user.realname?user.realname:'未命名'}}</p>
				<span class="mess" v-if="unread">{{unread>99?'99+':unread}}</span>
				<div class="little-nav">
					<ul>
						<li class="mes" @click.stop="goTopersonal(1)">消息</li>
						<li class="personmes" @click.stop="goTopersonal(2)">个人信息设置</li>
						<li class="restword" @click.stop="goTopersonal(3)">修改密码</li>
						<li class="goout" @click.stop="goToLogin">退出</li>
					</ul>
				</div>
			</li>
			<li v-for="m in menus">
				<router-link tag="li" :to="m.path">
					<img :src="m.meta.icon" alt="" width="60%">
					<p class="name">{{m.name}}</p>
				</router-link>
			</li>
		</ul>
	</div>
       <reset :isOpen="isRest" :userId="user.uid" rtype="1" @closeEvent="closeReset" @saveEvent="saveReset"></reset>
       <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false'>
      </alert-tip>
      <common-tip :isShow="isShowTip" 
      				   :message="message" 
      				   @closeTipEvent="isShowTip = false" 
      				   @delObjEvent="sureLoginOut">
      	</common-tip>
  </div>
</template>

<script>
import reset from "../components/resource/reset"
import alertTip from '../components/alertTip'
import CommonTip from "./CommonTip"
export default {
  name: 'slide-nav',
  data(){
  	return{
  		isShow:false,
  		//消息
  		isRest:false,
  		emsg:'',
         	isError:false,
         	num:0,
         	isShowTip:false,
         	message:''
  	}
  },
  components:{reset,alertTip,CommonTip},
  mounted:function(){
  	this.getLogo();
  },
  computed:{
  	menus:function(){
  		return this.$store.state.auth;
  	},
  	user:function(){
  		return this.$store.state.user;
  	},
  	unread:function(){
  		return this.$store.state.user.count;
  	},
  	logoinfo:function(){
  		return this.$store.state.logoinfo;
  	}
  },
  methods:{
  	openNav(){
  		if($(".little-nav").hasClass('linav')){
  			$(".little-nav").css("display","none");
  			$(".little-nav").removeClass('linav');
  		}else{
  			$(".little-nav").css("display","block");
  			$(".little-nav").addClass('linav');
  		};
  		event.stopPropagation();  		
  	},
  	getLogo(){
  		this.$http.get('/systemManage/GetEnableLogo',{
  		}).then(res=>{
  			var d = $.parseJSON(res.data);
  			if(d){
  				if(d.msgid == 200){
  					this.$store.commit('setLogo',d.data);
  				}else{
  					console.log(d.msg)
  				}
  			}
  		}).catch(err=>{
  			console.log(err)
  		})
  	},
  	goTopersonal(val){
  		$(".little-nav").css("display","none");
  		$(".little-nav").removeClass('linav');
  		this.num += 1;
  		this.$router.push({path:'/personCenter',query:{val:val,num:this.num} });
  	},
  	goToLogin(){
  		this.isShowTip = true;
  		this.message = '您确定要退出登录吗？'
  	},
  	sureLoginOut(){;
  		//让后台记录用户登出时间;
  		this.$http.post('/user/Logout',{
		    uid: this.user.uid
		});
		this.$store.commit('logout');
		sessionStorage.removeItem('avc_info');
		sessionStorage.removeItem('avc_reset');
		sessionStorage.removeItem('avc_logo');
		localStorage.removeItem('avc_info');
		this.isShowTip = false;
  		this.$router.push('/login');
  	},
  	saveReset(id,pwd,confirm,email){
  		var _this=this; 
  	       this.$http.post('/user/FirstResetUserPwd',{
                        uid: id,
                        newpwd:pwd,
                        email:email
                  }).then(res=>{
                    var  d=$.parseJSON(res.data);
                    if (d.msgid==200) {                   	
                        this.isRest=false;
                        this.isError=true;
                        this.emsg='保存成功,即将跳转至登录页面';
                        setTimeout(function(){
                        	   _this.isError = false;
                            _this.$router.push({path: '/login',query:{cmd:reset}});
                        }, 2000)
                    }else{
                    	this.isError=true;
                        this.emsg=d.msg;
                    }
                  }).catch(err=>{
                    console.log(err);
                  })
  	},
    	closeReset(){
      	this.isRest=false;
      	sessionStorage.setItem('avc_reset',1);//取消重置后，整个会话过程中不再显示重置密码对话框；
    	}
  }
}
$(document).click(function(){  
   $(".little-nav").css("display","none");
   $(".little-nav").removeClass('linav');
});
</script>

<style lang="scss">
	.slide-nav{
		width:5%;
		height:85em;
		background:url("../assets/module/u0.jpg") no-repeat;
		background-size:100% 100%;
		float:left;
		// position:relative;
		// z-index:10;
		.nav{
			width:100%;
			height:100%;
			padding-top:20px;

			ul li.router-link-active{
				background:url("../assets/module/u2.png") no-repeat 0.3em top;
				background-size:100% 100%;
			}
			ul li.router-link-active .name{
				color:#fff;
			}
			ul li{
				width:100%;
				height:auto;
				text-align:center;
				position:relative;
				padding-bottom:0.2em;
				padding-top:15px;
				cursor:pointer;
				 .pic{	
				 	width:4em;
				 	height:4em;
				 	border-radius:50%;
				 	overflow:hidden;
				 	display:inline-block;
				 	background-size:cover;
                			background-repeat:no-repeat;
                			background-position:center center;
                			background-image:url('../assets/setUser/u404.png')
				 }
				 .logopic{
				 	width:4em;
				 	height:4em;
				 	display:inline-block;
				 	background-size:contain;
				 	margin-bottom:0;
                			background-repeat:no-repeat;
                			background-position:center center;
                			background-image:url('../assets/module/u2160.png')
				 }
				 .little-nav{
				 	position:absolute;
				 	width:12em;
				 	height:13em;
					background:url("../assets/personal/GR.png") no-repeat;
					background-size:100% 100%;
					left:93%;
					top:0;
					z-index:99;
					color:#fff;
					text-align:left;
					display:none;
					ul{
						width:85%;
						padding:1em;
						margin-left:15%;
						li{
							width:100%;
							text-align:left;
							cursor:pointer;
							padding:0;
							height:2.7em;
							line-height:2.7em;
							padding-left:2em;

						}
						.mes{
							background:url("../assets/message/u31.png") no-repeat left center;
							background-size:15%;
						}
						.personmes{
							background:url("../assets/message/u45.png") no-repeat left center;
							background-size:15%;
						}
						.restword{
							background:url("../assets/message/reset.png") no-repeat left center;
							background-size:15%;
						}
						.goout{
							background:url("../assets/message/u50.png") no-repeat left center;
							background-size:15%;
						}
					}
				 }
				.title{
					color:#fff;
					font-size:1em;
					margin-top:10px;
					margin-bottom:25px;
					padding:0 0.3em;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}

				.mess{
					width:2em;
					height:2em;
					background:#ff0000;
					border:1px solid #fff;
					position:absolute;
					color:#fff;
					border-radius:50%;
					text-align:center;
					line-height:1.8em;
					top:0.6em;
					right:0.5em;
				}

				.name{
					font-size:1em;
					color:#8d9194;
					margin-top:5px;
					padding:0 0.2em;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>