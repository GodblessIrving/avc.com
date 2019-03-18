<template>
            <div class="myres-info">
    　　　　<ul class="nav">
    　　　　　　<li v-for="(m,i) in menus" @click="toggleTabs(m.component,i);" :class="[m.path.replace('/myresource/',''),{'active':i==actived}]">{{m.name}}</li>
    　　　　  </ul>
　　　　　  <live :is="currentView" keep-alive v-if="show" ref="child" @changeSize="listen"></live>
                    <resource-search v-if="!show" :keywords="keywords" :num="num"></resource-search>

                    <upload-file :show="isUp" 
                                   :resType="resType" 
                                   :resid="id"
                                   :foid="foid"
                                   :content="content"
                                   :inx="inx"
                                   ref="uploadfile"
                                   @saveEvent="confirmUpload"
                                   @closeEvent='closeUpload'
                                   @uploaded="uploaded"
                                   @editEvent="editSuccess">
                    </upload-file>
                    <upload :show="isTask" :tasklist="tasklist" :success="success" @closeEvent="isTask=false;"></upload>
                    <alert-tip :message='message' :isShowtip='isError' @closeTipEvent = 'isError=false;'></alert-tip>
　　    </div>
</template>

<script  type="text/ecmascript-6">
import {getChildrenAuth} from  '../../scripts/auth.js' ;
import resourceSearch from "./resourceSearch"
import upload from "../../components/myresource/upload"
import uploadFile from "../../components/myresource/uploadFile"
import alertTip from "../alertTip"
import {readFileMD5} from "../../scripts/file.js"
export default {
        name:"myres-info",
        data(){
          return{
            actived:0,
            show:true,
            //文件上传
            tasklist:[],
            cursor:0,//任务指针
            ws:null,//websocket对象
            reader:null,//fileReader对象
            success:0,//上传成功的个数
            step:1024*256,//每次读取文件大小，字节数
            cuLoaded:0,//当前已经读取文件总数
            //上传组件的属性
            isUp:false,
            resType:0,
            id:0,//资源id
            foid:0,
            content:'',
            isTask:false,
            inx:0,//点击上传页面的任务数
            //消息提示
            message:'',
            isError:false
          }
        },
        computed:{
            uid:function(){
                return this.$store.state.user.uid;
            },
            task:function(){//当前任务
                if(this.tasklist.length>0&&this.cursor<this.tasklist.length){
                    return this.tasklist[this.cursor];
                }
                return null;
            }
        },
         watch:{
            num:function(){
                this.show = false;
            },
            cursor(val,oldval){
              if(this.tasklist.length>val){
                  this.uploadFiles();
              }
            },
         },
         components:{resourceSearch,upload,uploadFile,alertTip},
         props:["num","keywords"],
         computed:{
            menus:function(){
                return getChildrenAuth(this.$route.path);
            },
            currentView:{
                  get:function(){
                    if(this.menus){
                        return this.menus[this.actived].component;
                    }
                  },
                  set:function(inx){
                    this.actived=inx;
                  }
            },
            uid:function(){
                return this.$store.state.user.uid;
            },
            task:function(){//当前任务
                if(this.tasklist.length>0&&this.cursor<this.tasklist.length){
                    return this.tasklist[this.cursor];
                }
                return null;
            },
         },
         methods:{
            showMsg(msg){
                this.message=msg;
                this.isError=true;
            },
            toggleTabs (com,num) {
                this.currentView=com;
                this.actived=num;
                this.show = true;
             },
             listen(){
              this.$emit('changeMemory');
             },
             getUploadingStatus(rtid,status){
                var classname='';
                switch(rtid){
                    case 1:
                        classname='video';
                        break;
                    case 2:
                        classname='audio';
                        break;
                    case 3:
                        classname='pic';
                        break;
                    case 4:
                        classname='word';//文稿
                        break;
                }
                if(status==1){
                    classname+='-cotinue';
                }else if(status==2){
                    classname+='-suspended';
                }else if(status==3){
                    classname='up-fail';
                }else{
                    classname='up-success';
                }
                return classname;
             },
             getTransCodingTitle(status){
                var title;
                switch(status){
                    case 1:
                        title='转码中';
                        break;
                    case 2:
                        title='转码失败';
                        break;
                    case 3:
                        title='停止转码';
                        break;
                    case 4:
                        title='审核中';
                        break;
                    case 5:
                        title='审核失败';
                        break;
                    default:
                         title='--';
                        break;
                }
                return title
             },
             getTransCodingStatus(rtid,status){
                var classname;
                var type='';
                switch(rtid){
                    case 1:
                        type='video-';
                        break;
                    case 2:
                        type='audio-';
                        break;
                    case 3:
                        type='pic-';
                        break;
                    case 4:
                        type='word-';
                        break;
                }
                switch(status){
                    case 1:
                        classname='transcoding';
                        break;
                    case 2:
                        classname='transcoding-fail';
                        break;
                    case 3:
                        classname='transcoding-stop';
                        break;
                    case 4:
                        classname='audit';
                        break;
                    case 5:
                        classname='audit-fail';
                        break;
                    default:
                         classname='';
                        break;
                }
                if(status==1||status==4){
                    classname=type+classname;
                }
                return classname
             },
            retranscoding(rid){
                this.$http.get('/Transcoding/ReTranscoding',{
                                            params:{
                                                rid:rid
                                            }
                                        }).then(res=>{
                                            var d = $.parseJSON(res.data);
                                            if(d){
                                                if (d.msgid==200) {
                                                    this.uploaded();
                                                }else{
                                                    console.log(d.msg);
                                                }
                                            }
                                        }).catch(err=>{
                                            console.log(err);
                                        });
             },
             //以下是上传代码
             createUpload(id,foid,content,resType){
                  this.id=id;
                  this.content=content;
                  this.resType=resType;

                  if(resType==0||resType>4){
                      this.foid=foid;
                      this.isUp=true;
                  }else{
                      this.getFolderId(resType);
                  }
            },
            confirmUpload(task){
              this.closeUpload();//关闭上传对话框并更新子组件样式
              this.isTask=true;//显示任务列表
              this.tasklist.push(task);

              if(this.tasklist.length-1==this.cursor){
                    this.uploadFiles();
              }    
            },
            uploadFiles(){
                  if(!this.task){
                    return false;
                  }
                  if(this.task.file.size>4*1024*1024*1024){
                      this.showMsg('文件大小不能超过4GB');
                      this.task.status=3;
                      this.$refs.child.getUploading();//更新子组件显示状态
                      this.cursor++;
                      return false;
                  }else if(this.task.file.size == 0){
                      this.showMsg('不允许上传空文件');
                      this.task.status=3;
                      this.$refs.child.getUploading();//更新子组件显示状态
                      this.cursor++;
                      return false;
                  }
                  if(this.task.status==4){
                     this.cursor++;
                     return false;
                  }
                 //判断云盘空间是否够上传当前文件；
                 this.$http.get('/myResources/GetMyCloudCapacity',{
                      params:{
                          uid:this.uid
                      }
                  }).then(res=>{
                      var d=$.parseJSON(res.data);
                      if (d) {
                          if (d.msgid==200) {
                              var space=d.data.allsize-d.data.size;
                              if (space<this.task.file.size) {
                                    this.showMsg('您的空间不足');
                                    this.task.status=3;
                                    this.$refs.child.getUploading();
                                    this.cursor++;
                               }else{
                                  //读取文件的MD5
                                  var _this=this;
                                  if(this.task.md5){//暂停,重新上传
                                    this.getUploadPath();
                                  }else{
                                    this.task.status=-1;
                                    readFileMD5(this.task.file,function(md5){
                                        _this.task.md5=md5;
                                        _this.task.data.md5=md5;
                                        _this.getUploadPath();
                                    }); 
                                  }
                               }
                          }
                     }
                  });
            },
            //获取websocket地址
            getUploadPath(){
                this.$http.get('/storage/getuploadpath',{
                      params:{
                          fileid:this.task.md5,
                          filesize:this.task.file.size
                      }
                  }).then(res=>{
                      if(res&&res.data){
                        var d=$.parseJSON(res.data);
                        if (d.msgid==200) {                                               
                              var json=JSON.parse(d.data);
                              var status=json.status;//0表示可以上传;1正在上传;16已完成上传;256文件上传中断;
                              var addr=json.upload_addr;
                              var  _this=this;
                              if (status==16) {
                                    //状态为16表示服务器上已有源文件；
                                    this.task.status=5;
                                    this.task.percent=100;
                                    this.task.pos=this.task.file.size;
                                    this.$refs.uploadfile.saveFileInfos(this.task.data);
                                    this.$refs.child.getUploading();
                                    this.cursor++;//指向下一个任务;
                                    this.success++;
                                    return false;
                              }

                              if (status==1) {
                                    this.showMsg('该文件正在上传中');
                                    return false;
                              }
                              // 断点续传
                              if(status==256){
                                // console.log(,json.file_size)
                                var prec = (parseInt(json.file_size)/this.task.file.size)*100;
                                this.task.percent = parseInt(prec);
                                this.task.pos=parseInt(json.file_size);
                              }
                              
                              for(var i=0;i<addr.length;i++){
                                    var ad=addr[i];
                                    if (ad.indexOf('ws:')==0) {
                                      this.createSocket(ad);                           
                                      break;
                                    }
                              }
                          }else{
                              this.showMsg('获取文件上传地址失败');
                          }
                      }
                  }).catch(err=>{
                      console.log(err);
                  });
            },
            createSocket(wsUrl){
                let url=wsUrl+'file_id='+this.task.md5+'&file_size='+this.task.file.size+'&file_name='+Base64.encode(this.task.file.name)+'&file_pos='+this.task.pos;
                var _this=this;

                this.ws = new WebSocket(url);
                this.ws.onopen = function () {//socket服务端拒绝连接有以下3种：文件已存在；断点续传pos值不正确；文件正在上传中；
                    _this.sendFileData();
                }
                this.ws.onmessage = function (e) {
                    //console.info(e.data);
                }
                this.ws.onclose = function (e) {
                    //console.info(e);

                    if(_this.task.pos<_this.task.size){
                      _this.task.status=3;
                    }
                    _this.$refs.child.getUploading();  
                    _this.cursor++;//指向下一个任务;
                }
                this.ws.onerror = function (e) {
                    //console.info(e);
                }
            },
            sendFileData(){
                let file=this.task.file;
                this.cuLoaded=this.task.pos;
                var _this=this;

                      if(!this.reader){
                          this.reader=new FileReader();
                      }
                     this.reader.onload=function(e){
                        //根据当前缓冲区来控制客户端读取速度;
                        if (_this.ws.bufferedAmount >_this.step*10) {
                            setTimeout(function(){
                                loadSuccess(e);
                            }, 3);
                        }else{
                            loadSuccess(e);
                        }
                    };

                    function loadSuccess(e) {
                        //将分段数据上传到服务器
                        if(_this.ws.readyState!=1){//如果上传过程中websocket服务端掉线，则不执行下面逻辑;
                          return false;
                        }

                        var blob = e.target.result;
                          _this.ws.send(blob);
                       
                        //如果没有读完，继续
                        _this.cuLoaded += e.loaded;
                        _this.task.pos=_this.cuLoaded;
                        if (_this.cuLoaded < file.size) {
                            _this.readBlob(file);
                        } else {
                            let timer= setInterval(function(){
                                if (_this.ws&&_this.ws.bufferedAmount===0) {
                                    _this.ws.close();
                                    _this.ws=null;//没有找到释放ws的方法,一次性上传大量文件可能会有性能问题;
                                    _this.task.status=4;
                                    _this.success++;
                                    _this.cuLoaded=0;
                                    _this.$refs.uploadfile.saveFileInfos(_this.task.data);
                                    clearInterval(timer);
                                }
                            }, 50)
                        }
                        //显示结果进度
                        _this.task.percent = ((_this.cuLoaded / file.size)*100).toFixed();
                    }

                    _this.readBlob(file);
            },
            readBlob(file) {
                var blob = file.slice(this.cuLoaded, this.cuLoaded + this.step);
                this.reader.readAsArrayBuffer(blob);
                if(this.task.status!=1){
                  this.task.status=1;
                  this.$refs.child.getUploading();
                }
            },
            pause(){
                  this.reader.abort();
                  this.task.status=2;
                  //更新子组件显示样式;
                  this.$refs.child.getUploading();
            },
            continue1(){
                  this.readBlob(this.task.file);
                  this.$refs.child.getUploading();
            },
            restart(inx){
                  if(this.cursor==inx){//失败的时，继续需要用到inx；暂停则不需要；
                    this.uploadFiles();
                  }else{
                    this.cursor=inx;//触发watch
                  }
                  this.task.pos=0;//值不为0时，websocket服务端会拒绝连接；
            },
            delete1(inx){
                if(inx>this.cursor){
                   this.tasklist.splice(inx,1);
                }
                else if(inx==this.cursor){
                  this.stop();
                  this.tasklist.splice(inx,1);
                  this.uploadFiles();
                }else{
                  this.stop();
                  this.tasklist.splice(inx,1);
                  this.cursor--;//触发watch
                }
                this.$refs.child.getUploading();
            },
            stop(){
                  if(this.reader){
                    this.reader.abort();
                  }
                  if(this.ws){
                    this.ws.close();
                    this.ws=null;
                  }
            },
            uploaded(){
                this.$refs.child.uploaded();
            },
            closeUpload(){
              this.isUp=false;
              this.$refs.child.closeUp();
            },
            editSuccess(){
              this.closeUpload();
              this.uploaded();
            },
            getFolderId(froms){
               this.$http.get('/myResources/GetMyDefaultFolder',{
                        params:{
                            rtid:froms
                        }
                    }).then(res=>{
                      if(res.data){
                          var d=JSON.parse(res.data);
                          if(d.msgid==200){
                            this.foid=d.data;
                            this.isUp=true;
                          }
                      }
                    });
              },
         },
    }
