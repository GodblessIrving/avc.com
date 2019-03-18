<template>
<div v-if="show" class="masklayer">
	<div class="upload-btn">
                        <div class="title-top">
                             <p>{{operate}}{{messTitle}}</p>
                             <span class="red-close" @click="close();"></span>
                        </div>
                        <div class="content">
                        	<p class="item" style="margin-bottom:2em;position:relative" v-show="resType==0||resType==6">
                                        <img src="../../assets/system/red.png" height="30" width="30" alt="" style="position:absolute;">
                                        <span class="span-name">{{messTitle}}类型：</span>
                                        <select :name="messTitle+'类型'" id="" v-model="rtid" 
                                        v-validate="{not_in:[0]}">
                                                <option :value="0"  selected>请选择</option>
                                                <option :value="1">视频</option>
                                                <option :value="2">音频</option>
                                                <option :value="3">图片</option>
                                                <option :value="4">文稿</option>
                                        </select>
                                        <p class="is-danger" v-show="errors.has(messTitle+'类型')" style="margin-top:-1.5em">{{errors.first(messTitle+'类型')}}</p>
                          </p>
                          <p class="item">
                                  <span class="span-name">{{messTitle}}名称：</span>
                                  <input type="text" :placeholder="'请输入'+messTitle+'名称'" v-model="title"
                                  :name="messTitle+'名称'" v-validate="'required'" maxlength="400">
                                  <p class="is-danger" v-show="errors.has(messTitle+'名称')">{{errors.first(messTitle+'名称')}}</p>
                          </p>
                          <p v-show="resid==0" style="margin-bottom:2em;" class="item choseResource">
                                  <span class="choseName span-name">选择{{messTitle}}：</span>
                                  <a href="javascript:void(0)" class="blue-add" v-show="addfile">
                                      <input type="file" @change="getPath" id="choseFile">
                                  </a>
                                  <span class="clearFile" style="color:red;" @click="clearFile" v-show="!addfile">×</span>
                          </p>
                           <p class="item resourceClass" v-show="resType!=5">
                                   <span class="span-name">{{messTitle}}分类：</span>
                                   <select name="" id="" v-model="classid">
                                           <option :value="0" selected>请选择</option>
                                           <option v-for="c in classList" v-if="classList.length>0" :value="c.id">
                                           {{c.name}}</option>
                                   </select>
                                   <p class="is-danger" v-show="errors.has(messTitle+'分类')">{{errors.first(messTitle+'分类')}}</p>
                           </p>
                           <p v-show="isgroup" class="item" style="margin-top:2em;">
                                   <span class="span-name">{{messTitle}}来源：</span>
                                   <select name="" id="" v-model="sourceid">
                                           <option :value="0" selected>请选择</option>
                                           <option v-for="s in sourceList" v-if="sourceList.length>0" :value="s.id">
                                           {{s.name}}</option>
                                   </select>
                                   <p class="is-danger" v-show="errors.has(messTitle+'来源')">{{errors.first(messTitle+'来源')}}</p>
                           </p>
                           <p style="padding-left:2.6em; margin-top:2em;">
                             <span style="margin-right:2em;cursor:pointer" class="cur baseinfo" @click="BaseInfoblock($event)">概要信息</span>
                             <span style="cursor:pointer" @click="copyrightBlock($event)" class="copyingo" v-show="showTip">版权信息</span>
                           </p>
                           <div class="gainfo" v-show="baseInfo">
                             <div style="margin-bottom:2em; margin-top:2em" class="item" v-if="showTip">
                                     <span  style="float:left;" class="span-name">{{messTitle}}标签：</span>
                                     <div style="float:left; width:77%;">
                                     <div style="width:100%; overflow:hidden;" class="tipBox">
                                          <p v-for="(tip,inx) in tipArr" class="addTip" >{{tip}}<span class="dele"  @click="clearTip(inx)">×</span></p>
                                          <p v-show="showAdd" :class="[isAdd?'gray-add':'blue-add']" @click="addtip" class="Audiotip"></p>
                                     </div>
                                     <p class="add-tip" v-show="isAdd" style="margin-bottom:2em; clear:both;position:relative; top:-1em;left:0;">
                                          <input type="text" v-model="tip" v-on:input="checkTipExist" maxlength="10">
                                          <a href="javascript:void(0)" @click="saveTip()">保存</a>
                                          <a href="javascript:void(0)" @click="closeadd()">取消</a>
                                    </p>
                               </div>
                            </div>
                            <p class="item">
                                    <span style="float:left" class="span-name">{{messTitle}}简介：</span>
                                    <textarea cols="60" rows="8" :placeholder="'请输入'+messTitle+'的简介'" v-model="description" name="messTitle+'简介'" maxlength="2000">
                                    </textarea>
                            </p>
                            <p class="item" v-if="iscommon">
                                    <span class="span-name">公开或私有：</span>
                                    <label for=""><input type="radio" name="123" value="1" v-model="public">公开</label>
                                    <label for=""><input type="radio" name="123" value="0" v-model="public">私有</label>
                            </p>
                          </div>
                          <!-- 版权信息 -->
                          <div class="gainfo" v-show="copyright">
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">版权人：</span>
                                  <input type="text" placeholder="请输入版权人" v-model="holder" maxlength="45">
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">首次发布方式：</span>
                                  <select name="" id="" v-model="ptype">
                                    <option value="0">请选择</option>
                                    <option v-for="p in publicTypes" :value="p.id">{{p.name}}</option>
                                  </select>
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">发布日期：</span>
                                  <el-date-picker
                                    v-model="ptime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="发布日期">
                                </el-date-picker>
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">创作性质：</span>
                                  <select name="" id="" v-model="nature">
                                    <option value="0">请选择</option>
                                    <option v-for="n in natures" :value="n.id">{{n.name}}</option>
                                  </select>
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">首次发布地点：</span>
                                  <input type="text" placeholder="请输入首次发布地点" v-model="paddr" maxlength="45">
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">作者：</span>
                                  <input type="text" placeholder="请输入作者" v-model="author" maxlength="45">
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">版权归属方式：</span>
                                  <select name="" id="" v-model="ownership">
                                    <option value="0">请选择</option>
                                    <option v-for="o in ownerships" :value="o.id">{{o.name}}</option>
                                  </select>
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                  <span class="span-name">版权保护：</span>
                                  <input type="text" placeholder="请输入版权保护" v-model="protection" maxlength="200">
                              </p>
                              <p class="item" style="margin-bottom:1.5em">
                                    <span style="float:left" class="span-name">版权声明：</span>
                                    <textarea cols="60" rows="8" placeholder="请输入版权声明" v-model="statement" maxlength="400">
                                    </textarea>
                            </p>
                          </div>
                        </div>
                        <div class="edit-btn">
                            <a href="javascript:void(0)" @click="save">提交</a>
                            <a href="javascript:void(0)" @click="close">取消</a>
                        </div>
       </div>  
    </div>
