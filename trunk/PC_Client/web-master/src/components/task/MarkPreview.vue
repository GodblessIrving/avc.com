<template>
<div v-if="isPreview" class="masklayer">
  <div class="preview" >
      <!-- <video-play 
        :isShow="isShow" 
        :isCut="isCut" 
        :resid="rid" 
        :number = "number"
        :cur="current"
        style="float:left" 
        :path="markinfo.path" 
        :previewMarks = "markinfo.marks"
        v-if="isvideo">
      </video-play> -->
      <play 
        :isShow="isShow"
        :isCut="isCut" 
        :resid="rid" 
        :number = "number"
        :cur="current" 
        :path="markinfo.path"  
        :previewMarks = "markinfo.marks" 
        v-if="isvideo">
      </play>
      <div class="play-view-top" v-if="!isvideo">
              <div class="play-top">
              <span class="left" v-bind:class="{'onPlay':isA,'onStop':!isA}"></span>
            </div>
            <video autoplay id="audio1"  @timeupdate="timeChange" :src="markinfo.path">
              <source :src="markinfo.path" type="audio/mpeg">
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
      <div class="pre-right">
        <p class="little-titlle">标注信息</p>
        <div class="info">
          <span class="left">提交者：</span>
          <div>
            <span v-if="markinfo.avatar" class="tou" v-bind:style = " { 'background-image' : 'url('+markinfo.avatar+')'} ">
              <!-- <img :src="markinfo.avatar" :onerror="dfPhoto" width="100%"> -->
            </span>
            <span v-else class="tou"></span>
            <span class="subName" :title="markinfo.submitter">{{markinfo.submitter?markinfo.submitter:'未命名'}}</span>
          </div>
        </div>
        <div class="info">
          <span class="left">提交时间：</span>
          <p>{{markinfo.subtime}}</p>
        </div>
        <ul class="mark-li">
          <li v-for="m in markinfo.marks" @click="getMarktime(m.timestamp)">
            <div class="img-left" style="cursor:pointer"> 
              <span class="img-box" v-if="m.pic" v-bind:style = "{ 'background-image' : 'url('+m.pic+')'} "></span>
              <span v-else class="img-box moren"></span>
              <span>{{m.timestamp}}</span>
            </div>
            <p class="right-text" style="-webkit-box-orient: vertical;" :title="m.description">{{m.description}}</p>
          </li>
        </ul>
      </div>
      <p class="close-btn" @click="close()"></p>
  </div>
</div>
</template>
<script>
 import videoPlay from "../videodetil/VideoPlay"
 import play from "../play"
export default {
  name: 'preview',
  data(){
    return{     
     isShow:false,
     isCut:false,
     isA:true,
     value3:30,
     value4:0,
     player:'',
     timeNow:'00:00',
     timeDuration:'00:00',
     current:0,
     dfPhoto:'this.src="'+require('../../assets/setUser/u404.png')+'"',
     number:0,
     noVioce:false,
     timeAll:0,
     timer:0,
    }
  },
  props:["isPreview","isvideo","markinfo","uid","rid"],
  watch:{
    isPreview(val,oldVal){
      var self = this;
      if(val&&!this.isvideo){
        this.timer = setTimeout(function(){
          for(var i = 0; i < self.markinfo.marks.length; i++){
            var s = self.getSecond(self.markinfo.marks[i].timestamp);
            var precent = parseInt(s/self.timeAll * 100);
            var dom = `<p class="precent" style="left:`+precent+`%" title="`+self.markinfo.marks[i].description+`"><p>`;
            $(dom).appendTo('.audio-progress .el-slider');
          }
        },1500)
      }
    },
  },
  destroyed(){
      clearTimeout(this.timer)
  },
  components:{play,videoPlay},
  methods:{
  	close(){
            this.$emit('closeNewEvent',"from preview");
      },
      
      //当前播放时间更新
      timeChange(){
          this.player = document.getElementById('audio1');
          if(this.player){
            var ct=this.player.currentTime;
            var d=this.player.duration;
            this.timeAll = d;
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
        this.player = document.getElementById('audio1');
        var d=this.player.duration;
        // this.timeDuration=this.getCurrent(d);
        console.log(d)
        var t=d*val/100;
        this.player.currentTime=t;
        if(val == 100){
          this.player.pause();
          this.isA=false;
        }    
      },
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
      getMarktime(time){
        this.number += 1;
        if(time.indexOf(':')>0){
          var timeArr = time.split(":");
        }else{
          var timeArr = time.split("'");
        }       
        var num = parseInt(timeArr[0]);
        var num1 = parseInt(timeArr[1]);
        var current = num*60 + num1;
        this.current = parseInt(current);
        this.player.currentTime = parseInt(current);
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
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1440px) {
      .preview .play-view-top video{
        height:8em;
      }
      .preview .precent{
        top:1.1em !important;
      }
   }
	.preview{
		      width:80em;
        		height:45em;
        		background:url("../../assets/module/u10.png") no-repeat;
        		background-size:100% 100%;
        		position:absolute;
        		z-index:10;
        		top:10em;
        		left:50%;
        		margin-left:-40em;
        		padding:2em;
            .player{
              float:left;
            }
            .precent{
                  width: 0.4em;
                  height: 0.39em;
                  background-color: #aaa;
                  border-radius: 50%;
                  position: absolute;
                  top: 1em;
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
              .subName{
                position:relative; 
                top:-2.5em; 
                margin-left:1em;
                display:inline-block;
                width:8em;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;

              }
              .pre-right{
                width:30%;
                height:41em;
                float:left;
                margin-top:5px;
                margin-left:1%;
                .little-titlle{
                  color:#0099ff;
                  font-size:1.2em;
                }
                .info{
                  width:100%;
                  height:auto;
                  margin-top:1.5em;

                  .left{
                    float:left;
                    width:25%;
                    text-align:right;
                    margin-right:2em;
                  }
                  .tou{
                    width:4em;
                    height:4em;
                    border-radius:50%;
                    overflow:hidden;
                    display:inline-block;
                    position:relative;
                    top:-1em;
                    background-size:cover;
                    background-repeat:no-repeat;
                    background-position:center center;
                    background-image:url('../../assets/setUser/u404.png');
                  }
                }
                .mark-li{
                  width:100%;
                  height:29em;
                  margin-top:1.5em;
                  overflow-y:auto;

                  li{
                    width:100%;
                    overflow:hidden;
                    margin-bottom:1.5em;
                    .img-left{
                      float:left;
                      width:40%;
                      height:7em;
                      text-align:center;
                      .img-box{
                        width:100%;
                        height:5.5em;
                        display:block;
                        background-color:#333333;
                        background-size:contain;
                        background-repeat:no-repeat;
                        background-position:center center;
                      }
                      .moren{
                          background-image:url('../../assets/module/u987.png')
                      }
                    }
                    .right-text{
                      float:left;
                      margin-left:1em;
                      width:55%;
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      overflow: hidden;
                      height:4em;
                    }
                  }
                }
              }
	}

</style>