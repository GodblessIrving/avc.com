<template>
  <div class="player">
      <video autoplay id="player"  @timeupdate="timeChange" crossOrigin="anonymous">
      	   <source  type="video/mp4" />
      </video>
      <div class="controll">
      	<div class="bar">
      		<div class="bar-time">
                  <div class="block" style="height:10px;">
                    <span class="demonstration"></span>
                    <el-slider v-model="progress" class="progress-control"  
                    @change="progressChange" :show-tooltip="false" style="iwdth:100%"></el-slider>
                  </div>
      		</div>
      		<div class="controll-btn">
      			<span class="retrograde" v-show="isShow" @click="fastBackward"></span>
      			<span v-bind:class="[isStop?'stop_c':'stop']" @click="play"></span>
                    <span class="cut-left" v-show="isCut"></span>
                    <span class="cut-right" v-show="isCut"></span>
      			<span class="forward" v-show="isShow" @click="fastForward"></span>
      			<p>
      				<em style="color:#0099ff">{{current}}</em>
      				<em>/</em>
      				<em>{{duration}}</em>
      			</p>
      			<span class="full" @click="fullScreen"></span>
      			<div class="resolution" v-show="isShow">
      				<em @click="toggleBlock()">高清</em>
      				<div class="chose-video">
      					<ul>
      						<li @click="ratioChange(2,$event)">超清</li>
      						<li class="cur" @click="ratioChange(1,$event)">高清</li>
      						<li @click="ratioChange(0,$event)">标清</li>
      					</ul>
      				</div>
      			</div>
      			<div class="voice-icon" :class="[volume!=0?'':'no-voice']">
                      <span class="voive-img" @click="toggleVioce()"></span>
                        <div class="voice-chose">
                        <p class="chose-inner">
                          <el-slider
                            vertical
                            v-model="volume"
                            height="6.5em"
                            :show-tooltip="false"
                            @change="volumeChange">
                          </el-slider>
                        </p>
                      </div>
              </div>
      		</div>
      	</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'play',
  data(){
  	return{
  		isBlock:false,
  		voiceBlock:false,
            isAdd:false,
            isStop:false,
            player:null,
            current:'00:00',
            duration:'00:00',
            volume:60,
            progress:0,
            isfull:false,
            //抽帧数据
            picPath:'',//base64帧图地址；
            timestamp:'',
            frameAddr:'',//上传存储服务器后，得到的帧图地址；
            frameMD5:'',
            timeAll:0,
  	}
  },
  props:["isShow","isCut","path","resid","cur","number","previewMarks"],
  watch:{
    number:function(){
      this.player.currentTime = this.cur;
    },
    previewMarks(val,oldval){
      $(".precent").remove();
      var self = this;
      if(val.length >= 1){
        this.timer1 = setTimeout(function(){
            for(var i = 0; i < val.length; i++){
              var s = self.getSecond(val[i].timestamp);
              var precent = parseInt(s/self.timeAll * 100);
              var dom = `<p class="precent" style="left:`+precent+`%" title=`+val[i].description+`><p>`;
              $(dom).appendTo('.block .el-slider');
            }
          }, 1500)
      }
    },
  },
  mounted(){
      this.getPlayPaths()
      this.player=document.getElementById('player');
      this.volume = this.player.volume*100;
  },
  methods:{
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
                        this.player.src=path;
                        this.player.play();
                      }
                      var top = this.ratioList.length*2+0.8;
                      $(".chose-video").css("top",-top+'em')
                  }else{
                      
                  }
              }
        });
      },
  	toggleVioce(){
  		if($(".voice-chose").hasClass('linav')){
              $(".voice-chose").css("display","none");
              $(".voice-chose").removeClass('linav');
            }else{
              $(".voice-chose").css("display","block");
              $(".voice-chose").addClass('linav');
              this.volume = this.player.volume*100;
            };
            event.stopPropagation();  
  	},
    toggleAdd(){
      this.isAdd = true;
    },
    closeAdd(){
      this.isAdd = false;
    },
    play(){
      this.isStop = ! this.isStop;
      if (this.player.paused) {
        this.player.play();
      }else{
        this.player.pause();
      }
    },
    fastBackward(){
        var ct=this.player.currentTime;
        ct--;
        this.player.currentTime=ct;
    },
    fastForward(){
        var ct=this.player.currentTime;
        ct++;
        this.player.currentTime=ct;
    },
    timeChange(){
        var ct=this.player.currentTime;
        var d=this.player.duration;
        this.timeAll = d;
        this.progress=Math.floor(ct/d*100);
        this.current=this.getTime(ct);
        this.duration=this.getTime(d);
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
    volumeChange(val){
        var v=val/100;
        this.player.volume=v;
    },
    progressChange(val){
        var d=this.player.duration;
        var t=d*val/100;
        this.player.currentTime=t;
        if (this.player.paused) {
          this.player.play();
          this.isStop=false;
        }
    },
    fullScreen(){
        var el=this.player;   
        this.launchFullScreen(el);
        this.isfull=true;
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
  },
}
$(document).click(function(){  
   $(".chose-video").css("display","none");
   $(".chose-video").removeClass('linav');
   $(".voice-chose").css("display","none");
   $(".voice-chose").removeClass('linav');
});
</script>

