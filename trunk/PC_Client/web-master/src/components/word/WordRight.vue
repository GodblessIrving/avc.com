<template>
  <div class="word-right">
    <search :name="name" :title="title"></search>
    <div class="word_main">
      <div class="word-left">
        <div class="word-pic">
          <div class="word_format" :class="this.suffix"></div>
          <div class="word_opration" >
            <p class="word_title">{{title}}</p>
            <ul>
                <li class="word_look" @click="watchWOrd">预览</li>
                <li class="play_num">点击量 {{play}}</li>
                <li v-bind:class="[isgood?'good':'have-good']" @click="tooglegood()" v-if="canzan">( {{wordinfo.thumbsup}}赞 )</li>
                <li v-if="canshare" class="share" title="功能正在开发中，敬请期待">分享</li>
                <li v-if="cancollect" v-bind:class="[isCollect?'collect':'have-collect']" @click="toogleCollect($event)">{{isCollect?'收藏':'取消'}}</li>
                <li v-if="candownload" class="down" @click="getloadPath">下载</li>
           </ul>
          </div>
        </div>
        <div class="copy_div">
            <copy-info :isShow="isShow"
                      :isPic="isPic"  
                      :isVideo = 'isVideo'
                      :isWord="isWord"
                      :isAudio="false"
                      :copyright= "copyright"
                      :comment = "comment"
                      :mestitle="mestitle"
                      :profile="profile"
                      :tipArr = "tipArr"
                      :size ="size"
                      :isedit="false"
                      :duration="duration"
                      :count="count"
                      :description = "description"
                      :resolution = "resolution"
                      :format = "suffix"
                      :resid="id"
                      class="copy-info">
            </copy-info>
        </div>
      </div>
      <div class="list-box">
        <p class="about-list">相关文稿列表</p>
       <div class="word-list">
       <ul>
         <li v-for="l in list" style="cursor:pointer;" @click="goTolist(l.id,l.md5)">
           <span class="file-type" :class="getsuffix(l.suffix)"></span>
           <p class="file-name" style="-webkit-box-orient: vertical;" :title="l.title">{{l.title}}</p>
           <span class="file-size">{{getSize(l.size)}}KB</span>
         </li>
       </ul>
     </div>
    </div>
    </div>
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
  name: 'word-right',
  data(){
      return{
        isShow:true,
        isVideo:false,
        isShowtip:false,
        message:"",
        isIcon:true,
        isWord:true,
        isgood:true,
        isCollect:true,
        isPic:false,
        loding:false,
        mestitle:'文稿',
        wordinfo:[],
        profile:[],
        tipArr:[],
        copyright:[],
        comment:[],
        list:[],
        size:'',
        description:'',
        resolution:'',
        suffix:'',
        word:[],
        duration:'',
        name:'文稿',
        title:'',
        path:'',
        page:true,
        count:0,
        loadpath:'',
        md5:'',
        collect:0,
        downpath:'',
        play:0,
      }
  },
  components: { Search,CopyInfo,alertTip},
  computed:{
    handles:function(){
      return getChildrenAuth('/resource/draft');
    },
    uid:function(){
      return this.$store.state.user.uid;
    },
    canzan:function(){
      return handleAuth(38,this.handles);
    },
    canshare:function(){
      return handleAuth(39,this.handles);
    },
    cancollect:function(){
      return handleAuth(40,this.handles);
    },
    candownload:function(){
      return handleAuth(41,this.handles);
    },
    big:function(){
      return handleAuth(42,this.handles);
    },
    small:function(){
      return handleAuth(43,this.handles);
    },
  },
  mounted:function(){
    this.getWordinfo(this.id);
    this.getRelatedList(this.id);
    this.getCopyright(this.id);
    this.getComment(this.id);
    this.getPlayNum(this.id);
  },
  props:["id"],
   methods: {
      // 根据资源id获取文稿详情
      getWordinfo(id){
        var _this = this;
        this.$http.get('/Resource/GetResourceDetails',{
          params:{
            id:id,
            uid:this.uid
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.wordinfo = d.data;
              this.collect = this.wordinfo.collect;
              if(this.collect == 0){
                this.isCollect = true;
              }else if(this.collect == 1){
                this.isCollect = false;
              }
              this.profile = this.wordinfo.resmsg;
              this.word = this.profile.file;
              this.suffix =this.getsuffix(this.word[0].suffix) ;
              if(this.wordinfo.sign == 1){
               this.isgood = false;
              }else{
               this.isgood = true;
              }
              if(this.profile.lname){
                 this.tipArr = this.profile.lname.split(",");
              }else{
                this.tipArr = this.profile.lname
              }             
              this.title = this.profile.title;
              this.md5 = this.word[0].md5;
              this.downpath=this.word[0].path;
              this.getCount(this.md5);
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 获取版权信息
      getCopyright(id){
      this.$http.get('/Resource/GetResourceCopyright',{
        params:{
          rid:id
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
    getPlayNum(id){
      this.$http.post('/Resource/ModifyPlay',{
        id:id,
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
      // 获取评论信息
      getComment(id){
       this.$http.get('/Resource/GetCommentByRid',{
         params:{
           rid:id
         }
       }).then(res=>{
         var d = $.parseJSON(res.data);
         if(d){
           if(d.msgid == 200){
             this.comment = d.data;
           }else{
             console.log(d.msg)
           }
         }
       }).catch(err=>{
         console.log(err)
       })
     },
     getSize(size){
        var num = (size/1024);
        var a = num.toFixed(2);
        return a;
     },
      // 获取相关文稿列表
      getRelatedList(id){
        this.$http.get('/Resource/GetRecommendDraft',{
          params:{
            resid:id
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.list = d.data;
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 获取文稿图片总数
      getCount(md){
        this.$http.get('resource/getdocpages',{
          params:{
            MD5:md
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.count = d.data;
            }else{
              console.log(d.msg);
            }
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      // 文稿下载
      getloadPath(){
        oDownLoad(this.downpath);
    },
    // 图片预览
    watchWOrd(){
      if(!this.downpath){
           this.isShowtip = true;          
           this.message = "文件不存在";
           return
      }
      var add = this.downpath.split('/');
      add.splice(0,3);
      var path='avc.com';
      for(var i = 0; i<add.length; i++){
        path = path+'/'+add[i];
      }
      var filepath = encodeURI(path);
      var watchpath = window.config.address+filepath;
      window.open(watchpath)
    },
      // 点击相关文稿列表切换
      goTolist(id,md5){
        this.getWordinfo(id);
        this.getPlayNum(id);
        this.getRelatedList(id);
        this.getCopyright(id);
        this.getComment(id);
        this.getCount(md5);
      },
      // 匹配文件格式
      getsuffix(suffix){
        var format;
      switch(suffix) {
        case ".doc": 
                format = "DOC"
                break;
            case ".docx":
                format = "DOC"
                break;
            case ".pdf":
                format = "PDF"
                break;
            case ".ppt":
                format = "PPT"
                break;
            case ".pptx":
                 format = "PPT"
                break;
            case ".txt":
                 format = "TXT"
                break;
            case ".ai":
                 format = "AI"
                break;
            case ".eps":
                 format = "EPS"
                break;
            case ".xlsx":
                format = "EXC"
                break;
            default:
                format='other';
            break;
      }
      return  format
     }, 
      closeTip(){
        this.isShowtip = false;
      },
      // 点赞
      tooglegood(){
        if(!this.canzan){
            return false;
        }
        this.isgood = !this.isgood;
        this.$http.post('/Resource/GiveThumbsup',{
          rid:this.id,
          uid:this.uid
        }).then(res=>{
             var d = $.parseJSON(res.data);
            if(d){
              if(d.msgid==200){
                var data = d.data;
                this.wordinfo.thumbsup = data.thumbsup;
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
              rid:this.id,
              uid:this.uid
           }).then(res=>{
              var d = $.parseJSON(res.data);
              this.isShowtip = true;
              if(d.msgid == 200){              
                this.message = "收藏成功";
                this.isCollect = false; 
              }else{
                this.message = d.msg;
                this.isCollect = true; 
              }
           })
        }else{
          this.$http.post('/Resource/DiscollectResource',{
              rid:this.id,
              uid:this.uid
           }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d.msgid == 200){
                this.isShowtip = true;
                this.message = "取消收藏成功";
                this.isCollect = true; 
              }else{
                this.message = d.msg;
                this.isCollect = false;
              }
           })
        }
      },
      toogleIcon(){
        if($(".word-opration").hasClass('opCur')){
            $(".word-opration").css("display","none");
            $(".word-opration").removeClass('opCur');
            $(".word-icon").css("display","block");
        }else{
            $(".word-opration").css("display","block");
            $(".word-opration").addClass('opCur');
            $(".word-icon").css("display","none");
        }
        event.stopPropagation(); 
      }
    }
}

</script>

<style lang="scss">
.word-right{
	width:92%;
	height:83em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;
	margin-left:1.5%;
	float:left;
    	margin-top:6px;
      .el-pagination{
        text-align:center;
        position:relative;
        bottom:0;
      }
      .copy_div{
        width:100%;
        .copy-info{
        width:100%;
        .first,.third,.second{
            height:46em;
          }
        }
        .copy-info nav span{
          width:12%;
        }
        .third .third-top{
          height:20em;
        }
        .first li .left{
          width:10%;
        }
        .second li .left{
          width:12%;
        }
      }
      
      .word_main{
        width:100%;
        padding:1em 3em;
        .DOC{
             background:url("../../assets/module/u1801.png") no-repeat center;
             background-size:100%;
         }
         .PPT{
             background:url("../../assets/module/u1807.png") no-repeat center;
             background-size:100%;
         }
         .PDF{
             background:url("../../assets/module/u1805.png") no-repeat center;
             background-size:100%;
         }
         .AI{
                 background:url("../../assets/module/u1813.png") no-repeat center;
                 background-size:100%;
         }
         .TXT{
                 background:url("../../assets/module/u1815.png") no-repeat center;
                 background-size:100%;
         }
         .EPS{
                 background:url("../../assets/module/u1825.png") no-repeat center;
                 background-size:100%;
         }
         .EXC{
                 background:url("../../assets/module/u188.png") no-repeat center;
                 background-size:100%;
          }
          .other{
                 background:url("../../assets/module/u189.png") no-repeat center;
                 background-size:100%;
          }
      }    
      .word-left{
        width:77%;
        height:63em;
        float:left;
        margin-right:1%;
      .word-pic{
        width:100%;
        height:13em;
        padding:1em 2em;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        overflow:hidden;
        .word_format{
          width:6em;
          height:11em;
          float: left;
          margin-right:2em;
        }
        .word_opration{
            float:left;
            color:#fff;
            .word_title{
              margin-top:1.5em;
              font-size:1.1em;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              width:40em;
            }
            ul{
              margin-top:4em;
              li{
                width:6em;
                height:2em;
                padding-left:2em;
                line-height:2em;
                cursor:pointer;
                float: left;
                margin-right:1em;
              }
              .word_look{
                background:url("../../assets/artdetail/01.png") no-repeat left center;
                background-size:22%;
              }
              .play_num{
                background:url("../../assets/picdetail/u406.png") no-repeat left center;
                background-size:20%;
                margin-right:2.5em;
              }
              .good{
                background:url("../../assets/videoPlay/u440.png") no-repeat left center;
                background-size:20%;
              }
              .have-good{
                background:url("../../assets/videoPlay/u444.png") no-repeat left center;
                background-size:20%;
              }
              .share{
                background:url("../../assets/videoPlay/u435.png") no-repeat left center;
                background-size:20%;
              }
              .collect{
                background:url("../../assets/videoPlay/u453.png") no-repeat left center;
                background-size:23%;
              }
              .have-collect{
                background:url("../../assets/videoPlay/u457.png") no-repeat left center;
                background-size:23%;
              }
              .down{
                background:url("../../assets/videoPlay/u448.png") no-repeat left center;
                background-size:24%;
              }
            }
          }
       }
      }
      .list-box{
        width:22%;
        height:64em;
        float:left;
        color:#fff;
       .about-list{
            width:100%;
            height:2em;
            line-height:2em;
            font-size:1.2em;
            padding-left:1em;
            border-left:4px solid #0099ff;
        }
        .word-list{
        width:100%;
        height:61em;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        padding:1em;
        overflow-y:auto;
         ul{
          overflow:hidden;
          width:100%;

          li{
            width:100%;
            height:4em;
            margin-bottom:0.5em;

            .file-type{
              float:left;
              width:10%;
              height:4em;
              margin-right:3%;
            }
            .file-name{
              float:left;
              margin-top:0.5em;
              width:56%;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              overflow: hidden;
              height:2.8em;
            }
            .file-size{
              float:left;
              width:17%;
              height:4em;
              line-height:4em;
              margin-left:3%;
            }
          }
         }
      }
    }
}
</style>
