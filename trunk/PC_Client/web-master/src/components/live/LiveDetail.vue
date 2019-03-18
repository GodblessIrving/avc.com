<template>
  <div class="live-detail">
    <!-- <slide-nav></slide-nav> -->
    <div class="search-views">
    <div class="search">
      <input type="text" class="search-in" placeholder="为您模糊搜索直播频道、直播课程..." v-model="key">
      <a href="javascript:viod(0)" class="searBtn" @click=" goTosearch()">搜索</a>
    </div>
    <div class="title">
        <p style="margin-left:2em;">
          <img src="../../assets/module/u14.png" alt="" width="40%">
        </p>
        <p class="break">
          <span style="cursor:pointer; " @click="gotoLive()">直播</span>
          <span>-></span>
          <span>{{info.title}}</span>
        </p>
    </div>
    	<div id="liveVideo" style="width: 600px; height: 400px;"></div>
    <div class="live-play">
      <div class="player1">
            <div class="cover" v-if="isCover">
              <img src="../../assets/live/u222.png" width="30%">
              <p>距离直播结束还有{{secod}}S</p>
            </div>



            <object type="application/x-shockwave-flash" data="../../../static/player7000.swf" width="100%" height="100%" id="livePlayer" style="background-color:black;">
                <param name="movie" value="../../../static/player7000.swf">
                <param name="quality" value="high" />
                <param name="allowFullScreen" value="true" />
                <param name="bgcolor" value="#000000" />
                <param name="play" value="false" />
                <param name="loop" value="false" />
                <param name="wmode" value="transparent" />
                <param name="scale" value="showall" />
                <param name="menu" value="false" />
                <param name="devicefont" value="false" />
                <param name="salign" value="lm" />
                <param name="allowScriptAccess" value="always" />
            </object>
      </div>
      <div class="controls">
        <p class="time">
          <span>当前时间：</span>
          <span style="color:#0099ff; margin-left:1em;">{{ntime}}</span>
        </p>
        <p class="time">
          <span>结束时间：</span>
          <span style="color:#0099ff; margin-left:1em;">{{info.etime}}</span>
        </p>
        <!-- <span class="full" @click="requestFullScreen" v-show="ifone"></span> -->
        <div class="voice" :class="[volume!=0?'':'no-voice']">
              <span class="voive-img" @click="toggleVioce()"></span>
              <div class="voice-chose">
                <p class="chose-inner">
                  <el-slider
                    vertical
                    v-model="volume"
                    height="7.5em"
                    @change="volumeChange">
                  </el-slider>
                </p>
              </div>
        </div>
      </div>
      <div class="operations">
        <span class="watch">{{watch}}人在看</span>
        <span v-bind:class="[isGood?'good':'have-good']" @click="toogle()" v-if="zan">（{{info.zan}}赞）</span>
      </div>
    </div>
  </div>
  <live-rightlist></live-rightlist>
  <alert-tip :message='message' :isShowtip="isShowtip" @closeTipEvent="closeTip"></alert-tip>
  </div>
</template>
<script>
import LiveRightlist from "./LiveRightlist"
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import {videoPlayer} from 'vue-video-player'
import 'videojs-flash'
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
import alertTip from "../alertTip"

var player;

