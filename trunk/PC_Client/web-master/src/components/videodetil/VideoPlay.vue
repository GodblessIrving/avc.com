<template>
  <div class="video-play">
      <div class="play" style="position:relative">
      		<div class="video-box">
      			<div class="player-box" v-for="p in players" v-bind:style="{'width':p.width,'height':p.height}"
      			@mouseenter="p.controls=true;" @mouseleave="p.controls=false;">
		      		<video :id="p.id" @timeupdate="timeChange" crossOrigin="anonymous" style="width:100%;height:100%;" autoplay @canplay="canplay($event,p)">
			      	 	<source :src="p.src" type="video/mp4" />
			      </video>
			       <div class="player-bar" v-if="players.length>1" v-show="p.controls">
				      	<span :class="[p.mute?'no-voice':'voice']" @click="setMute(p)"></span>
				      	<span class="full" @click="setFullScreen(p)"></span>
				      <span class="load down" @click="downloadFiles(p.src)"></span>
				</div>
      			</div>
      			<div class="player-cover" style='background:none;'>
      				<span v-show="isStop" class="player-pause" @click="play"></span>
      			</div>
      			<div class="player-cover" v-show="isEnd">
      				<span v-show="isEnd" class="player-restart" @click="play"></span>
      			</div>
      		</div>
	      <canvas style="display:none;" id="canvas1" width="320" height="180"></canvas>
	      <div class="controll">
	      	<div class="bar">
	      	     <div class="bar-time">
		                  <div class="block">
		                    <span class="demonstration"></span>
		                    <el-slider v-model="progress" class="progress-control"
		                    @change="progressChange" :show-tooltip="false"></el-slider>
		                  </div>
	      	     </div>
	      		<div class="controll-btn" style="position:relative;">
	      			<span class="retrograde" @click="fastBackward" v-if="isShow"></span>
	      			<span v-bind:class="[isStop?'stop_c':'stop']" @click="play"></span>
	      			<span class="forward" @click="fastForward" v-if="isShow"></span>
	      			<span v-if="canmark&&stutas!='审核中'" span class="mark" @click="addMarker" title="IE下不支持抽帧"></span>
	      			<span style="position:absolute; height:2.8em; width:4em; left:12em;" v-if="canAdd"></span>
	      			<p>
	      				<em style="color:#0099ff">{{current}}</em>
	      				<em>/</em>
	      				<em>{{duration}}</em>
	      			</p>
	      			<span class="full" @click="fullScreen" v-if="players.length==1"></span>
	      			<div class="resolution" v-if="players.length==1">
	      				<em @click="toggleBlock()">{{curRadio}}</em>
	      				<div class="chose-video" :style="{'top':-top+'em'}">
	      					<ul>
	      						<li v-for="(r,i) in ratioList" :class="[i==0?'cur':'']" @click="ratioChange(r,$event)">{{r.name}}</li>
	      					</ul>
	      				</div>
	      			</div>
	      			<div class="voice" :class="[volume!=0?'':'no-voice']">
	      				<span class="voive-img" @click="toggleVioce()"></span>
	      				<div class="voice-chose">
              				  <p class="chose-inner">
              				    <el-slider
              				      vertical
              				      v-model="volume"
              				      height="7em"
              				      :show-tooltip="false"
              				      :title="volume"
              				      @change="volumeChange">
              				    </el-slider>
              				  </p>
              				</div>
	      			</div>
	      		</div>
	      	</div>
	      </div>
      </div>

      <div class="bottom-icon" v-if="isShow">
      	<ul>
      		<li class="timesplay">{{playNum}}次播放</li>
      		<li v-bind:class="[isA==1?'have-good':'good']" @click="toggleDood()" v-if="canzan">（{{thumbsup}}赞）</li>
      		<li v-if="canshare" class="share" title="功能正在开发中，敬请期待">分享</li>
      		<li v-if="cancollect" v-bind:class="{'collect':isB,'have-collect':!isB}" @click="toggleCollect($event)">{{isB?'收藏':'取消'}}</li>
      		<li v-if="candownload&&players.length==1" class="load" @click="downloadFiles(path)">下载</li>
      	</ul>
      </div>
      <alert-tip :isShowtip = "isShowtip" :message="message" @closeTipEvent="closeTip"></alert-tip>
  </div>
