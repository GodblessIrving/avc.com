<template>
  <div class="audio-right" >
     <search :name="mestitle" :title="profile.title"></search>
      <div class="audio-bottom">
        <div class="audio-play">
          <div class="play-view">
            <div class="play-view-top">
              <div class="play-top">
              <span class="left" v-bind:class="{'onPlay':isA,'onStop':!isA}"></span>
              <div class="right">
                <p class="play-title" style="-webkit-box-orient: vertical;">{{profile.title}}</p>
                <p style="color:#999999; margin-bottom:1.5em;">
                  <span>来源：</span>
                  <span>{{profile.sname}}</span>
                </p>
                <p class="times">{{audioInfo.play}}次播放</p>
              </div>
            </div>
            <video autoplay id="audio1" @timeupdate="timeChange" style="height:3em;" :src="path">
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
                <li v-if="canmark&&stutas != '审核中'" class="audio-mark" @click="addtip()"></li>
                <li style="position:absolute; height:100%; width:5em; left:8.3em;" v-if="canAdd"></li>
                <li class="retrograde" @click="retreat()"></li>
                <li class="playBtn" v-bind:class="{'onPlayBtn':isA,'onStopBtn':!isA}" @click="toggle()"></li>
                <li class="go-forward" @click="fastforward()"></li>
                <li class="audio-voice">
                  <span class="voice-icon" :class="[value3!=0?'':'no-voice']" style="cursor:pointer;" @click="StopVioce"></span>
                  <div class="voice-outer">
                    <el-slider v-model="value3" :format-tooltip="changeVoice" :show-tooltip="false" :title="value3"></el-slider>
                  </div>
                </li>
              </ul>
            </div>
            </div>
            <div class="play-view-bottom">
              <ul>
                <li v-bind:class="{'good':isgood,'have-good':!isgood}" @click="toggleDood()" v-if="canzan">（{{audioInfo.thumbsup}}赞）</li>
                <li v-if="canshare" class="share" title="功能正在开发中，敬请期待">分享</li>
                <li v-if="cancollect" v-bind:class="{'collect':isB,'have-collect':!isB}" @click="toogleCollect($event)">{{isB?'收藏':'取消'}}</li>
                <li v-if="candownload" class="load" @click="getloadPath">下载</li>
              </ul>
            </div>
          </div>
          <div class="my-mark-list">
            <p class="my-mark-title">我的标注列表</p>
            <div class="my-mark-table">
              <div class="blue-vertical"></div>
              <div class="audio-table">
                  <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                  <tr>
                    <th width="10"></th>
                    <th width="10"></th>
                    <th width="60"></th>
                    <th width="20"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(t,index) in tips" class="trlist" :value="index"> 
                  <td>{{t.timestamp}}</td>
                  <td>
                    <span class='choseCircle circle' @click="choseItem($event,index,t.timestamp)"></span>
                  </td>
                  <td :title="t.description">
                    <span class="audio-img"></span>
                    <p class="audio-text" style=" -webkit-box-orient: vertical;">
                      {{t.description}}
                    </p>
                  </td>
                  <td>
                    <a href="javascript:void(0)" 
                         class='wihte-eidt eidt-s' 
                         :value="index" 
                         @click="eidtTip($event,index,t.id)"
                         v-if="!t.type&&stutas != '审核中'"></a>
                    <a href="javascript:void(0)" class='wihte-del del-s'  :value="index" @click = "delTip($event,t.id)" v-if="t.type!=10&&stutas != '审核中'"></a>
                  </td>
                </tr>
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
        <audio-mark class="my-mark"
                              :mark = "mark"
                              :total = "total"
                              :stutas="stutas"
                              :submit="submit"
                              :empty = "empty"
                              :uid="uid"
                              :addmark = "addmark"
                              :markcount = 'markcount'
                              @subNewEvent = 'subtip'
                              @delNewEvent = 'delmark'
                              @copyNewEvent = 'copymark'
                              @preViewNewEvent = 'previewMark'
                              @searchNewEvent = 'searchmark'
                              @previewMymark = 'preMymark'>
        </audio-mark>
        <copy-info :isShow="isShow" 
                          class="copy-info" 
                          :isPic="false" 
                          :isVideo = 'isVideo'
                          :isAudio="true"
                          :copyright= "copyright"
                          :comment = "comment"
                          :mestitle="mestitle"
                          :profile="profile"
                          :tipArr = "tipArr"
                          :size ="size"
                          :isedit="false"
                          :count="count"
                          :duration='durations'
                          :description = "description"
                          :resolution = "resolution"
                          :resid="id"
                          :format = "getsuffix(format)">
        </copy-info>
      </div>
      <add-tip :isAdd="isAdd" 
                    :isVideo = "isVideo"
                    :optype="optype"
                    @closeNewEvent="closeAddtip()"
                    :timestamp="current"
                    :content="content"
                    @addNewEvent = 'listenAdd'>
      </add-tip>
      <alert-tip :message='message'
                      :isShowtip='isShowtip'
                      @closeTipEvent = 'closeCommentip'>
      </alert-tip>
      <common-tip :isShow="iscommon"
                           :iszhu = 'iszhu'
                           :message="mess"
                           @closeTipEvent="closeCommon"
                           @delObjEvent="sureDel(a)">
      </common-tip>
  </div>