</template>
<script type="text/ecmascript-6">
	export default{
		name:"upload-file",
		data(){
			return{
                          //表单model数据
                          title:'',
                          filename:'',
                          rtid:0,
                          classid:0,
                          sourceid:0,
                          label:'',
                          description:'',
				public:1,
                          md5:'',
                          format:'',
                          size:0,
                          duration:0,
                          resolution:'',
                          //版权
                          holder:'',
                          ptype:0,
                          ptime:'',
                          nature:0,
                          paddr:'',
                          author:'',
                          ownership:0,
                          protection:'',
                          statement:'',
                          //其他必要信息
                          loadfile:null,
                          addfile:true,
                          classList:[],//资源分类
                          sourceList:[],
                          publicTypes:[],
                          natures:[],
                          ownerships:[],
    				tip:'',
    				tipArr:[],
                          isAdd:false,
                          tipExist:false,
                          //tab栏
                          copyright:false,
                          baseInfo:true,
                          enableSuffix:{},
                          auto:false,//表示文件名称是自动获取还是用户自己填的
                          showTip:false,
                          iscommon:true,
			}
		},
		props:{
                  show:{
                    type:Boolean,
                    default:false
                  },
                  resType:{
                    type:Number,
                    default:0,//0全部资源,1视频,2音频,3图片,4文稿,5相册,6公共存储
                    required:true,
                  },
                  resid:{
                    type:Number,
                    default:0
                  },
                  content:{
                    type:String,
                    default:'全部资源'
                  },
                  foid:{
                    type:Number,
                    default:0
                  },
                  inx:{
                    type:Number,
                    default:0
                  },
            },
          computed:{
              uid:function(){
                  return this.$store.state.user.uid;
              },
              isgroup:function(){
                  return this.$store.state.user.type;
              },
              operate:function(){
                  if(this.resid){
                      return '编辑';
                  }else{
                      return '上传';
                  }
              },
              messTitle:function(){
                  switch(this.resType){
                    case 0:
                      return '资源';
                      break;
                    case 1:
                      return '视频';
                      break;
                    case 2:
                      return '音频';
                      break;
                    case 3:
                      return '图片';
                      break;
                    case 4:
                      return '文稿';
                      break;
                    default:
                      return '资源';
                      break;
                  }
              },
              showAdd:function(){
                if(this.tipArr.length>=20){
                  return false;
                }else{
                  return true;
                }
              },
          },
          watch:{
              show(val,oldVal){
                  if(val){
                      //初始化
                     this.getClasses();
                     this.getPublicTypes();
                     this.getNatures();
                     this.getOwnerships();
                     this.getAllSource();
                     this.getSuffix();
                     //我的视频、音频、图片、文稿上传时，不显示类型下拉框，所以需要给rtid赋值;
                     if(this.resType>0&&this.resType<5){
                        this.rtid=this.resType;
                     }
                     if(this.resType==5){
                        this.rtid=3;
                     }
                     if(this.resType==3||this.resType==5){
                        this.showTip = false;
                     }else{
                        this.showTip = true;
                     }
                     if(this.resType == 6){
                      this.iscommon = false;
                     }else{
                      this.iscommon = true;
                     }
                     //如果是编辑则执行赋值
                     if(this.resid){
                        this.getResourceDetails();
                        this.getCopyright();
                     }
                  }else{
                    //隐藏时清除数据
                    this.clearInfos();
                  }
              },
              rtid(val,oldval){
                $(".baseinfo").addClass('cur');
                $(".copyingo").removeClass('cur')
                if(val==3){
                  this.showTip = false;
                  this.copyright = false;
                  this.baseInfo = true;
                }else{
                  this.showTip = true;
                  this.baseInfo = true;
                  this.copyright = false;
                }
              }
          },
	    methods:{
                   // #region 对外开放方法；
                   close(){
                        //清除历史数据;
                        this.clearInfos();
                        this.$emit('closeEvent');
                   },
                   save(){
                         this.$validator.validateAll().then((result)=>{
                          if (result) {
                                this.label=this.tipArr.join(',');
                                if(this.resid>0){//编辑
                                   // if(this.resType==6){
                                   //      //编辑公共存储文件
                                   //      // this.editFileInfos();
                                   // }else{
                                   //      this.editFileInfos();
                                   // }
                                   this.editFileInfos();
                                }else{//新增
                                  if(!this.loadfile){
                                    this.$parent.showMsg('请选择要上传的文件');
                                    return false;
                                  }
                                  if(!this.checkFileSuffix(this.format,this.rtid)){
                                      this.$parent.showMsg("您选择的文件与资源类型不匹配,请重新选择!");
                                      return false;
                                  }

                                  this.createTask();
                                }
                          }
                      });
                  },
                   createTask(){
                         var data={
                              uid:this.uid,
                              title:this.title,
                              filename:this.filename,
                              rtid:this.rtid,
                              classid:this.classid,
                              sourceid:this.sourceid,
                              label:this.label,
                              description:this.description,
                              public:this.public,
                              md5:this.md5,
                              format:this.format,
                              size:this.size,
                              duration:this.duration,
                              resolution:this.resolution,
                              type:1,//0收藏，上传，2合成
                              holder:this.holder,
                              ptype:this.ptype,
                              ptime:this.ptime,
                              nature:this.nature,
                              paddr:this.paddr,
                              author:this.author,
                              ownership:this.ownership,
                              protection:this.protection,
                              statement:this.statement
                         };
                         if(this.resType==6){
                            data.cfoid=this.foid;//公共存储的上传用的是cfoid;
                         }else{
                            data.foid=this.foid;
                         }
                         var task={
                              md5:this.md5,
                              filename:this.title+this.format,
                              content:this.content,
                              file:this.loadfile,
                              size:this.loadfile.size,
                              status:0,//0排队,1上传中,2暂停,3上传失败,4上传成功
                              percent:0,
                              pos:0,//标识发送数据的位置,开始=0,成功=filesize;
                              created:new Date(),
                              data:data,
                              resType:this.resType
                          };
                          this.$emit('saveEvent',task);
                  },
                    //#endregion 

                    //#region 概要和版权tab切换
                    BaseInfoblock(e){
                      var dom = e.currentTarget;
                      $(dom).addClass('cur').siblings('span').removeClass('cur');
                      this.baseInfo = true;
                      this.copyright = false;
                    },
                    copyrightBlock(e){
                      var dom = e.currentTarget;
                      $(dom).addClass('cur').siblings('span').removeClass('cur');
                      this.baseInfo = false;
                      this.copyright = true;
                    },
                    //#endregion 概要和版权tab切换

                    clearInfos(){
                        this.rtid=0;
                        this.title='';
                        this.sourceid=0;
                        this.addfile=true;
                        this.classid=0;
                        this.label='';
                        this.description='';
                        this.public=1;
                        //标签
                        this.tipArr=[];
                        this.closeadd();
                        
                        this.clearFile();
                        //版权
                          this.holder='';
                          this.ptype=0;
                          this.ptime='';
                          this.nature=0;
                          this.paddr='';
                          this.author='';
                          this.ownership=0;
                          this.protection='';
                          this.statement='';
                          //显示概要隐藏版权
                          this.baseInfo = true;
                          this.copyright = false;
                          this.auto=false;
                    },
                  saveFileInfos(parms){
                    this.$http.post('/myResources/saveFileInfos',parms).then(res=>{
                                            var d=$.parseJSON(res.data);
                                            if (d) {
                                                    if (d.msgid==200) {
                                                        this.$emit('uploaded');
                                                    }else{
                                                        this.$parent.showMsg(d.msg);
                                                    }
                                            }
                                        }).catch(err=>{
                                            console.log(err);
                                        });
                  },
                  editFileInfos(){
                    this.$http.post('/myResources/UpdateFileInfos',{
                                            rid:this.resid,
                                            title:this.title,
                                            class:this.classid,
                                            source:this.sourceid,
                                            label:this.label,
                                            description:this.description,
                                            public:this.public,
                                            holder:this.holder,
                                            ptype:this.ptype,
                                            ptime:this.ptime,
                                            nature:this.nature,
                                            paddr:this.paddr,
                                            author:this.author,
                                            ownership:this.ownership,
                                            protection:this.protection,
                                            statement:this.statement
                    }).then(res=>{
                        var d=$.parseJSON(res.data);
                        if (d) {
                            if (d.msgid==200) {
                                this.$parent.showMsg('编辑成功');
                                this.$emit('editEvent',this.resType);
                            }else{
                                this.$parent.showMsg(d.msg);
                            }
                        }
                    }).catch(err=>{
                        console.log(err);
                    });
                  },


			 // 获取所有分类名称
                    getClasses(){
                             this.$http.get('Resource/GetResourceClass',{
                             }).then(res=>{
                                 var d=$.parseJSON(res.data);
                                 if (d) {
                                     if (d.msgid==200) {
                                         this.classList=d.data;
                                     }else{
                                         console.log(d.msg);
                                     }
                                 }
                             }).catch(err=>{
                                 console.log(err);
                             });
                        },
                    // 获取所有来源
                     getAllSource(){
                             this.$http.get('/Resource/GetResourceSource'
                             ).then(res=>{
                                 var d=$.parseJSON(res.data);
                                 if (d) {
                                     if (d.msgid==200) {
                                         this.sourceList=d.data;
                                     }else{
                                         console.log(d.msg);
                                     }
                                 }
                             }).catch(err=>{
                                 console.log(err);
                             });
                     },
                    //发布方式
                    getPublicTypes(){
                             this.$http.get('systemManage/GetEnabledPublicType',{
                             }).then(res=>{
                                //console.log(res.data);
                                 var d=$.parseJSON(res.data);
                                 if (d) {
                                     if (d.msgid==200) {
                                         this.publicTypes=d.data;
                                     }else{
                                         console.log(d.msg);
                                     }
                                 }
                             }).catch(err=>{
                                 console.log(err);
                             });
                        },
                       //创作性质
                        getNatures(){
                             this.$http.get('systemManage/GetEnabledNature',{
                             }).then(res=>{
                                //console.log(res.data);
                                 var d=$.parseJSON(res.data);
                                 if (d) {
                                     if (d.msgid==200) {
                                         this.natures=d.data;
                                     }else{
                                         console.log(d.msg);
                                     }
                                 }
                             }).catch(err=>{
                                 console.log(err);
                             });
                        },                       
                        getOwnerships(){
                             this.$http.get('systemManage/GetEnabledOwnership',{
                             }).then(res=>{
                                 var d=$.parseJSON(res.data);
                                 if (d) {
                                     if (d.msgid==200) {
                                         this.ownerships=d.data;
                                     }else{
                                         console.log(d.msg);
                                     }
                                 }
                             }).catch(err=>{
                                 console.log(err);
                             });
                    },

                    // #region 标签相关
                    addtip(){
                         this.isAdd = true;
                    },
                    // 添加标签的输入框隐藏
                    closeadd(){
                         this.isAdd = false;
                         this.tip = '';
                         $(".tipError").remove();
                    },
                     // 上传文件的时候判断标签是否重复
                    checkTipExist(){
                        if (this.tipArr.contain(this.tip)) {
                          var error='<span class="is-danger tipError">该标签已经被添加过了</span>';
                          $(".add-tip").append(error);
                          this.tipExist=true;
                        }else{
                          this.tipExist=false;
                          $(".add-tip").find('.is-danger').remove();
                        }
                    },
                   // 给上传的文件添加标签
                    saveTip(){
                           if (this.tip==''||this.tipExist) {
                                return false;
                            }

                            this.tipArr.push(this.tip);
                            this.isAdd = false;
                            this.tip='';
                    },
                   clearTip(inx){
                      this.tipArr.splice(inx, 1);
                   },
                    //#endregion

                    //#region file相关操作
                     clearFile(){
                        $('.filepath').remove();
                        $(".choseResource").css({"margin-top":"0"}); 
                        $('#choseFile').val(''); 

                        if(this.auto){
                          this.title='';
                        }
                        this.addfile=true;
                        this.loadfile=null;
                        this.filename='';
                        this.md5='';
                        this.format='';
                        this.size=0;
                    },
                   	// file控件的change事件；
                  	getPath(){
                  	  var  fileBox=document.getElementById('choseFile');
                  	  var span = '<span class="filepath">'+fileBox.value+'</span>';
                  	  $(".choseName").after(span);
                  	  this.addfile = false; 
                          $(".choseResource").css({"margin-top":"2em"});
                          var file=fileBox.files[0];
                          var inx=file.name.lastIndexOf('.');  
                          var filename=file.name;
                          var _this=this;
                  	       this.loadfile=file;
                          if(!this.title){
                            var title=filename.substring(0,inx);
                            this.title=title.length>400?title.substr(0,400):title;
                            this.auto=true;
                          }else{
                            this.auto=false;
                          }
                          this.filename=filename;
                          this.format=filename.substr(inx,filename.length-1);
                          this.size=file.size;      
                   	},
                    //#endregion

                      //检查文件的类型
                      checkFileSuffix(suffix,rtid){
                        var scope=[];
                        switch(rtid){
                          case 1:
                            scope=this.enableSuffix.v;
                            break;
                          case 2:
                            scope=this.enableSuffix.a;
                            break;
                          case 3:
                            scope=this.enableSuffix.p;
                            break;
                          case 4:
                            scope=this.enableSuffix.d;
                            break;
                        }
                        if(scope.contain(suffix.toLowerCase())){
                            return true;
                        }else{
                           return false;
                        }
                      },
                      getResourceDetails(){
                         this.$http.get('/resource/GetResourceDetails',{
                            params:{
                                id:this.resid,
                                uid:this.uid
                            }
                        }).then(res=>{
                            var d=$.parseJSON(res.data);
                            if (d) {
                                if (d.msgid==200) {
                                    var infos=d.data.resmsg;
                                    this.rtid=infos.rtid;
                                    this.title=infos.title;
                                    this.classid=infos.classid?infos.classid:0;
                                    this.sourceid = infos.sourceid?infos.sourceid:0;
                                    this.public=infos.public;                                    
                                    //标签
                                    this.label=infos.lname;
                                    
                                    if(infos.lname){
                                        this.tipArr=infos.lname.split(',');
                                    }
                                    var files=infos.file;
                                    if (files&&files.length>0) {
                                      var file=files[0];
                                      this.description=file.description;
                                      this.filename=file.title;
                                      this.md5=file.md5; 
                                      this.format=file.suffix;
                                      this.size=file.filesize;
                                      this.duration=file.duration;
                                      this.resolution=file.resolution;
                                    }

                                }else{
                                    console.log(d.msg);
                                }
                            }
                        }).catch(err=>{
                            console.log(err);
                        });
                    },
                    getCopyright(){
                      this.$http.get('/Resource/GetResourceCopyright',{
                        params:{
                          rid:this.resid
                        }
                      }).then(res=>{
                        var d = $.parseJSON(res.data);
                        if(d){
                          if(d.msgid == 200){
                            var copyright = d.data;
                            if(copyright){
                                this.holder=copyright.holder;
                                this.ptype=copyright.ptypeid?copyright.ptypeid:0;
                                this.ptime=copyright.ptime;
                                this.nature=copyright.natureid?copyright.natureid:0;
                                this.paddr=copyright.paddr;
                                this.author=copyright.author;
                                this.ownership=copyright.ownershipid?copyright.ownershipid:0;
                                this.protection=copyright.protection;
                                this.statement=copyright.statement;
                            }
                          }else{
                            console.log(d.msg);
                          }
                        }
                      }).catch(err=>{
                        console.log(err)
                      })
                    },
                    getSuffix(){
                      this.$http.get('/myResources/GetEnableSuffix')
                      .then(res=>{
                        if(res.data){
                          var d = $.parseJSON(res.data);
                          if(d.msgid==200){
                            this.enableSuffix=d.data;
                          }
                        }
                      }).catch(err=>{
                        console.log(err);
                      });
                    },
		}
	} 
</script>

<style lang="scss">
@media screen and (max-width: 1366px) {
  .myresource-view .upload-btn .content{
    max-height:30em !important;
  }
}
	.is-danger {
                    color: red;
                    padding-left: 11em;
                }
      .tipError{
        padding:0 !important;
        margin-top:0.5em;
      }
      .upload-btn .el-input__inner{
        height:3em !important;
      }
      .cur{
        color:#0099ff;
      }
      .gainfo{
        width:100%;
        height:auto;
        background-color:#303030;
        padding:0.7em 0;
      }
      .upload-btn .content .item .add-tip{
        margin-left:0em;
      }
</style>