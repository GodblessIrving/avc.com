<template>
<div v-if="isPreview" class="masklayer">
  <div class="preview">
      <!-- <video-play :path="path" style="float:left" v-if="isvideo" :resid="rid" :isShow="isShow"></video-play> -->
      <play :isShow="isShow" :isCut="isCut" :path="path" :resid="rid" style="float:left" v-if="isvideo"></play>
      <div class="play-view-top" v-if="!isvideo">
              <div class="play-top">
              <span class="left" v-bind:class="{'onPlay':isA,'onStop':!isA}"></span>
              <div class="right">
                <p class="play-title" style="-webkit-box-orient: vertical;">{{profile.title}}</p>
              </div>
            </div>
            <video autoplay id="audio1"  @timeupdate="timeChange">
              <source :src="path" type="audio/mpeg">
            </video>
            <div class="audio-progress">
                <el-slider v-model="value4" @change="progressChange"  :show-tooltip="false"></el-slider>
            </div>
            <div class="oprationBtn">
              <ul>
                <li class="time">
                  <span style="color:#0099ff">{{timeNow}}</span>
                  <span style="color:#999">/</span>
                  <span style="color:#999">{{timeDuration}}</span>
                </li>
                <li class="playBtn" v-bind:class="{'onPlayBtn':isA,'onStopBtn':!isA}" @click="toggle()"></li>
                <li class="audio-voice">
                  <span class="voice-icon" :class="[value3!=0?'':'no-voice']" style="cursor:pointer;" @click="StopVioce"></span>
                  <div class="voice-outer">
                    <el-slider v-model="value3" :format-tooltip="changeVoice" ></el-slider>
                  </div>
                </li>
              </ul>
            </div>
          </div>
       <copy 
                class="preview-copy" 
                :isShow="isShow" 
                :v-show="isView" 
                :isPic="false" 
                :isedit = "isedit"
                :isAudio="true"
                :tipArr="tipArr"
                :tid="tid"
                :classList="classList"
                :mestitle="mestitle"
                :copyright= "copyright"
                :duration="duration"
                :format="format"
                :sourceList="sourceList"
                @addNewEvent="addsuess"
                @closeNewEvent="close"
                :profile="profile"></copy>
      <p class="close-btn" @click="close()"></p>
  </div>
</div>
</template>

<script>
// import videoPlay from "../videodetil/VideoPlay"
 import copy from "../videodetil/CopyInfo"
 import play from "../play"
export default {
  name: 'preview',
  data(){
    return{     
     isShow:false,
     isCut:false,
     isA:true,
     value3:100,
     value4:0,
     player:'',
     timeNow:'00:00',
     timeDuration:'00:00',
     edit:false,
     noVioce:false,
     nowVoice:0,
    }
  }, 
  props:["isPreview","isView","path","isvideo","rid","profile","copyright","tipArr","mestitle","duration","format","isedit","classList","sourceList","tid","uid"],
  components:{copy,play},
  methods:{
  	close(){
            this.$emit('closeNewEvent');
      },
      addsuess(){
          this.$emit('addNewEvent');
      },
      //当前播放时间更新
      timeChange(){
          this.player = document.getElementById('audio1');
          if(this.player){
            var ct=this.player.currentTime;
            var d=this.player.duration;
            this.value4=ct/d*100;
            this.timeNow=this.getCurrent(ct);
            this.timeDuration=this.getCurrent(d);
            if(ct == d){
              this.isA = false;
            }
          }
      },
      // 进度条拖动
      progressChange(val){
        var d=this.player.duration;
        var t=d*val/100;
        this.player.currentTime=t;
        if(val == 100){
          this.player.pause();
          this.isA=false;
        }     
      },
      // 时间转换
      getCurrent(time){
        if(!time){
          return "00:00"
        }
        var i=0 , s = parseInt(time);
        var timer;
        if(s>60){
            i=parseInt(s/60);
            s=parseInt(s%60);
          }
          if(parseInt(i) < 10){
            i = "0"+i
          }
          if(parseInt(s) < 10){
            s = "0"+s
          }
          timer = i+':'+s;
          return timer;
      },
      // 音量
      changeVoice(val){
          this.player = document.getElementById('audio1');
          if(this.player){
            this.player.volume = val / 100;
          }
      },
      StopVioce(){
        if(!this.noVioce){
          this.nowVoice = this.value3;
          this.player.volume = 0;
          this.value3 = 0;
          this.noVioce = true;
        }else{
          this.noVioce = false;
          this.value3 = this.nowVoice;
        }
      },
      // 播放和暂停
      toggle(){
        this.isA = !this.isA;
        if(this.player.paused){
          if(this.timeDuration == this.timeNow){
            this.timeNow = '00:00'
          }
          this.player.play();
        }else{
          this.player.pause();
        }
      },
  }
}
</script>