</template>
<script>
import Search from "../videodetil/Search"
import CopyInfo from "../videodetil/CopyInfo"
import AudioMark from "../videodetil/VideoMark"
import addTip from "../videodetil/addTip"
import alertTip from '../alertTip'
import CommonTip from "../CommonTip"
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
import {oDownLoad} from '../../scripts/download.js'
export default {
  name: 'video-right',
  data(){
      return{
        isShow:true,
        isA:true,
        iscommon:false,
        isVideo:false,
        isAdd:false,
        isgood:true,
        mess:'',
        isShowtip:false,
        message:'',
        isB:true,
        inxs:[],
        md5:'',
        value4:0,
        value3:100,
        voice:'',
        audioInfo:[],
        copyright:'',
        comment:'',
        mestitle:'音频',
        profile:'',
        tipArr:[],
        oldtips:[],
        size:'',
        count:'',
        durations:'',
        description:'',
        resolution:'',
        format:'',
        timeNow:'00:00',
        timeDuration:'00:00',
        current:'',
        content:null,
        tips:[],
        mark:[],
        total:0,
        index:0,
        type:'',
        player:'',
        otherid:'',
        a:'',
        eidt:0,
        inx:0,
        stutas:'',
        path:'',
        loadpath:'',
        markcount:0,
        collect:0,
        iszhu:false,
        noVoice:false,
        nowVoice:0,
        markNum:0,
        optype:null,
        preViewMark:{},
        submit:0,
        empty:0,
        canAdd:false,
        path:'',
        timeCount:0,
        timer:0,
        addmark:0,
        markid:0,
      }
  },
  components: { Search,AudioMark,CopyInfo,addTip,alertTip,CommonTip},
  props:["id"],
  computed:{
    handles:function(){
      return getChildrenAuth('/resource/audio');
    },
    uid:function(){
      return this.$store.state.user.uid;
    },
    canmark:function(){
      return handleAuth(18,this.handles);
    },
    canzan:function(){
      return handleAuth(19,this.handles);
    },
    cancollect:function(){
      return handleAuth(20,this.handles);
    },
    candownload:function(){
      return handleAuth(21,this.handles);
    },
    canshare:function(){
      return handleAuth(23,this.handles);
    }
  },
  mounted:function(){
    this.player = document.getElementById('audio1');
    this.getAudioinfo(); 
    this.getCopyright();
    this.getComment();
    var self = this;
    let id = self.id;
    let uid = self.uid;
    // 进来停留两分钟，添加播放次数
    this.timer = setTimeout(function(){
      self.$http.post('/Resource/ModifyPlay',{
        id:id,
        uid:uid,
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid != 200){
            console.log(d.msg)
          }
        }
      })
    }, 120000);
  },
  destroyed(){
    clearTimeout(this.timer);//离开组件时,清除计时器 
  },
  methods:{
    // 获取音频数据
    getAudioinfo(){
      this.$http.get('/Resource/GetResourceDetails',{
          params:{
            id:this.id,
            uid:this.uid
          }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.audioInfo = d.data;
            this.collect = this.audioInfo.collect;
            if(this.collect == 0){
              this.isB = true
            }else if(this.collect == 1){
              this.isB = false;
            }
            this.mark = this.audioInfo.mark;  
            this.profile =  this.audioInfo.resmsg;
            var time = this.profile.file[0].duration;
            this.durations = this.getTime(time);
            this.path = this.profile.file[0].path;
            this.getstutas(this.mark.status);
            if(this.stutas == '未提交'){
              this.submit = 1;
            }else{
              this.submit = 0;
            }
           if(this.audioInfo.sign == 1){
            this.isgood = false;
           }else{
            this.isgood = true;
           }
            this.oldtips = this.mark.mymark;  
            if(this.oldtips.length > 0){
                for(var i = 0; i < this.oldtips.length; i++){
                  var mark = {};
                  mark.timestamp = this.oldtips[i].timestamp;
                  mark.description = this.oldtips[i].description;
                  mark.resourcesid = this.id;
                  mark.uid = this.uid;
                  mark.type = this.oldtips[i].type;
                  mark.frame = '';
                  mark.approvalstatus = this.oldtips[i].approvalstatus;
                  mark.id = this.oldtips[i].id;
                  this.tips.push(mark);
                }
            }
            this.markcount = this.tips.length;
            if(this.markcount >0){
              this.empty = 1;
            }
            if(this.profile.lname){
                 this.tipArr = this.profile.lname.split(",");
            }else{
                this.tipArr = this.profile.lname
            } 
            this.md5 = this.profile.file[0].md5;
            this.format = this.profile.file[0].suffix;
            this.path=this.profile.file[0].path;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 下载
    getloadPath(){
      oDownLoad(this.path);
    },
    // 获取标注状态
    getstutas(val){
      switch(val) {
        case 0:
          this.stutas = '未提交'
          break;
        case 1:
        case 2:
          this.stutas = '审核中'
          break;
        case 3:
          this.stutas = '审核通过'
          break;
        case 4:
          this.stutas = '审核失败'
          break;
        default:
          this.stutas = ''
      }
      return  this.stutas;
    },
    // 获取版权信息
    getCopyright(){
      this.$http.get('/Resource/GetResourceCopyright',{
        params:{
          rid:this.id
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
    // 获取评论信息
    getComment(){
      this.$http.get('/Resource/GetCommentByRid',{
        params:{
          rid:this.id
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
    // 获取音频格式
    getsuffix(){
      switch(this.format) {
        case '.mp3' :
          this.format = 'MP3'
          break;
        case '.aac':
          this.format = 'AAC'
          break;
        case '.wma':
          this.format = 'WMA'
          break;
        case '.mpeg':
          this.format = 'MPEG'
          break;
      }
      return this.format;
    },
    // 快进
    fastforward(){
      var now = this.player.currentTime + 1;
      this.player.currentTime = now;
      this.timeNow = this.getCurrent(now);
      this.player.pause();
      this.isA = false;
    },
    // 快退
    retreat(){
      var now = this.player.currentTime - 1;
      this.player.currentTime = now;
      this.timeNow = this.getCurrent(now);
      this.player.pause();
      this.isA = false;
    },
    // 将秒数时间格式转为分：秒
    getCurrent(time){
      if(!time){
        return '00:00'
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
    // 将时长转为秒
    getSeconds(time){
        var s = '';
        var min = time.split(':')[0];
        var sec = time.split(':')[1];
        s = Number(min*60) + Number(sec);
        return s;
    },
    // 获取音频时长
    getTime(secord){
           var h=0,i=0,s=parseInt(secord);
           if(s>60){
               i=parseInt(s/60);
               s=parseInt(s%60);
               if(i > 60) {
                   h=parseInt(i/60);
                   i = parseInt(i%60);
               }
           }
           if(parseInt(h) > 0){
             h = h+'时'
           }else{
             h = ''
           }
           if(parseInt(i) > 0){
             i = i+'分'
           }else{
             i = ''
           }
           if(parseInt(s) > 0){
             s = s+'秒'
           }else{
             s = ''
           }
          var durations = h + i + s;
          return   durations;
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
        if(parseInt(ct) == parseInt(d)){
          this.isA = false;
        }
      }
    },
    // 拖动进度条事件
    progressChange(val){
      var d=this.player.duration;
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
           this.timeNow = '00:00';
           this.player.currentTime = 0;
           this.value4 = 0; 
           this.player.play();
         }
         this.player.play();
       }else{
         this.player.pause();
       }
     },
    // 控制播放音量
    changeVoice(val){
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
    // 添加或者编辑标注
    listenAdd(val){
      if(val == ''){ 
        return;
      }
       this.isAdd = false;
       this.$http.post('/Resource/SaveMarks',{
          rid:this.id,
          uid:this.uid,
          frame:'',
          timestamp:this.current,
          description:val,
          type:0,
          mid:this.markid
       }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
                  this.getMyMark();
                  this.stutas = '未提交';
              }else{
                this.isShowtip = true;
                this.message = '添加标注失败'
              }
            }
       })
    },
    // 搜索标注
    searchmark(val){
      this.$http.get('/Resource/GetMarks',{
        params:{
          rid:this.id,
          name:val
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            if(d.data.length > 0){
              this.mark.othermark = d.data;
              console.log(d.data)
            }else{
              this.isShowtip = true;
              this.message = '没有查到该老师的相关标注'
            }
          }
        }
      })
    },
    // 提交标注
    subtip(){
     this.$http.post('/Resource/SubMarks',{
        rid:this.id,
        uid:this.uid,
        markarr:this.tips
      }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.isShowtip = true;
              this.message = '提交成功'
              this.stutas = '审核中';
              this.total = 0;
              this.submit = 0;
              this.empty = 0;
              this.markNum = 0;
              this.addmark = 0;
              this.markcount = d.data;
              this.$emit('SaveEvent',this.markNum);
            }else{
              this.isShowtip = true;
              this.message = '提交失败'
            }
          }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 清空标注
    delmark(){
      this.iscommon = true;
      this.mess = '您确认清空所有标注吗？';
      this.iszhu = false;
      this.type = 0;
    },
    // 复制别人的标注
    copymark(m){
      this.iscommon = true;
      this.mess = `您确定将“`+m.realname+`”的标注记录复制到“我的标注”记录中吗？`
      this.type = 2;
      this.iszhu = true;
      this.otherid = m.uid;
    },
    // 添加标注的弹窗
    addtip(){
      if(this.timeNow == "00:00"){
        return;
      }
      this.current = this.timeNow;
      for(var i=0;i<this.tips.length;i++){
           var m=this.tips[i];
           if(m.type == 0){
               if (m.timestamp== this.current) {
                  this.isShowtip = true;
                  this.message = '该时刻已存在标注!'
                  return false;
               }
           }
      }
      this.isAdd = true;
      this.markid = 0;
      this.content = null;
      this.otype = 0;
    },
    // 编辑标注
    eidtTip(e,inx,id){
      this.inx = inx;
      this.optype = 1;
      this.markid = id;
      this.current = this.tips[inx].timestamp;
      this.isAdd = true;
      this.content = this.tips[inx].description;
    },
    // 删除标注按钮
    delTip(e,id){
      this.iscommon = true;
      this.mess = '确定删除该条标注吗？'         
      this.index = id;
      this.iszhu = false;
      this.type = 1;
    },

    // 确认删除或清空事件1、删除  2、清空  3、复制
    sureDel(){
        this.iscommon = false;
        if(this.type == 1){
          this.$http.get('/Resource/MarkDeleteById',{
            params:{
              id: this.index
            }
         }).then(res=>{
             var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  this.isShowtip = true;
                  this.message = '删除成功';
                  this.getMyMark();
                }else{
                  this.isShowtip = true;
                  this.message = '删除失败';
                }
              }
          })
        }else if(this.type == 0){
          this.$http.post('/Resource/DeleteMarks',{
            rid:this.id,
            uid:this.uid,
          }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  this.isShowtip = true;
                  this.message = '清空成功';
                  this.stutas = '';
                  this.tips = [];
                  this.submit = 0;
                  this.empty = 0;
                  this.markcount = 0;
                  this.addmark = 0;
                }else{
                  this.isShowtip = true;
                  this.message = '清空失败'
                }
              }
          }).catch(err=>{
            console.log(err);
          })
        }else if(this.type == 2){
          this.$http.post('/Resource/CopyMarks',{
            fid:this.otherid,
            rid:this.id,
            tid:this.uid,
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.isShowtip = true;
              if(d.data){
                this.message = '复制成功';
                this.submit = 1;
                this.total = 0;
                this.empty = 1;
                this.getMyMark();
              }else{
                this.message = '复制失败';
              }
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    previewMark(val){
      this.otherid = val;
      this. getotherMark();
      this.submit = 0;
      this.total = 0;
      this.empty = 0;
      this.canAdd = true;
    },
    // 获得他人标注详情并复制
    getotherMark(){
        this.iscommon = false;
        this.tips = [];
        this.$http.get('/Resource/GetMarksDetail',{
          params:{
            rid:this.id,
            uid:this.otherid,
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              var data = d.data;
              for(var i = 0; i < data.length; i++){
                this.preViewMark = {};
                this.preViewMark.timestamp = data[i].timestamp;
                this.preViewMark.description = data[i].description;
                this.preViewMark.resourcesid = data[i].resourcesid;
                this.preViewMark.uid = data[i].uid;
                this.preViewMark.frame = '';
                this.preViewMark.type = 10;
                this.preViewMark.approvalstatus = 2;
                this.addmark = 0;
                this.tips.unshift(this.preViewMark);
              }
            }else{
                console.log(d.msg);
            }
          }
        }).catch(err=>{
          console.log(err)
        })
    },
    preMymark(){
      this.getMyMark();
      this.total = 0;
      this.canAdd = false;
    },
    getMyMark(){
       this.$http.get('/Resource/GetMarksDetail',{
          params:{
            rid:this.id,
            uid:this.uid,
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.tips = d.data;
              this.markcount = this.tips.length;
              if(this.tips.length > 0){
                this.empty = 1;
              }else{
                this.empty = 0;
              }
              if(this.stutas == '未提交'){
                this.submit = 1;
              }else{
                this.submit = 0;
              }
            }
          }
        })
    },
    // 关闭询问弹窗
    closeCommon(){
      this.iscommon = false;
    },
    // 标注弹窗隐藏
    closeAddtip(){
      this.isAdd = false;
    },
    
    // 点赞的切换
    toggleDood(){
      if(!this.canzan){//权限判断
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
            this.audioInfo.thumbsup = data.thumbsup;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 收藏的切换
    toogleCollect(e){
        var dom = e.currentTarget;
        if($(dom).hasClass('collect')){
           this.$http.post('/Resource/collectResource',{
              rid:this.id,
              uid:this.uid
           }).then(res=>{
              var d = $.parseJSON(res.data);
              console.log(d)
              if(d.msgid == 200){
                this.isShowtip = true;
                this.message = "收藏成功";
                this.isB = false;
              }else{
                this.isShowtip = true;
                this.isB = true;
                this.message = d.msg
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
                this.isB = true;
                this.message = "取消收藏成功"
              }
           })
        }
      },
    // 关闭提示弹窗
    closeCommentip(){
      this.isShowtip = false;
    },
    // 选中标注
    choseItem(e,inx,time){
      var dom = e.currentTarget;
          $('.circle').addClass('choseCircle').removeClass('choseCirclegreen');
          $(dom).addClass('choseCirclegreen').removeClass('choseCircle');
          $(".trlist").removeClass('blue')
          $(".trlist[value='"+inx+"']").addClass('blue');
          $(".eidt-s").addClass('wihte-eidt').removeClass('blue-eidt')
          $(".del-s").addClass('wihte-del').removeClass('blue-del');
          $(".wihte-eidt[value='"+inx+"']").addClass('blue-eidt').removeClass('wihte-eidt');
          $(".wihte-del[value='"+inx+"']").addClass('blue-del').removeClass('wihte-del');
          var timeArr = time.split(":");
          var num = parseInt(timeArr[0]);
           var num1 = parseInt(timeArr[1]);
           var current = num*60 + num1;
           this.current = current;
           if(current&&this.player){
             this.player.currentTime = current;
             this.player.play();
             this.isA = true;
           }
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1440px) {
  .audio-right .audio-bottom .audio-play .play-view .play-view-top .oprationBtn ul .audio-voice .voice-outer{
    margin-top:-0.1em !important;
  }
}
.audio-right{
	width:92%;
	height:85em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;
	margin-left:1.5%;
	float:left;
      color:#fff;
    	margin-top:6px;
      .audio-bottom{
        width:100%;
        padding:0 2em;
        overflow:hidden;
        
        .my-mark{
          float:left;
          width:20%;
          height:65em;
          position:relative;
          left:0;
          padding:1em;
          margin-right:1%;
        }
        .copy-info{
          float:left;
        }
        .audio-play{
          width:49%;
          float:left;
          height:65em;
          padding: 0 1em;
          .play-view{
            width:100%;
            height:27em;
            
            .play-view-top{
                width:100%;
                height:23em;
                background:url("../../assets/audioPlay/u307.png") no-repeat left top;
                background-size:100%;
                position:relative;
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
              top:-4em;
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
                position:absolute;
                left:2.5%;

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
                .audio-mark{
                  width:5em;
                  background:url("../../assets/videoPlay/u545.png") no-repeat center center;
                  background-size:25%;
                  border-right:1px solid #0b0b0b;
                  cursor:pointer;
                }
                .retrograde{
                  width:4em;
                  height:4em;
                  cursor:pointer;
                  background:url("../../assets/audioPlay/u302.png") no-repeat center center;
                  background-size:100%;
                  position:relative;
                  top:-0.5em;
                  left:1em;
                }
                .playBtn{
                  width:6em;
                  height:6em;
                  cursor:pointer;
                  position:relative;
                  top:-1.5em;
                  margin-left:1.2em;
                }
                .onPlayBtn{
                  background:url("../../assets/audioPlay/u305.png") no-repeat center center;
                  background-size:100%;
                }
                .onStopBtn{
                  background:url("../../assets/audioPlay/u304.png") no-repeat center center;
                  background-size:100%;
                }
                .go-forward{
                  width:4em;
                  height:4em;
                  cursor:pointer;
                  background:url("../../assets/audioPlay/u303.png") no-repeat center center;
                  background-size:100%;
                  position:relative;
                  top:-0.5em;
                  left:0.3em;
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
          .play-view-bottom{
            width:90%;
            margin:0 auto;
            height:4em;
            background:url("../../assets/audioPlay/u306.png") no-repeat center center;
            background-size:100%;
            ul{
                width:100%;
                overflow:hidden;
                padding-left:4em;

                li{
                  height:5em;
                  line-height:5em;
                  float:left;
                  margin-right:2em;
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
                .load{
                  padding-left:1.8em;
                  background:url("../../assets/videoPlay/u448.png") no-repeat left center;
                  background-size:40%;
                  cursor:pointer;
                }
              }
            }
          }
          .my-mark-list{
            width:100%;
            margin-top:2em;

            .my-mark-title{
              color:#0099ff;
              font-size:1.5em;
            }
            .my-mark-table{
              width:100%;
              height:33em;
              position:relative;
              padding:2em;
              background:url("../../assets/module/u10.png") no-repeat left top;
              background-size:100% 100%;

              .blue-vertical{
                  height:100%;
                  background-color:#0099ff;
                  width:0.5em;
                  border-radius:10px;
                  margin-left:11%;
              }
              .audio-table{
                width:100%;
                height:90%;
                top:5%;
                overflow-y:auto;
                position:absolute;
                left:0;
                padding:2em;
                text-align:center;

                table{
                width:100%;    
                td{
                  padding:1em 0;
                }
                .blue{
                  color:#0099ff;
                }

                td:first-child{
                  padding:0 !important;
                  text-align:left;
                }
                .choseCircle{
                  width:1.5em;
                  height:1.5em;
                  display:block;
                  background:url("../../assets/audioPlay/u365.png") center center;
                  background-size:100%;
                  cursor:pointer;
                }
                .choseCirclegreen{
                  width:1.5em;
                  height:1.5em;
                  display:block;
                  background:url("../../assets/audioPlay/u393.png") center center;
                  background-size:100%;
                  cursor:pointer;
                }
                .audio-img{
                  float:left;
                  width:6em;
                  height:4em;
                  background:url("../../assets/module/u987.png") no-repeat center center;
                  background-size:100%;
                }
                .audio-text{
                  float:left;
                  display: -webkit-box;
                  -webkit-line-clamp:2;
                  overflow: hidden;
                  width:19em;
                  height:2.9em;
                  margin-left:1em;
                  margin-top:0.5em;
                  text-align:left;
                }
                a{
                  display:inline-block;
                  width:2em;
                  height:2em;
                  cursor:pointer;
                }
                .wihte-eidt{
                  background:url("../../assets/videoPlay/u146.png") no-repeat center center;
                  background-size:100%;
                }
                .blue-eidt{
                  background:url("../../assets/audioPlay/u407.png") no-repeat center center;
                  background-size:100%;
                }
                .wihte-del{
                  background:url("../../assets/videoPlay/u148.png") no-repeat center center;
                  background-size:70%;
                }
                .blue-del{
                  background:url("../../assets/audioPlay/u405.png") no-repeat center center;
                  background-size:70%;
                }
              }
              }           
            }
          }
        }
      }
}
</style>