<style lang="scss">
@media screen and (max-width: 1440px) {
    .el-slider__runway{
      top:-0.3em !important;
    }
    .player .chose-inner .el-slider.is-vertical{
      bottom:-1.2em !important;
      left:0.1em;
    }
    .player .controll .controll-btn .voice-icon .voice-chose .chose-inner .el-slider__runway{
      left:-1.1em !important;
    }
}
    .video-play .play .controll .controll-btn span{
      border:none !important;
    }
	.player{
		width:52em;
        		height:42em;
        		padding:1em;
        		background:url("../assets/module/u10.png") no-repeat;
        		background-size:100% 100%;
                  .el-slider__runway{
                    margin-bottom:0;
                  }
        		em{
        			font-style:normal;
        		}

        		video{
        			width:100%;
        			height:35em;
        		}
        		.controll{
        			width:100%;
        			height:4em;
        			background:url("../assets/videoPlay/u10.png") no-repeat;
        			background-size:100% 100%;
        			padding:0.5em;

        			.bar{
        				width:100%;
        				height:8px;
        			
        				.bar-time{
        					height:4px; 
        					margin-top:1px;
        					width:100%;
        					position:relative;
                                      .progress-control{
                                            position:relative;
                                            width:100%;
                                            top:-1em;
                                            left:0em;
                                            height:10px;
                                      }
	
        					.timer{
        						width:5px;
        						height:4px;
        						background-color:#0099ff;
        					}
        					.now{
						position:absolute;
						width:10px;
						height:10px;
						border-radius:50%;
						background-color:#0099ff;
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
        					background:url("../assets/videoPlay/u5621.png") no-repeat center center;
        					background-size:50%;
                                     cursor:pointer;
        				}
        				.stop{
        					background:url("../assets/videoPlay/u77.png") no-repeat center center;
        					background-size:30%;

        				}
        				.stop_c{
        					background:url("../assets/videoPlay/u79.png") no-repeat center center;
        					background-size:25%;
                                      cursor:pointer;
        				}
                                .cut-left{
                                      background:url("../assets/videoPlay/u5622.png") no-repeat center center;
                                      background-size:40%;
                                }
                                .cut-right{
                                      background:url("../assets/videoPlay/u5623.png") no-repeat center center;
                                      background-size:40%;
                                }
        				.forward{
        					background:url("../assets/videoPlay/u562.png") no-repeat center center;
        					background-size:50%;
        				}
        				.mark{
        					background:url("../assets/videoPlay/u545.png") no-repeat center center;
        					background-size:30%;
        					border:none;
        				}
        				p{
        					float:left;
        					line-height:3em;
        					margin-left:1em;
        				}
        				.full{
					       background:url("../assets/videoPlay/u81.png") no-repeat center center;
        					background-size:45%;
        					float:right;
        				}
        				.resolution{
        					float:right;
        					text-align:center;
					      line-height:3em;
					      color:#0099ff;
					      position:relative;
					      width:4em;
        					height:2.8em;
        					border-right:1px solid #222;

        					em{
        						display:block;
        						width:4em;
        						height:2.8em;
        						cursor:pointer;

        					}

        					.chose-video{
        						position:absolute;
        						width:4em;
        						height:8em;
        						background:url("../assets/videoPlay/u568.png") no-repeat center center;
        						background-size:100% 100%;
        						top:-8em;
        						left:0;
        						color:#666666;
                                          display:none;
        						li{
        							height:2em;
        							cursor:pointer;
        						}
        						.cur{
        							color:#0099ff;
        						}
        					}
        				}
                                
        				.voice-icon{
        					background:url("../assets/videoPlay/u623.png") no-repeat center center;
        					background-size:45%;
        					float:right;
        					position:relative;
        					width:4em;
        					height:2.8em;
        					cursor:pointer;
        					border-right:1px solid #222;
					     .voive-img{
					     	     display:block;
					     	     width:4em;
        				      		height:2.8em;
					     }
        					.voice-chose{
        						position:absolute;
        						width:3em;
        						height:10em;
        						background:url("../assets/videoPlay/u568.png") no-repeat center center;
        						background-size:100% 100%;
        						top:-10em;
        						left:1em;
                                          display:none;

        						.chose-inner{
							     width:1.5em;
        							height:8em;
        							margin-top:1em;
        							margin-left:0.75em;
        							background:url("../assets/videoPlay/u570.png") no-repeat center center;
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
                                                  .el-slider__runway{
                                                    left:-0.55em;
                                                    top:0.8em;
                                                    background:none;
                                                  }
                                                  .el-slider__button-wrapper .el-tooltip{
                                                    display:none;
                                                  }
                                                  .el-slider.is-vertical .el-slider__bar{
                                                    width:10px;
                                                    border-radius:5px;
                                                  }
        						}
                                            .voice-control{
                                                top:0.5em;
                                                left:0.3em;
                                            }
        					}
        				}
                                .no-voice{
                                   background:url("../assets/videoPlay/novoice.png") no-repeat center center;
                                   background-size:45%;
                                   float:right;
                                }
        			}
        		}
	}

</style>