window['Ready'] = function(argument){


      player = document.getElementById("livePlayer");
      //初始化
      var inx=window.location.href.indexOf('?');
      var parms=window.location.href.substr(inx+1);
      var id=parms.split('=')[1];
      $.ajax({
        url: window.config.host+'/api/Live/GetLivechannelDetails',
        type: 'GET',
        xhrFields:{withCredentials:true},
        dataType: 'json',
        data: {id: id},
      })
      .done(function(d) {
        var res=$.parseJSON(d);
        if(res.data){
debugger
            var videoObject = {
                container:'#liveVideo',
                variable:'player1',
                autoplay:true,
                logo:'null',
                video:res.data.url
              };

          var player1 = new ckplayer(videoObject);

          var addrs=res.data.url.split(',');
          debugger
          player.SetMode(addrs.length-1);
          for(var i=0;i<addrs.length;i++){
              var path=addrs[i].replace('rtmp://','');
              var inx=path.lastIndexOf('\/');
              var server=path.substring(0,inx);
              var channel=path.substring(inx+1,path.length);
              player.SetChannel(i,server,channel);
              if (i > 0) {
                  player.SetVolume(i, 0);
              }
          }
        }
      })
      .fail(function(e) {
        console.log(e);
      });
};
export default {
  name: 'live-detail',
  data(){
    return{
      isGood:true,
      key:'',
      id:'',
      info:[],
      ntime:'00:00:00',
      secod:0,
      isCover:false,
      endScord:0,
      nowScord:0,
      watch:'',
      timeNow:[],
      message:'',
      isShowtip:false,
      timer:0,
      players:[],
      volume:100,
      timer1:0,
      timer2:0,
      ifone:true
    }
  },
  beforeRouteLeave (to, from, next) {
      this.postWatchNum();
      clearInterval(this.timer);
      clearInterval(this.timer1);
      clearTimeout(this.timer2)
      next()
   },
  components:{LiveRightlist,videoPlayer,alertTip},
  computed: {
      uid:function(){
        return this.$store.state.user.uid;
      },
      zan:function(){
        var auth=getChildrenAuth('/live');
        return handleAuth(4,auth);
      },
  },
  created(){
    this.id = this.$route.query.id;
    this.getdetail();
  },
  mounted:function(){
    this.getNowtime();
    this.getWatchNum();
    var self = this;
    this.timer= setInterval(function(){
      self.$http.get('Live/GetLivechannelDetails',{
        params:{
          id:self.id
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            if(!d.data){
              self.isShowtip = true;
              self.message = "管理员已经禁用或删除了该频道，请关闭后退出，给您带来的不便请您谅解！";
              self.timer2 = setTimeout(function(){
                self.$router.push('/live');
              }, 5000)
            }
          }else{
            console.log(d.msg)
          }
        }
      })
    }, 20000)
  },
  methods:{
    getdetail(){
      this.$http.get('Live/GetLivechannelDetails',{
        params:{
          id:this.id
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid==200){
            this.info = d.data;
            var a = this.info.etime.split(":");
            this.endScord = parseInt(a[0])*3600 + parseInt(a[1])*60;
           if(this.info.currentstatus == 0){
            this.isGood = true;
           }else{
            this.isGood = false;
           }
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    closeTip(){
      this.isShowtip = false;
    },
    getWatchNum(){
      this.$http.get('Live/EnterLive',{
        params:{
          type:1,
          lid:this.id
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid==200){
            this.watch = d.data;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    postWatchNum(){
      this.$http.get('Live/ExitLive',{
        params:{
          type:1,
          lid:this.id
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid!==200){
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    goTosearch(){
      this.$router.push({path:'/live/search',query:{keys:this.key} });
    },
   getNowtime(){
        var self = this;
        this.$http.get('Live/GetNow',{
          params:{}
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d.msgid == 200){
            var timeArr = d.data.split(" ");
            this.timeNow = timeArr[1].split(":");
            this.ntime = timeArr[1];
            this.timer1=setInterval(getTime,1000);
            function getTime(){
              var ss = self.timeNow[2];
              var mm = self.timeNow[1];
              var HH = self.timeNow[0];
              var str = '';
              if(++ss==60){
                 if(++mm==60){
                    HH++;
                    mm=0;
                  }
                  ss=0;
              }
              str+=HH<10?"0"+parseInt(HH):HH;
              str+=":";
              str+=mm<10?"0"+parseInt(mm):mm;
              str+=":";
              str+=ss<10?"0"+parseInt(ss):ss;
              self.timeNow = str.split(':');
              if(self.timeNow){
                self.ntime = self.timeNow[0]+':'+self.timeNow[1]+':'+self.timeNow[2]
              }
              self.nowScord = parseInt(HH)*3600 + parseInt(mm)*60 + parseInt(ss);
              self.secod = self.endScord - self.nowScord;
              if( self.secod <= 15){
                self.isCover = true;
                if(self.secod <= 0){
                      self.$router.push('/live');
                }
              }else{
                self.isCover = false;
              }
            };
         }
      })
    },
    gotoLive(){
      this.$router.push('/live');
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
    toogle(){
      if(this.zan){
        this.isGood = !this.isGood
      }
      this.$http.post('/Live/GiveThumbsup',{
        id:this.id,
        uid:this.uid
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid==200){
            var data = d.data;
            this.info.zan = data
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      });
    },
    volumeChange(val){
      var v=val/100;
      player.SetVolume(0, v);
    },
    requestFullScreen() {
       this.launchFullScreen(player);
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
  }
}
</script>

<style lang="scss">
@media screen and (-webkit-min-device-pixel-ratio:0){
  .livesearch-view .search-view-right .show-view ul li{
    margin-left:4em !important;
  }
}
@media screen and (max-width: 1440px) {
  .el-slider.is-vertical .el-slider__runway{
    left:-0.95em !important;
  }
  .el-slider.is-vertical{
    bottom:-0.6em;
  }
}
.video-js.vjs-fluid, .video-js.vjs-16-9, .video-js.vjs-4-3{
  height:100% !important;
}
.live-detail{
  width:100%;
  overflow:hidden;
  height:85em;
  color:#fff;
  position:relative;
  top:-85em;
  left:5%;
  em{
    font-style:normal;
  }
  .vjs-caption-settings,.vjs-error-display,.vjs-control-bar,.vjs-big-play-button{
    display:none !important;
  }
  .el-slider.is-vertical .el-slider__bar{
    width:100%;
    border-radius:10px;
  }
  .el-slider.is-vertical .el-slider__runway{
    height:7.5em;
    width:50%;
    position:relative;
    left:-0.6em;
    bottom:-0.3em;
    background:none;
  }
  .el-slider__button{
    display:none !important;
  }
  .green{
    color:green;
  }
  .red{
    color:red;
  }
  .left{
    float:left;
    margin-left:5px;
  }
  .right{
    float:right;
    margin-right:5px;
  }
  .search-views{
    float:left;
    width:62%;
    height:83em;
    background:url("../../assets/module/u10.png") no-repeat;
    background-size:100% 100%;
    margin-left:1.5%;
    margin-top:6px;
    text-align:center;
    position:relative;
    .el-pagination{
      position:absolute;
      width:100%;
      bottom:3em;
    }
    .el-pagination .btn-next, .el-pagination .btn-prev{
      padding:0 10px;
    }
    .search{
      margin-top:40px;
      height:60px;
      width:55%;
      display:inline-block;
      background:url("../../assets/module/u2098serch.png") no-repeat;
      background-size:100% 100%;

      .search-in{
        float:left;
        width:75%;
        background:#1c1f1f;
        height:33px;
        border-radius:5px;
        margin-top:11px;
        margin-left:2.5%;
        padding-left:2%;
        }

        .searBtn{
          margin-top:10px;
          width:20%;
          height:33px;
          float:left;
          line-height:33px;
          font-size:1.2em;
          background:url("../../assets/module/u2100.png") no-repeat 25%;
          background-size:30%;
          padding-left:6%;
      }
    }
    .title{
      width:102%;
      height:3.5em;
      line-height:3.5em;
      background:url("../../assets/module/u12.png") no-repeat;
      background-size:100% 100%;
      margin-left:-1%;
      margin-top:1em;

      p{
        height:3.5em;
        width:6%;
        text-align:center;
        float:left;
        line-height:3em;
      }
      .break{
        width:90%;
        text-align:left;
            color:#ffffff;
      }
    }
    .live-play{
      width:72em;
      margin:1em auto;
      height:55em;
      padding:2em;
      background:url("../../assets/module/u10.png") no-repeat;
      background-size:100% 100%;
      .player1{
        width:100%;
        height:38.25em;
        position:relative;
        .cover{
          width:100%;
          height:100%;
          position:absolute;
          background:rgba(#000, 0.5);
          z-index:10;
          text-align:center;
          padding-top:5em;
          color:#3a99ff;
        }
      }
      .controls{
        width:100%;
        height:4em;
        margin-top:1em;
        background:url("../../assets/videoPlay/u10.png") no-repeat;
        background-size:100% 100%;
        line-height:4em;
        padding:0 2em;

        .time{
          float:left;
          margin-right:4em;
          margin-bottom:0;
        }
        .full{
                 background:url("../../assets/videoPlay/u81.png") no-repeat center center;
                  background-size:50%;
                  float:right;
                  width:4em;
                  height:4em;
                  cursor:pointer;
        }
        .voice{
            background:url("../../assets/videoPlay/u623.png") no-repeat center center;
            background-size:45%;
            float:right;
            position:relative;
            width:4em;
            height:4em;
            cursor:pointer;
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
              top:-9em;
              left:1em;
              display:none;

              .chose-inner{
                width:1.5em;
                height:8em;
                margin-top:1em;
                margin-left:0.75em;
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
            }
      }
      .operations{
          width:100%;
          padding:0 1em;
          height:4em;
          line-height:4em;
          color:#999;
          text-align:left;
          .watch{
            padding-left:2em;
            background:url("../../assets/videoPlay/bo.png") no-repeat left center;
            background-size:30%;
            float:left;
            margin-right:3em;
          }
          .good{
            padding-left:1.5em;
            background:url("../../assets/videoPlay/u440.png") no-repeat left center;
            background-size:25%;
            float:left;
            margin-right:3em;
            cursor:pointer;
          }
          .have-good{
            padding-left:1.5em;
            background:url("../../assets/videoPlay/u444.png") no-repeat left center;
            background-size:25%;
            float:left;
            margin-right:3em;
            cursor:pointer;
          }
      }
    }

  }
}

</style>