<style lang="scss">
    @media screen and (max-width: 1366px) {
      .preview{
        margin-top:-16.5em !important;
        top:20em !important;
      }  
    }
    .video-play{
      width:67%;
    }
	.preview{
	  width:80em;
        height:45em;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:13em;
        left:50%;
        margin-left:-40em;
        padding:2em;
        .video-play .play .controll .bar .bar-time .progress-control{
          width:45.8em;
        }
           .play-view-top{
                width:61%;
                height:23em;
                background:url("../../assets/audioPlay/u307.png") no-repeat left top;
                background-size:100%;
                position:relative;
                float:left;
                margin-right:2em;
                top:6em;
                .play-top{
                      width:100%;
                      padding:3em 3em 2em;
                      overflow:hidden;
                      height:14em;
                      .left{
                          float:left;
                          width:14em;
                          height:9em;
                  }
                  .onPlay{
                    background:url("../../assets/audioPlay/u92.gif") no-repeat left top;
                    background-size:100%;
                  }
                  .onStop{
                    background:url("../../assets/audioPlay/u812.png") no-repeat left top;
                    background-size:100%;
                  }
                  .right{
                    float:right;
                    width:63%;
                    .play-title{
                        width:100%;
                        display: -webkit-box;
                        font-size:1.3em;
                        height:3em;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        margin-bottom:0.8em;
                  }
                .times{
                  padding-left:2em;
                  background:url("../../assets/videoPlay/bo.png") no-repeat left center;
                  background-size:6%;
                  color:#999;
                }
              }
            }
            .audio-progress{
              width:88%;
              margin: 1em auto;
              height:0.5em;
              position:relative;
              top:-10em;
              border-radius:10px;
            }
            .oprationBtn{
              width:100%;
              position:absolute;
              bottom:0;
              height:4em;
              background:url("../../assets/audioPlay/u300.png") no-repeat left top;
              background-size:100% 100%;
              border-radius:5px;

              ul{
                width:95%;
                margin:0.5em auto;
                height:3em;
                background:url("../../assets/audioPlay/u301.png") no-repeat left top;
                background-size:100% 100%;
                padding:0.2em 0;
                box-sizing:border-box;

                li{
                  float:left;
                  line-height:2.8em;
                  height:2.8em;
                }
                .time{
                  width:8.3em; 
                  text-align:center; 
                  border-right:1px solid #0b0b0b;
                }
                .playBtn{
                  width:6em;
                  height:6em;
                  cursor:pointer;
                  position:relative;
                  top:-1.5em;
                  margin-left:9.2em;
                  margin-right:4em;
                }
                .onPlayBtn{
                  background:url("../../assets/audioPlay/u305.png") no-repeat center center;
                  background-size:100%;
                }
                .onStopBtn{
                  background:url("../../assets/audioPlay/u304.png") no-repeat center center;
                  background-size:100%;
                }
                .audio-voice{
                  margin-left:2em;
                  .voice-icon{
                    float:left;
                    width:3em;
                    height:2.8em;
                    background:url("../../assets/videoPlay/u623.png") no-repeat center center;
                    background-size:50%;
                  }
                  .no-voice{
                    background:url("../../assets/videoPlay/novoice.png") no-repeat center center;
                    background-size:50%;
                  }
                  .voice-outer{
                    float:left;
                    width:10em;
                    height:0.5em;
                    border-radius:10px;
                    margin-top:0.2em;
                    cursor:pointer;
                    .el-slider__button{
                      display:none;
                    }
                    .el-slider__bar{
                      border-radius:10px;
                      background-color:#fff;
                    }
                    .el-slider__runway{
                      background-color:#999;
                    }
                  }
                }
              }
            }
          }
              .preview-copy{
                float:left;
                height:41em;
                overflow-y:hidden;
                .first,.second{
                  height:auto;
                }
                .left{
                  width:34%;
                }
                .right{
                  width:60%;
                }
              }
              .close-btn{
                position:absolute;
                right:10px;
                width:3em;
                height:3em;
                border-radius:50%;
                background:url("../../assets/resouce/u1153.png") no-repeat;
                background-size:100%;
                cursor:pointer;
                top:10px;
              }
	}

</style>