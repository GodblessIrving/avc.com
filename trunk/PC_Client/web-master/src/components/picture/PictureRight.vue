<template>
  <div class="picture-right" >
     <search :name="name" :title="profile.title"></search>
     <div class="pic-left">
        <div class="pic-view">
          <div class="pic-view-inner">
            <ul class="big-img">
              <li v-for="(a,index) in altas" class="liimg" v-if="a.path" v-bind:style = " { 'background-image' : 'url('+a.path+')'} " :value="index">
                <div class="bottom-text">
                  <p class="pic-total">
                    <span style="color:#0099ff">{{inx+1}}</span>
                    <span style="color:#666666">/</span>
                    <span style="color:#666666">{{profile.count}}</span>
                  </p>
                  <p class="pic-title">{{a.title}}</p>
                </div>
              </li>
              <li class="liimg" v-else :value="index">
                <div class="bottom-text">
                  <p class="pic-total">
                    <span style="color:#0099ff">{{inx+1}}</span>
                    <span style="color:#666666">/</span>
                    <span style="color:#666666">{{profile.count}}</span>
                  </p>
                  <p class="pic-title">{{a.title}}</p>
                </div>
              </li>
            </ul>
            <a href="javascript:void(0)" class="left-btn" @click="forward" v-show="forwardOne"></a>
            <a href="javascript:void(0)" class="right-btn" @click="next" v-show="nextOne"></a>
          </div>
        </div>
        <div class="operation-box">
          <ul>
              <li class="times">点击量{{play}}</li>
              <li v-bind:class="{'good':isA,'have-good':!isA}" @click="toggleDood()" v-if="canzan">（{{thumbsup}}赞）</li>
              <li v-if="canshare" class="share" title="功能正在开发中，敬请期待">分享</li>
              <li v-if="cancollect" v-bind:class="{'collect':isB,'have-collect':!isB}" @click="toogleCollect($event)">{{isB?'收藏':'取消'}}</li>
              <li v-if="candownload" class="load" @click="getloadPath">下载原图</li>
          </ul>
        </div>
        <div class="bottom-box">
          <a href="javascript:void(0)" class="left-btn1" @click="forward" v-show="forwardOne"></a>
          <a href="javascript:void(0)" class="right-btn1" @click="next" v-show="nextOne"></a>
          <div class="bottom-inner">
            <ul class="small-img">
              <li v-for="(a,index) in altas" class="smallli">
              <!-- 更改路径为a.path -->
                <div :value="index" class="littleing" v-if="a.path" v-bind:style = " { 'background-image' : 'url('+a.path+')'} " :class="[index===inx?'cur':'']" @click="currentView($event)">
                </div>         
                <div :value="index" class="littleing" v-else :class="[index===inx?'cur':'']" @click="currentView($event)">
                </div>         
              </li>
            </ul>
          </div>
        </div>
     </div>
     <copy-info :isShow="isShow"
                      :isPic="isPic"  
                      :pictrue="pictrue"
                      :isVideo = 'isVideo'
                      :isWord="isWord"
                      :isAudio="false"
                      :mestitle="mestitle" 
                      :profile="profile"
                      :comment="comment"
                      :copyright="copyright"
                      :tipArr="tipArr"
                      :size ="size"
                      :isedit="false"
                      :isMark = "isMark"
                      :count="count"
                      :duration="duration"
                      :description = "description"
                      :resolution="resolution"
                      :format = "getsuffix(format)"
                      :resid="pid"
                      class="copy-info">
      </copy-info>
      <alert-tip :isShowtip="isShowtip" :message="message" @closeTipEvent="closeTip"></alert-tip>
  </div>