</script>

<style lang="scss">
   .myres-info{
    width:18%;
    float:left;
    color:#fff;
    height:73em;
    background:url("../../assets/module/u10.png") no-repeat;
    background-size:100% 100%;
    margin-left:1%;
    padding:3em 0.2em 0;
    .nav{
        li{
        width:100%;
        height:5em;
        line-height:5em;
        padding-left:40%;
        font-size:1.3em;
        cursor:pointer;
    }
    .active{
        background-color:#5a5a5a;
    }
    .allres{
        background-image:url("../../assets/resouce/u2501.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:12%;
    }
    .myvideo{
        background-image:url("../../assets/module/u21.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    .myaudio{
        background-image:url("../../assets/module/u35.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    .mypic{
        background-image:url("../../assets/module/u37.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    .mydraft{
        background-image:url("../../assets/module/u39.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:13%;
        padding-left:45%;
    }
    .myclips{
        background-image:url("../../assets/resouce/u4235.jpg");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    .synthesis{
        background-image:url("../../assets/resouce/u4233.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    .storage{
        background-image:url("../../assets/resouce/u291.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    .mymark{
        background-image:url("../../assets/resouce/u4247.png");
        background-repeat:no-repeat;
        background-position:4em center;
        background-size:12%;
        padding-left:45%;
    }
    }
   }
</style>