</template>

<script>
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
import alertTip from "../alertTip"
import {oDownLoad} from '../../scripts/download.js'
$(document).click(function(){
   $(".chose-video").css("display","none");
   $(".chose-video").removeClass('linav');
   $(".voice-chose").css("display","none");
   $(".voice-chose").removeClass('linav');
});
export default {
  name: 'video-play',
  data(){
  	return{
  		playNum:0,//播放次数
  		thumbsup:0,//点赞数
  		playPaths:'',//播放地址数组；
  		md5:'',
  		ratioList:[],
  		curRadio:'标清',
  		collect:0,
  		isA:0,//点赞或取消点赞;
  		isB:true,//收藏或取消收藏;
  		players:[],
  		//迁移
  		isBlock:false,
  		voiceBlock:false,
	      isAdd:false,
	      isStop:false,
	      player:null,
	      current:'00:00',
	      duration:'00:00',
	      volume:60,
	      progress:0,
	      isShowtip:false,
	      message:'',
	      timeID:0,//播放次数定时器的ID,
	      path:'',
	      timer1:0,
	      timeAll:0,
	      showDownList:false,
	      isEnd:false,
	      top:0,
  	}
  },
  props:{
  	resid:{
  		required:true,
  		default:0
  	},
  	isShow:{
  		default:true
  	},
  	cur:{
  		default:0
  	},
  	canAdd:{
  		default:false
  	},
  	number:{
  		default:0
  	},
  	addr:{
  		type:String
  	},
  	stutas:{
  		type:String
  	}
  },
  computed:{
  	handles:function(){
  		return getChildrenAuth('/resource/video');
  	},
  	uid:function(){
  		return this.$store.state.user.uid;
  	},
  	canmark:function(){
  		return handleAuth(7,this.handles);
  	},
  	canzan:function(){
  		return handleAuth(8,this.handles);
  	},
  	cancollect:function(){
  		return handleAuth(9,this.handles);
  	},
  	candownload:function(){
  		return handleAuth(10,this.handles);
  	},
  	canshare:function(){
  		return handleAuth(12,this.handles);
  	},
  	detail:function(){
  		return this.$parent.$parent.info;
  	},
  	maxplayer:function(){
		let durations=[];
		this.players.forEach(function(player,i){
			var t=document.getElementById(player.id).duration;
			durations.push({
				id:player.id,
				duration:t
			});
		});
		durations.sort(function(a,b){
			return a.duration-b.duration;
		});
		return document.getElementById(durations[0].id);
  	},
  	firstplayer:function(){
  		return document.getElementById(this.players[0].id);
  	}
  },
  watch:{
  	number:function(){
  			var id = this.players[0].id;
  			var player=document.getElementById(id);
  			player.currentTime = this.cur;
  	},
  	detail(val){
  		if(val){
  			this.getVideoDetails(val);
  			var videopath=val.resmsg.file[0].videopath;
  			if(!videopath){
  				this.getPlayPaths();
  			}else{
	  			var paths=[];
	  			this.players=[];
  				let _vm=this;

	  			if(typeof videopath==='string'){
	  				paths=videopath.split(',');
	  				var size=[];
	  				switch(paths.length){//分屏模式
	  					case 1:
	  						size=[{
	  							width:'100%',
	  							height:'100%'
	  						}];
	  						break;
	  					case 2:
	  						size=[{
	  							width:'50%',
	  							height:'100%'
	  						},{
	  							width:'50%',
	  							height:'100%'
	  						}];
	  						break;
	  					case 3:
	  						size=[{
	  							width:'66.7%',
	  							height:'100%'
	  						},{
	  							width:'33.3%',
	  							height:'50%'
	  						},{
	  							width:'33.3%',
	  							height:'50%'
	  						}];
	  						break;
	  					case 4:
	  						size=[{
	  							width:'50%',
	  							height:'50%'
	  						},{
	  							width:'50%',
	  							height:'50%'
	  						},{
	  							width:'50%',
	  							height:'50%'
	  						},{
	  							width:'50%',
	  							height:'50%'
	  						},{
	  							width:'50%',
	  							height:'50%'
	  						}];
	  						break;
            }

		  			paths.forEach(function(path,i){
	  					let player={
	  						inx:i,
	  						id:'player'+i,
	  						src:path,
	  						width:size[i].width,
	  						height:size[i].height,
	  						fullScreen:true,
	  						mute:false,
	  						volume:1,
	  						controls:false//是否显示操作栏
	  					};
	  					if(i>0){
							player.mute=true;//多分屏默认只有第一路视频有声音
							player.volume=0;
	  					}
	  					_vm.players.push(player);
	  				});
	  				console.log(this.players);
	  			}
  			}
  		}
  	}
  },
  destroyed(){
      	clearTimeout(this.timer1);
  },
  components:{alertTip},
  mounted(){
	//更新播放次数；
	var _this=this;
	let id=this.resid;
	this.timeID=setTimeout(function(){
	    _this.$http.post('/resource/ModifyPlay',{
	         id:id,
	         uid:_this.uid
	    }).then(res=>{
	        var d=$.parseJSON(res.data);
	        if (d) {
	            if (d.msgid==200) {
	                  // _this.playNum=d.data;离开或者刷新才计数
	            }
	        }
	    });
	}, 2*60*1000);
  },
  destroyed(){
  	clearTimeout(this.timeID);//离开组件时,清除计时器
  },
  methods:{
  	//#region加载基本数据；
  	closeTip(){
  		this.isShowtip = false;
  	},
  	getSecond(time){
        if(time.indexOf(':')>0){
          var timeArr = time.split(":");
        }else{
          var timeArr = time.split("'");
        }
        var num = parseInt(timeArr[0]);
        var num1 = parseInt(timeArr[1]);
        var current = num*60 + num1;
        return current;
      },
	getVideoDetails(r){
            this.playNum=r.play;
            this.thumbsup=r.thumbsup;
            this.isA=r.sign;
            this.collect = r.collect;
      	    if(this.collect == 0){
      	      this.isB = true
      	    }else if(this.collect == 1){
      	      this.isB = false;
      	    }
            var files=r.resmsg.file;
            if (files&&files.length>0) {
            	var file=files[0];
            	this.md5=file.md5;
            	this.path=file.path;
            }
	},
	getPlayPaths(){
		this.$http.get('/transcoding/GetVideoMapping',{
		  params:{
		      rid:this.resid
		  }
		}).then(res=>{
		      var d=JSON.parse(res.data);
		      if (d) {
		          if (d.msgid==200) {
		              var info=d.data;
		              if (info) {
		              	var ratios=[];
		              	if (info.c480p) {
		              		var r={
		              			name:'标清',
		              			path:info.c480p
		              		}
		              		ratios.push(r);
		              	}
		              	if (info.c720p) {
		              		var r={
		              			name:'高清',
		              			path:info.c720p
		              		}
		              		ratios.push(r);
		              	}
		              	if (info.c1080p) {
		              		var r={
		              			name:'超清',
		              			path:info.c1080p
		              		}
		              		ratios.push(r);
		              	}
		              	this.ratioList=ratios;
		              	var path='';
		              	if(info.c480p){
		              		path=info.c480p;
		              		this.curRadio='标清';
		              	}else if(info.c720p){
		              		path=info.c720p;
		              		this.curRadio='高清';
		              	}else if(info.c1080p){
		              		path=info.c1080p;
		              		this.curRadio='超清';
		              	}

		              	if(!path){
		              		this.$emit('playFail','该视频无法播放');
		              		return false;
		              	}
		              	var player={
		              		inx:0,
						id:'player0',
						src:path,
						width:'100%',
						height:'100%',
						fullScreen:true,
						mute:false,
						volume:1,
						controls:false
		              	};
		              	this.players.push(player);
		              }
		              this.top = this.ratioList.length*2+0.8;

		          }else{
		          	  	this.$emit('playFail','该视频无法播放');
		              	return false;
		          }
		      }
		});
	},
	//#endregion加载基本数据；

	//#region 核心业务;
	//进度条相关；
	progressChange(val){
	    var d=this.maxplayer.duration;
	    var t=d*val/100;

	    this.players.forEach(function(player){
	    	var player=document.getElementById(player.id)
	    	var duration=player.duration;
	    	if(t<=duration){
	    		player.currentTime=t;
	    		player.play();
	    	}
	    })

	    if (val==100) {
	      this.isStop=true;
	    }else{
	    	this.isStop=false;
	    }
	},
	fastBackward(){
	    var ct=this.maxplayer.currentTime;
	    ct--;
		this.players.forEach(function(player){
			var player=document.getElementById(player.id);
			if(ct>=0){
				player.currentTime=ct;
				player.pause();
			}
		})
	    this.isStop=true;
	},
	play(){
		var _this=this;
	 	if(this.maxplayer.paused){
	 		this.isStop=false;
	 	}else{
	 		this.isStop=true;
	 	}
		this.players.forEach(function(player){
			var player=document.getElementById(player.id);
			if(_this.isStop){
				player.pause();
			}else{
				player.play();
			}
		})

	  	event.stopPropagation();
	},
	fastForward(){
	    var ct=this.maxplayer.currentTime;
	    ct++;
		this.players.forEach(function(player){
			var player=document.getElementById(player.id);
			if(ct<=player.duration){
				player.currentTime=ct;
				player.pause();
			}
		})
	    this.isStop=true;
	},

	//#region 添加标注
	addMarker(){
	    var src=this.makeFrame();

	    this.firstplayer.pause();
	    this.isStop=true;
	    var time=this.current.split(':');
	    var stamp=time.join("'")+'"';
	    this.$emit('addMark',src,stamp);
	},
	makeFrame(){
	    var canvas=document.getElementById('canvas1');
	    var ctx=canvas.getContext('2d');
	    ctx.drawImage(this.firstplayer,0,0,320,180);
	    var d=canvas.toDataURL("image/png");
	    return d;
	},
	//#endregion 添加标注

	//#region显示当前时间/时长
	timeChange(){
	    var ct=this.maxplayer.currentTime;
	    var d=this.maxplayer.duration;
	    this.timeAll = d;
	    this.progress=Math.floor(ct/d*100);
	    this.current=this.getTime(ct);
	    this.duration=this.getTime(d);
	    if (ct==d) {
	    	this.isEnd=true;
	    	this.isStop = true;
	    }else{
	    	this.isEnd=false;
	    }
	},
	getTime(num){
		var time='00:00';
		if (isNaN(num)) {
		return time;
		}
		var n=Math.floor(num);
		var m=n>=60?parseInt(n/60):0;
		var s=n>=60?(n-60*m):n;
		time=(m>9?m:'0'+m)+':'+(s>9?s:'0'+s);
		return time;
	},
	//#endregion显示当前时间/时长

	volumeChange(val){
	    var v=val/100;
	    this.players.forEach(function(item,i){
	    	item.volume=v;
	    	var player=document.getElementById(item.id);
	    	if(!item.mute){
	    		player.volume=v;
	    	}else{
	    		player.volume=0;
	    	}
	    });
	},
	//切换分辨率
	ratioChange(r,e){
	    var dom=e.currentTarget;
	    $(dom).addClass('cur').siblings().removeClass('cur');
	    var time=this.firstplayer.currentTime;
	    this.curRadio=r.name;
	    var _this = this;
	    this.players.forEach(function(item,i){
	    	item.src=r.path;
	    	var player=document.getElementById(item.id);
		player.currentTime=time;
		player.play();
		_this.isStop = false;
	    });
	    $(".chose-video").css("display","none");
   	    $(".chose-video").removeClass('linav');
	},
	//#region 全屏
	fullScreen(){
	    this.launchFullScreen(this.firstplayer);
	},
	launchFullScreen(element){
	    if(element.requestFullscreen) {
	    element.requestFullscreen();
	    } else if(element.mozRequestFullScreen) {
	    element.mozRequestFullScreen();
	    } else if(element.msRequestFullscreen){
	    element.msRequestFullscreen();
	    } else if(element.oRequestFullscreen){
	    element.oRequestFullscreen();
	    }else if(element.webkitRequestFullscreen){
	    element.webkitRequestFullScreen();
	    }else{
	    var docHtml = document.documentElement;
	    var docBody = document.body;
	    var videobox = document.getElementById('videobox');
	    var cssText = 'width:100%;height:100%;overflow:hidden;';
	    docHtml.style.cssText = cssText;
	    docBody.style.cssText = cssText;
	    videobox.style.cssText = cssText+';'+'margin:0px;padding:0px;';
	    document.IsFullScreen = true;
	    }
	},

	//分辨率面板/声音面板的展开和收缩；
	toggleBlock(){
		if($(".chose-video").hasClass('linav')){
              $(".chose-video").css("display","none");
              $(".chose-video").removeClass('linav');
            }else{
              $(".chose-video").css("display","block");
              $(".chose-video").addClass('linav');
            };
            event.stopPropagation();
	},
	toggleVioce(){
		if($(".voice-chose").hasClass('linav')){
              $(".voice-chose").css("display","none");
              $(".voice-chose").removeClass('linav');
            }else{
              $(".voice-chose").css("display","block");
              $(".voice-chose").addClass('linav');
            };
            event.stopPropagation();
	},
	//#endregion 核心业务；

	//其他操作;
	//点赞
  	toggleDood(){
  		if(!this.canzan){//权限判断
  			return false;
  		}

  		this.$http.post('/resource/GiveThumbsup',{
		     rid:this.resid,
		     uid:this.uid
		}).then(res=>{
		    var d=$.parseJSON(res.data);
		    if (d) {
		        if (d.msgid==200) {
		        	    var data=d.data;
		        	    this.thumbsup=data.thumbsup;
		        	    this.isA=data.sign;
		        }
		    }
		});
  	},
  	//收藏；
  	toggleCollect(e){
  		// this.isB = !this.isB;
  		var dom = e.currentTarget;
      	if($(dom).hasClass('collect')){
      	   this.$http.post('/Resource/collectResource',{
      	      rid:this.resid,
      	      uid:this.uid
      	   }).then(res=>{
      	      var d = $.parseJSON(res.data);
      	      this.isShowtip = true;
      	      if(d.msgid == 200){
      	        this.isB = false;
      	        this.message = "收藏成功"
      	      }else{
      	        this.message = d.msg;
      	        this.isB = true;
      	      }
      	   })
      	}else{
      	  this.$http.post('/Resource/DiscollectResource',{
      	      rid:this.resid,
      	      uid:this.uid
      	   }).then(res=>{
      	      var d = $.parseJSON(res.data);
      	      if(d.msgid == 200){
      	        this.isB = true;
      	        this.isShowtip = true;
      	        this.message = "取消收藏成功"
      	      }
      	   })
      	}
  	},
  	//下载
  	downloadFiles(path){
  		oDownLoad(path);
  	},
  	setMute(p){
  		let player=document.getElementById(p.id);
  		p.mute=!p.mute;
  		if(p.mute){
  			p.volume=0;
  		}else{
  			p.volume=1;
  		}
  		player.volume=p.volume;
  	},
  	setFullScreen(p){
  		var el=document.getElementById(p.id);
  		this.launchFullScreen(el);
  	},
  	canplay(evt,p){
  		evt.target.volume=p.volume;
  	}
  }
}
</script>
<style lang="scss">
@media screen and (max-width: 1440px) {
	.video-play .chose-inner .el-slider.is-vertical .el-slider__runway{
 	  left:-0.95em !important;
 	}
 	.video-play .chose-inner .el-slider.is-vertical{
 	  bottom:-0.6em;
 	}
}
@media screen and (max-width: 1366px) {
	.video-play .play .controll .bar .bar-time .progress-control{
		width:42.8em !important;
	}
}
.video-play .play .controll .controll-btn span{
	border:none !important;
}
	.video-play{
		width:70%;
		height:40em;
		float:left;
		background:url("../../assets/module/u10.png") no-repeat;
		background-size:100% 100%;
		padding:0.5em;
		color:#999999;
		.el-slider__runway{
			z-index:2;
		}
		.chose-inner .vjs-caption-settings,.vjs-error-display,.vjs-control-bar,.vjs-big-play-button{
 		   display:none !important;
 		 }
 		 .voice{
			background:url("../../assets/videoPlay/u623.png") no-repeat center center;
		      background-size:45%;
		      float:right;
		      position:relative;
		      width:4em;
		      height:2.8em;
		      cursor:pointer;
		      // border-right:1px solid #222;
		      .voive-img{
		      	display:block;
		      	width:4em;
		      	height:2.8em;
		      }
			.voice-chose{
			      position:absolute;
			      width:3em;
			      height:10em;
			      background:url("../../assets/videoPlay/u568.png") no-repeat center center;
			      background-size:100% 100%;
			      top:-10em;
			      left:1em;
			      display:none;
			      z-index:999;

			      .chose-inner{
			        width:1.5em;
			        height:8em;
			        margin-top:1em;
			        margin-left:0.75em !important;
			        background:url("../../assets/videoPlay/u570.png") no-repeat center center;
			        background-size:100% 100%;
			        position:relative;

			        .blue-inner{
			          width:1em;
			          height:3em;
			          display:block;
			          background-color:#0099ff;
			          border-radius:10px;
			          position:absolute;
			          bottom:5px;
			          left:0.25em;
			        }
			      }
			    }
			}
			.no-voice{
				background:url("../../assets/videoPlay/novoice.png") no-repeat center center;
				background-size:45%;
				float:right;
			}
	        	.full{
			       background:url("../../assets/videoPlay/u81.png") no-repeat center center;
    					background-size:45%;
    					float:right !important;
    				}
    			.load{
					padding-left:1.8em;
					background:url("../../assets/videoPlay/u448.png") no-repeat left center;
					background-size:40%;
					cursor:pointer;
					float:right;
				}
 		 .chose-inner .el-slider.is-vertical .el-slider__bar{
 		   width:100%;
 		   border-radius:10px;
 		 }
 		.chose-inner .el-slider.is-vertical .el-slider__runway{
 		   height:7.5em;
 		   width:50%;
 		   position:relative;
 		   left:-0.6em;
 		   bottom:-0.5em;
 		   background:none;
 		 }
 		.chose-inner .el-slider__button{
 		   display:none !important;
 		 }
		.playBox{
			width:100%;
			height:35em;
			background:none;
		}

		.play{
			width:100%;
	        		height:92%;
	        		padding:1em;
	        		background:none;

	        		em{
	        			font-style:normal;
	        		}

	        		.video-box{
	        			width:100%;
	        			height:30em;
	        			background-color:#000;
	        			position:relative;
	        		}
	        		.player-box{
	        			float:left;
	        			.player-bar{
	        				position:relative;
	        				bottom:3.5em;
	        				right:0;
	        				float:right;
	        				width:100%;
	        				height:2.8em;
	        				span{
	        					width:2em;
	        					height:2em;
	        					display:block;
	        					background-size:70%
	        				}
	        			}
	        		}
	        		.player-cover{
					    width: 100%;
					    height: 100%;
					    position: absolute;
					    background-color:#000;
					    span{
					    		width:12em;
	        					height:12em;
							cursor:pointer;
	        					display:block;
	        					position:relative;
	        					top:50%;
	        					margin:0 auto;
	        					margin-top:-6em;
					    }
	        				.player-pause{
		  					background:url('../../assets/module/u610.png') no-repeat center center;
			  				background-size:50%;
	        				}
	        				.player-restart{
							background:url('../../assets/module/again.png') no-repeat center center;
							background-size:100%;
	        				}
	        		}
	        		.controll{
	        			width:100%;
	        			height:4em;
	        			background:url("../../assets/videoPlay/u10.png") no-repeat;
	        			background-size:100% 100%;
	        			padding:0.5em;

	        			.bar{
	        				width:98%;
	        				.bar-time{
	        					height:4px;
	        					margin-top:1px;
	        					width:20px;
	        					position:relative;
	                                      .progress-control{
	                                            position:relative;
	                                            width:44.8em;
	                                            top:-1em;
	                                            left:0em;
	                                      }

	        					.timer{
	        						width:5px;
	        						height:4px;
	        					}
	        					.now{
							position:absolute;
							width:10px;
							height:10px;
							border-radius:50%;
							left:5px;
							top:-3px;
							cursor:pointer;
	        					}

	        				}
	        			}
	        			.controll-btn{
	        				width:100%;
	        				margin-top:2px;

	        				span{
	        					float:left;
	        					width:4em;
	        					height:2.8em;
	        					cursor:pointer;
	        					border-right:1px solid #222;
	        				}
	        				.retrograde{
	        					background:url("../../assets/videoPlay/u5621.png") no-repeat center center;
	        					background-size:50%;
	        				}
	        				.stop{
	        					background:url("../../assets/videoPlay/u77.png") no-repeat center center;
	        					background-size:30%;
	        				}
	        				.stop_c{
	        					background:url("../../assets/videoPlay/u79.png") no-repeat center center;
	        					background-size:25%;
	        				}
	                                .cut-left{
	                                      background:url("../../assets/videoPlay/u5622.png") no-repeat center center;
	                                      background-size:40%;
	                                }
	                                .cut-right{
	                                      background:url("../../assets/videoPlay/u5623.png") no-repeat center center;
	                                      background-size:40%;
	                                }
	        				.forward{
	        					background:url("../../assets/videoPlay/u562.png") no-repeat center center;
	        					background-size:50%;
	        				}
	        				.mark{
	        					background:url("../../assets/videoPlay/u545.png") no-repeat center center;
	        					background-size:30%;
	        					border:none;
	        				}
	        				p{
	        					float:left;
	        					line-height:3em;
	        					margin-left:1em;
	        				}
	        				.resolution{
	        					float:right;
	        					text-align:center;
						      line-height:3em;
						      color:#0099ff;
						      position:relative;
						      width:4em;
	        					height:2.8em;
	        					// border-right:1px solid #222;

	        					em{
	        						display:block;
	        						width:4em;
	        						height:2.8em;
	        						cursor:pointer;

	        					}

	        					.chose-video{
	        						position:absolute;
	        						width:4em;
	        						height:auto;
	        						background:url("../../assets/videoPlay/u568.png") no-repeat center center;
	        						background-size:100% 100%;
	        						// top:-8em;
	        						left:0;
	        						color:#666666;
	        						display:none;
	        						li{
	        							height:2em;
	        							line-height:2em;
	        							cursor:pointer;
	        						}
	        						.cur{
	        							color:#0099ff;
	        						}
	        					}
	        				}


	        			}
	        		}
		}

		.bottom-icon{
			width:100%;
			overflow:hidden;
			padding-left:3em;
			margin-top:-2.7em;

			ul{
				width:100%;
				overflow:hidden;

				li{
					height:2em;
					line-height:2em;
					float:left;
					margin-right:2em;
				}
				.timesplay{
					padding-left:2em;
					background:url("../../assets/videoPlay/bo.png") no-repeat left center;
					background-size:25%;
				}
				.good{
					padding-left:1.2em;
					background:url("../../assets/videoPlay/u440.png") no-repeat left center;
					background-size:22%;
					cursor:pointer;
				}
				.have-good{
					padding-left:1.2em;
					background:url("../../assets/videoPlay/u444.png") no-repeat left center;
					background-size:22%;
					cursor:pointer;
				}
				.share{
					padding-left:1.5em;
					background:url("../../assets/videoPlay/u435.png") no-repeat left center;
					background-size:32%;
					cursor:pointer;
				}
				.collect{
					padding-left:1.8em;
					background:url("../../assets/videoPlay/u453.png") no-repeat left center;
					background-size:35%;
					cursor:pointer;
				}
				.have-collect{
					padding-left:1.8em;
					background:url("../../assets/videoPlay/u457.png") no-repeat left center;
					background-size:36%;
					cursor:pointer;
				}
			}
		}
	}
</style>