</template>
<script>
import Search from "../videodetil/Search"
import CopyInfo from "../videodetil/CopyInfo"
import alertTip from "../alertTip"
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
import {oDownLoad} from '../../scripts/download.js' 
export default {
  name: 'video-right',
  data(){
      return{
        isShow:true,
        isA:true,
        isVideo:false,
        isB:true,
        isPic:true,
        nextOne:true,
        forwardOne:false,
        isShowtip:false,
        message:'',
        picinfo:[],
        profile:{},
        copyright:[],
        comment:[],
        altas:[],
        size:'',
        resolution:'',
        format:'',
        description:'',
        inx:0,
        tipArr:[],
        count:'',
        duration:'',
        mestitle:'图册',
        name:'图片',
        isWord:false,
        title:'',
        md5:'',
        loadpath:'',
        path:'',
        collect:0,
        s:'',
        a:'',
        diff:'',
        sign:0,
        thumbsup:0,
        pid:'',
        play:0,
        isMark:true,
        timer:0,
        pictrue:true,
      }
  },
  components: { Search,CopyInfo,alertTip},
  props:["id","foid"],
  computed:{
    handles:function(){
      return getChildrenAuth('/resource/picture');
    },
    uid:function(){
      return this.$store.state.user.uid;
    },
    canzan:function(){
      return handleAuth(29,this.handles);
    },
    cancollect:function(){
      return handleAuth(30,this.handles);
    },
    candownload:function(){
      return handleAuth(31,this.handles);
    },
    canshare:function(){
      return handleAuth(32,this.handles);
    }
  },
  mounted:function(){
    this.getPicinfo();
    // this.getCopyright();
    // this.getComment();
  },
  watch:{
    inx:function(){
      this.s= this.altas[this.inx].filesize;
      this.a= this.s/1048576;
      this.size = this.a.toFixed(2);
      this.format = this.altas[this.inx].suffix;
      this.pid = this.altas[this.inx].id;
      this.play = this.altas[this.inx].play;
      this.resolution = this.altas[this.inx].resolution;
      this.description =this.altas[this.inx].description;
      this.path = this.altas[this.inx].path;
      this.getPlaycount();
      this.getStutas();
      var image = new Image();
      image.src =  this.path;
      var _this = this;
      image.onload = function(e){
        var width =  image.width;
        var height =  image.height;
        _this.resolution = width+"*"+height;
      };
    },
  },
  methods:{
    // 获取图片的详细信息
    getPicinfo(){
      this.$http.get('/Resource/GetPicDetails',{
        params:{
          id:this.id,
          foid:this.foid
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.picinfo = d.data;            
            this.inx = this.picinfo.index;
            this.profile = d.data;
            if(this.profile.lname){
                this.tipArr = this.profile.lname.split(",");
            }else{
                this.tipArr = this.profile.lname;
            }  
            if(this.profile.diff == 1){
              this.mestitle = '图片'
              this.isPic = false;
              this.pictrue = true;
              this.isVideo = true;
              this.isMark = true;
            }else{
               this.mestitle = '图册'
               this.isPic = true;
               this.pictrue = false;
               this.isVideo = false;
               this.isMark = false;
            }           
            this.altas = this.profile.file;
            if(this.profile.count <= 1){
              this.nextOne = false;
              this.forwardOne = false;
            }
            if(this.inx+1 == this.profile.count && this.profile.count!=1){
               this.nextOne = false;
               this.forwardOne = true;
            }else if(this.inx > 0&&this.inx<this.profile.count-1){
                this.nextOne = true;
                this.forwardOne = true;
            }
            this.s= this.altas[this.inx].filesize;
            this.a= this.s/1048576;
            this.size = this.a.toFixed(2);
            this.format = this.altas[this.inx].suffix;
            this.sign = this.altas[this.inx].sign;
            if(this.sign == 1){
              this.isA = false;
             }else{
                  this.isA = true;
            };
            this.collect = this.altas[this.inx].collect;
            if(this.collect == 0){
              this.isB = true;
            }else if(this.collect == 1){
              this.isB = false
            };
            this.thumbsup = this.altas[this.inx].thumbsup;
            this.pid = this.altas[this.inx].id;
            this.play = this.altas[this.inx].play;
            this.resolution = this.altas[this.inx].resolution;
            this.description =this.altas[this.inx].description;
            this.title = this.profile.title    
            this.path =  this.altas[0].path;
            var image = new Image();
            image.src =  this.path;
            var _this = this;
            image.onload = function(e){
             var width =  image.width;
             var height =  image.height;
              _this.resolution = width+"*"+height;
              $(".littleing[value='"+_this.inx+"']").addClass('cur').parents().siblings().children().removeClass("cur");
              if(_this.inx > 3){
                var w = $(".small-img li").width();
                $(".small-img").css({left : -w*_this.inx});
              }               
             var w = $(".big-img li").width();
             $(".big-img").css({left:-w*_this.inx});
          };
          this.getPlaycount();
          this.getCopyright();
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取图片点赞和收藏状态
    getStutas(){
      this.$http.get('/Resource/GetResourceMoreInfo',{
        params:{
          rid:this.pid,
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid==200){
            var info = d.data;
            this.play = info.play;
            this.thumbsup = info.thumbsup;
            this.collect = info.collect;
            this.sign = info.sign;
            if(this.collect == 0){
              this.isB = true;
            }else if(this.collect == 1){
              this.isB = false
            };
            if(this.sign == 1){
              this.isA = false;
             }else{
               this.isA = true;
            } 
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 获取版权信息
    getCopyright(){
      this.$http.get('/Resource/GetResourceCopyright',{
        params:{
          rid:this.pid
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.copyright = d.data;
          }else{
            console.log(d.msg);
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // // 获取评论信息
    // getComment(){
    //   this.$http.get('/Resource/GetCommentByRid',{
    //     params:{
    //       rid:this.pid
    //     }
    //   }).then(res=>{
    //     var d = $.parseJSON(res.data);
    //     if(d){
    //       if(d.msgid == 200){
    //         this.comment = d.data;
    //       }else{
    //         console.log(d.msg)
    //       }
    //     }
    //   }).catch(err=>{
    //     console.log(err)
    //   })
    // },
    // 点击量
    getPlaycount(){
      this.$http.post('/Resource/ModifyPlay',{
        id:this.pid,
        uid:this.uid
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.play = d.data;
          }
        }
      })
    },
    getloadPath(){
        oDownLoad(this.path);
    },
    // 获取图片格式
    getsuffix(){
      switch(this.format) {
        case ".jpg":
          this.format = "JPG"
          break;
        case ".png":
          this.format = "PNG"
          break;
        case ".gif":
          this.format = "GIF"
          break;
      case ".jpeg":
          this.format = "JPEG"
          break;
      }
      return this.format
    },
    // 点击下面的缩略图，上面的展示图切换效果
    currentView(e){
      var dom = e.currentTarget;
      this.inx = $(dom).attr("value");
      this.inx = JSON.parse(this.inx);
      console.log(this.inx)
      $(dom).addClass('cur').parents().siblings().children().removeClass("cur");
      var w = $(".big-img li").width();
      $(".big-img").stop().animate({left : -w*this.inx},300);
      if(this.inx > 0){
        this.forwardOne = true;
      }else{
        this.forwardOne = false;
      }
      if(this.inx >= this.profile.count-1){
         this.nextOne = false;
       }else{
        this.nextOne = true;
       }
    },
    // 下一张效果
    next(){
      this.inx+=1;
      $(".littleing[value='"+this.inx+"']").addClass('cur').parents().siblings().children().removeClass("cur");
      if(this.inx>3){
        var w = $(".small-img li").width();
        $(".small-img").stop().animate({left : -w*this.inx},300);
      }
      var w = $(".big-img li").width();
      $(".big-img").stop().animate({left : -w*this.inx},300);
      if(this.inx > 0){
        this.forwardOne = true;
      }else{
        this.forwardOne = false;
      }
      if(this.inx >= this.profile.count-1){
         this.nextOne = false;
       }else{
        this.nextOne = true;
       }
    },
    // 上一张效果
    forward(){
      this.inx-=1;
      $(".littleing[value='"+this.inx+"']").addClass('cur').parents().siblings().children().removeClass("cur");
      if(this.inx>3){
        var w = $(".small-img li").width();
        $(".small-img").stop().animate({left : -w*this.inx},300);
      }else if(this.inx<=3){
        $(".small-img").stop().animate({left : 0},300);
      }
      var w = $(".big-img li").width();
      $(".big-img").stop().animate({left : -w*this.inx},300);
      if(this.inx > 0){
        this.forwardOne = true;
      }else{
        this.forwardOne = false;
      }
      if(this.inx >= this.profile.count-1){
         this.nextOne = false;
       }else{
        this.nextOne = true;
       }
    },
    // 点赞
    toggleDood(){
      if(!this.canzan){
        return false;
      }
      this.isA = !this.isA;
      this.$http.post('/Resource/GiveThumbsup',{
        rid:this.pid,
        uid:this.uid
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid==200){
            var data = d.data;
            this.thumbsup = data.thumbsup;
            this.sign=data.sign;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    toogleCollect(e){
        var dom = e.currentTarget;
        if($(dom).hasClass('collect')){
           this.$http.post('/Resource/collectResource',{
              rid:this.pid,
              uid:this.uid
           }).then(res=>{
              var d = $.parseJSON(res.data);
              this.isShowtip = true;
              if(d.msgid == 200){;
                this.message = "收藏成功"
                this.isB = false;
              }else{               
                this.message = d.msg;
                this.isB = true;
              }
           })
        }else{
          this.$http.post('/Resource/DiscollectResource',{
              rid:this.pid,
              uid:this.uid
           }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d.msgid == 200){
                this.isShowtip = true;
                this.isB = true;
                this.message = "取消收藏成功"
              }
           })
        }
      },
      closeTip(){
        this.isShowtip = false;
      },
  }
}
</script>
<style lang="scss">
@media screen and (-webkit-min-device-pixel-ratio:0){
  .bottom-inner{
    left:3.6em !important;
  }
}
@media screen and (max-width: 1366px) {
  .bottom-inner ul li{
    width:14.5em !important;
  }
  .bottom-inner{
    left:3em !important;
    width:58em !important;
  }
}
.picture-right{
	width:92%;
	height:83em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;
	margin-left:1.5%;
	float:left;
    	margin-top:6px;
      .copy-info{
        width:34%;
      }
      .alert-tip{
        margin-top:-2em;
      }
      .left-btn{
        left:0;
        background:url("../../assets/picdetail/zuo.png") no-repeat left center;
        background-size:100%;
        margin:0;
      }
      .right-btn{
       right:0;
       background:url("../../assets/picdetail/you.png") no-repeat right center;
       background-size:100%;
       margin:0;
      } 
      .left-btn1{
        left:0;
        background:url("../../assets/picdetail/zuo1.png") no-repeat left center;
        background-size:100%;
        margin:0;
      }
      .right-btn1{
       right:0;
       background:url("../../assets/picdetail/you1.png") no-repeat right center;
       background-size:100%;
       margin:0;
      }
      .pic-left{
        float:left;
        width:60.5%;
        margin:0 1% 0 2%;

        .pic-view{
          width:100%;
          height:44.5em;
          background:url("../../assets/module/u10.png") no-repeat;
          background-size:100% 100%;
          padding:1em 1.5em;
          overflow:hidden;
          position:relative;
          .bottom-text{
                width:100%;
                height:4em;
                line-height:4em;
                background-color:rgba(#000000, 0.6);
                position:absolute;
                z-index:99;
                bottom:-0.6em;
                left:0%;
                padding:0 2em;
                font-size:1.4em;
                .pic-total{
                  padding-right:2em;
                  float:left;
                }
                .pic-title{
                  width:80%;
                  float:left;
                  color:#fff;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
              }     
          .pic-view-inner{
              width:100%;
              height:100%;
              overflow:hidden;
              position:relative;
              ul{
                width:2000000000px;
                height:42.5em;
                overflow:hidden;
                position:absolute;
                li{
                  float:left;
                  width:64em;
                  height:42em;
                  position:relative;
                  background-image:url("../../assets/module/picmoren.png");
                  background-size:contain;
                  background-repeat:no-repeat;
                  background-position:center center;
                }
              }
              a{
                position:absolute;
                width:3em;
                height:8em;
                top:50%;
                margin-top:-2em;
              }
                 
            }
        }
        .operation-box{
          width:100%;
          height:4em;
          padding-left:3em;
          color:#999999;
          ul{
             width:100%;
              margin-top:-1em;
              overflow:hidden;
             li{
               height:4em;
               line-height:4em;
               float:left;
               margin-right:2em;
             }
             .times{
               padding-left:2em;
               background:url("../../assets/picdetail/u406.png") no-repeat left center;
               background-size:26%;
             }
             .good{
               padding-left:1.5em;
               background:url("../../assets/videoPlay/u440.png") no-repeat left center;
               background-size:28%;
               cursor:pointer;
             }
             .have-good{
               padding-left:1.5em;
               background:url("../../assets/videoPlay/u444.png") no-repeat left center;
               background-size:28%;
               cursor:pointer;
             }
             .share{
               padding-left:1.7em;
               background:url("../../assets/videoPlay/u435.png") no-repeat left center;
               background-size:42%;
               cursor:pointer;
             }
             .collect{
               padding-left:2em;
               background:url("../../assets/videoPlay/u453.png") no-repeat left center;
               background-size:44%;
               cursor:pointer;
             }
             .have-collect{
               padding-left:2em;
               background:url("../../assets/videoPlay/u457.png") no-repeat left center;
               background-size:44%;
               cursor:pointer;
             }
             .load{
               padding-left:2.3em;
               background:url("../../assets/videoPlay/u448.png") no-repeat left center;
               background-size:38%;
               cursor:pointer;
             }
           }
        }
        .bottom-box{
          width:100%;
          height:17em;
          background:url("../../assets/videoPlay/u86.png") no-repeat;
          background-size:100% 100%;
          position:relative;

          a{
            position:absolute;
            width:2em;
            height:5em;
            top:50%;
            margin-top:-2.5em;
          }
          .bottom-inner{
            width:59em;
            height:9em;
            left:3.8em;
            overflow:hidden;
            position:absolute;
            top:4em;
            ul{
              width:300000000px;
              height:9em;
              position:absolute;
              li{
                width:15em;
                height:9em;
                float:left;
                overflow:hidden;
                div{
                  width:14em;
                  height:9em;
                  overflow:hidden;
                  background-size:contain;
                  background-image:url("../../assets/module/picmoren.png");
                  background-repeat:no-repeat;
                  background-position:center center;
                }
              }
              .cur{
                border:1px solid #0099ff;
                padding:1px;
              }
            }
          }
        }
      }
}
</style>
