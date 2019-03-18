<template>
  <div class="videoaudit">
      <div class="opera">
      	<a href="javascript:void(0)" @click="PassTask">通过</a>
            <a href="javascript:void(0)" @click="rejected">驳回</a>
            <a href="javascript:void(0)" @click="deleteAll">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索视音频审核名称" v-model="keyknows">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
            <p class="check">
            		<label for="input1"><input type="checkbox" id="input1" value="2" v-model="status">待审核</label>
            		<label for="input2"><input type="checkbox" id="input2" value="3" v-model="status">已审核</label>
            		<label for="input3"><input type="checkbox" id="input3" value="4" v-model="status">驳回</label>
            </p>
      </div>
      <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="10">名称</th>
                        <th width="7">类型</th>
                        <th width="7">分类</th>
                        <th width="7">来源</th>
                        <th width="15">标签</th>
                        <th width="12">申请时间</th>
                        <th width="5">提交人</th>
                        <th width="7">状态</th>
                        <th width="22">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in infoList">
                        <td><input type="checkbox" :value="i.id" v-model="ids"></td>
                        <td :title="i.title">{{i.title}}</td>
                        <td :title="i.tname">{{i.tname}}</td>
                        <td :title="i.cname">{{i.cname}}</td>
                        <td :title="i.sname">{{i.sname}}</td>
                        <td :title="toString(i.label)">{{toString(i.label)}}</td>
                        <td :title="i.subtime">{{i.subtime}}</td>
                        <td :title="i.submitter">{{i.submitter}}</td>
                        <td v-if='i.status == 2'>待审核</td>
                        <td v-if='i.status == 2'>
                            <a href="javascript:void(0)" @click="togglePreview(i.tname,i.rid,1,i.id)">预览</a>
                            <a href="javascript:void(0)" @click="passOne(i.id)">通过</a>
                            <a href="javascript:void(0)" @click="rejectOne(i.id)">驳回</a>
                            <!-- <a href="javascript:void(0)" @click="togglePreview(i.path,i.tname,i.rid,2,i.id)">编辑</a> -->
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                        <td class="green" v-if='i.status == 3'>已审核</td>
                        <td v-if='i.status == 3'>
                            <a href="javascript:void(0)" @click="togglePreview(i.tname,i.rid,1,i.id)">预览</a>
                            <a href="javascript:void(0)" @click="enabletask(i.id,i.status,i.tname)">禁用</a>
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                        <td class="red" v-if='i.status == 4'>驳回</td>
                        <td v-if='i.status == 4'>
                            <a href="javascript:void(0)" @click="togglePreview(i.tname,i.rid,1,i.id)">预览</a>
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                        <td class="red" v-if='i.status == 5'>禁用</td>
                        <td v-if='i.status == 5'> 
                            <a href="javascript:void(0)" @click="togglePreview(i.tname,i.rid,1,i.id)">预览</a>
                            <a href="javascript:void(0)" @click="enabletask(i.id,i.status,i.tname)">启用</a>
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="15"
                layout="prev, pager, next"
                :total="count"
                v-show="page">
            </el-pagination>
        </div>
        <preview :isPreview="isPreview" 
                       :isView="isView" 
                       :path="path"
                       :isvideo="isvideo"
                       :rid="rid"
                       :profile="profile"
                       :tipArr="tipArr"
                       :mestitle="mestitle"
                       :copyright= "copyright"
                       :duration='getTime(durations)'
                       :format = "format"
                       :isedit = "isedit"
                       :tid="tid"
                       :uid="uid"
                       :classList="classList"
                       :sourceList="sourceList"
                       @addNewEvent="addsuess"
                       @closeNewEvent="closeView()">
        </preview>
        <common-tip 
            :isShow="isShow"
            :message="message"
            @delObjEvent = "sureOperation"
            @closeTipEvent="closeTip">
        </common-tip>
        <alert-tip 
          :isShowtip="isShowtip"
          :message="mess"
          @closeTipEvent="close">
        </alert-tip>
  </div>
</template>

<script>
import preview from "./preview"
import CommonTip from "../CommonTip"
import alertTip from "../alertTip"
export default {
  name: 'videoaudit',
  data(){
  	return{
  		isPreview:false,
            isView:true,
            keyknows:'',
            status:[],
            pageindex:1,
            pagesize:15,
            count:0,
            page:true,
            currentPage:1,
            infoList:[],
            path:'',
            ids:[],
            isShow:false,
            message:'',
            isShowtip:false,
            mess:'',
            type:0,
            pass:0,
            enable:0,
            isvideo:false,
            rid:0,
            taskinfo:[],
            profile:'',
            copyright:[],
            tipArr:[],
            mestitle:'',
            format:'',
            durations:'',
            isedit:false,
            classList:[],
            sourceList:[],
            tid:''
  	}
  },
 components:{preview,CommonTip,alertTip},
  watch:{
    status:function(){
      this.getAllMyTask();
    },
    ids:function(){
      if(this.ids.length < this.infoList.length){
        $("#checkAll").prop("checked",false);
      }else if(this.ids.length > 0&&this.ids.length == this.infoList.length){
        $("#checkAll").prop("checked",true);
      }
    }
  },
 mounted:function(){
  this.getAllMyTask();
 },
 computed:{
      uid:function(){
          return this.$store.state.user.uid;
      }
  },
  methods:{
      // 获取所有视音频审核任务
      getAllMyTask(){
        this.$http.get('task/GetMyAVTask',{
          params:{
            pagesize:this.pagesize,
            pageindex:this.pageindex,
            uid:this.uid,
            status:this.status.join(","),
            keywords:this.keyknows
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid==200){
              this.infoList = d.data;
              this.ids = [];
              $("#checkAll").prop("checked",false);
              this.count = d.count;
              if(this.count <= 15){
                this.page = false;
              }else{
                this.page = true;
              }
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      addsuess(){
        this.getAllMyTask();
      },
      // 搜索
      search(){
        this.pageindex = 1;
        this.getAllMyTask();
      },
      // 预览弹窗
  	togglePreview(path,tname,rid,type,id){
            if(type == 2){
              this.isedit = true;
              this.tid = id;
            }else{
              this.isedit = false;
            }
            if(tname == "视频"){
              this.isvideo = true;
              this.mestitle = "视频"
            }else if(tname == "音频"){
              this.isvideo = false;
              this.mestitle = "音频"
            }
            this.rid = rid;
  		this.isPreview = true;
            $(".preview").css("display","block")
            this.getAudioinfo(rid);
            this.getCopyright(rid);
            this.getClasses();
            this.getAllSource();
  	},
      // 获取所有分类
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
      // 获取概要信息
      getAudioinfo(id){
          this.$http.get('/Resource/GetResourceDetails',{
            params:{
              id:id,
              uid:this.uid
            }
          }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
                if(d.msgid == 200){

                   this.taskinfo = d.data
                   this.profile =  this.taskinfo.resmsg;
                   if(this.profile.lname){
                      this.tipArr = this.profile.lname.split(",");
                  }else{
                      this.tipArr = this.profile.lname
                  }
                  var suffix=this.profile.file[0].suffix;
                  this.format=suffix.substr(1,suffix.length-1);
                  var md5 = this.profile.file[0].md5;
                  this.path = this.profile.file[0].path;
                  this.$http.get('/storage/getfilepath',{
                      params:{
                          fileid:md5
                      }
                  }).then(res=>{
                          var d=$.parseJSON(res.data);
                          if (d.msgid==200) {
                              if(d.data){
                                var json=JSON.parse(d.data); 
                                var addr=json.file_addr;                                          
                                console.log(addr)                                    
                                if (addr) {
                                   var  path=addr+'.json';
                                   var _this=this;
                                   $.getJSON(path,function(result){
                                        _this.durations=result.Duration;
                                   });
                                }
                              }
                          } 
                  });
                }
            }
          })
      },
      // 时间格式转换
      getTime(secord){
          var i=0,s=parseInt(secord);
          if(s>60){
              i=parseInt(s/60);
              s=parseInt(s%60);
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
          var time =  i + s;
          return time;
      },
      // 全选
      checkAll(){
          if($("#checkAll").prop("checked")){
              this.ids = [];
              for(var i = 0; i < this.infoList.length; i++){
                  this.ids.push(this.infoList[i].id)
              }                                    
          }else{
              this.ids = [];
          }
      },
      // 关闭对话框
      closeTip(){
        this.isShow = false;
        this.ids = [];
      },
      // 未选中任务下的弹出信息
      alertMessage(){
        this.isShowtip = true;
        this.mess = '未选中任何审核任务'
      },
      // 通过审核
      PassTask(){
        if(this.ids.length < 1){
          this.alertMessage();
        }else{
          this.isShow = true;
          this.type = 1;
          this.pass = 1;
          this.message = '您确认选中的视音频内容符合相关规范的要求，您确定通过？'
        }
      },
      // 驳回
      rejected(){
        if(this.ids.length < 1){
          this.alertMessage()
        }else{
          this.isShow = true;
          this.type = 2;
          this.pass = 0,
          this.message = '选中的视音频内容不符合相关规范的要求，您确定驳回吗？'
        }
      },
      // 删除
      deleteAll(){
        if(this.ids.length < 1){
          this.alertMessage();
        }else{
          this.isShow = true;
          this.type = 3;
          this.message = '您确定要删除选中的内容，删除后将无法恢复？'
        }
      },
      // 通过或驳回请求
      passRequest(){
        this.$http.post('task/PassTask',{
          tid:this.ids,
          pass:this.pass,
          type:0
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            this.isShow = false;
            this.ids = [];
            console.log(d)
            if(d.msgid == 200){
               this.isShowtip = true;
              if(d.data){              
                if(this.pass == 1){
                    this.mess = '任务通过成功'
                 }else if(this.pass == 0){
                    this.mess = '任务驳回成功'
                 }
                this.getAllMyTask();              
              }else{
                if(this.pass == 1){
                    this.mess = '任务通过失败'
                 }else if(this.pass == 0){
                    this.mess = '任务驳回失败'
                 } 
              }
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 单个通过
      passOne(id){
        this.ids = [];
        this.ids.push(id);
        this.isShow = true;
        this.type = 1;
        this.pass = 1;
        this.message = '您确认该视音频内容符合相关规范的要求，您确定通过？'
      },
      // 单个驳回
      rejectOne(id){
        this.ids = [];
        this.ids.push(id);
        this.isShow = true;
        this.type = 2;
        this.pass = 0,
        this.message = '该视音频内容不符合相关规范的要求，您确定驳回吗？'
      },
      // 单个删除
      toggleDel(id){
        this.ids = [];
        this.ids.push(id);
        this.isShow = true;
        this.type = 3;
        this.message = '您确定要删除该内容，删除后将无法恢复？'
      },
      // 设置启用或禁用
      enabletask(id,status,tname){
        this.ids = [];
        this.ids.push(id);
        this.type = 4;
        if(status == 5){
          this.enable = 1;
          this.isShow = true;
          this.message = '您确定将重新启用该'+tname+'，所有成员将可预览？'
        }else{
          this.enable = 0;
          this.isShow = true;
          this.message = '您确定禁用该'+tname+'，所有成员将无法预览该内容？'
        }
      },
      // 启用或禁用请求
      setEnable(){
        this.$http.post('task/EnableTask',{
          tid:this.ids[0],
          enable:this.enable,
          type:0
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            this.isShow = false;
            this.ids = [];
            if(d.msgid == 200){
              this.isShowtip = true;
              if(d.data){
                if(this.enable == 0){
                  this.mess = '禁用成功'
                }else if(this.enable == 1){
                  this.mess = '启用成功'
                }
                this.getAllMyTask();
              }else{
                if(this.enable == 0){
                  this.mess = '禁用失败'
                }else if(this.enable == 1){
                  this.mess = '启用失败'
                }
              }
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      // 删除任务请求
      deleteTask(){
        this.$http.post('task/DeleteAVTask',{
          tid:this.ids
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            this.isShow = false;
            this.ids = [];
            console.log(d )
            if(d.msgid == 200){            
               this.isShowtip = true;
              if(d.data){
                this.mess = '删除成功';
                this.pageindex = 1;
                this.currentPage = 1;
                this.getAllMyTask();
              }else{
                this.mess = '删除失败'
              }
            }else{
              console.log(d.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 对话框里的确定事件
      sureOperation(){
        if(this.type == 1 || this.type == 2){
          this.passRequest();
        }else if(this.type == 3){
          this.deleteTask();
        }else if(this.type == 4){
          this.setEnable();
        }
      },
      // 关闭预览
  	closeView(){
  		this.isPreview = false;
  	},
      // 关闭提示框
      close(){
            this.isShowtip = false;
      },
      // 跳页
      handleCurrentChange(val){
        this.pageindex = parseInt(val);
        $("#checkAll").prop("checked",false);
        this.ids=[];
        this.getAllMyTask();
      },
      toString(str){
        if(str){
          return str.replace('，', '、')
        }else{
          return '--'
        }
     },
  }
}
</script>

<style lang="scss">
	.videoaudit{
		width:100%;
		height:67em;
		padding:1em 3em 12em;
		background-color:#333;
            position:relative;
            .el-pagination{
              text-align:center;
              position:absolute;
              width:100%;
              bottom:2em;
            }
		.opera{
			width:100%;
			height:6em;
			background-color:#474747;
			border-radius:5px;	

			a{
           			    float:left;
           			    width:5em;
           			    height:2em;
           			    line-height:2em;
           			    background-color:#0099ff;
           			    text-align:center;
           			    color:#fff;
           			    margin-top:2em;
           			    margin-left:1em;
           			    text-decoration: none;
           			}

           			.check{
				float:right;
				width:25%;
				color:#0099ff;
				line-height:6em;

				label{
					margin-right:2em;
					font-weight:normal;
					font-size:1.1em;

					input{
						position:relative;
						top:2px;
					}
				}

           			}

           			.sear{
           			    width:30%;
           			    height:4em;
           			    float:right;
           			    background:url("../../assets/module/u2098serch.png") no-repeat;
           			    background-size:100% 100%;
           			    margin: 1em;
           			    input{
                              float:left;
                               width:75%;
                               background:#1c1f1f;
                               height:2.4em;
                               border-radius:5px;
                               margin-top:2%;
                               margin-left:2.5%;
                               padding-left:2%;
                           }
                          .searchbtn{
                            margin-top:2%;
                            width:20%;
                            height:2.4em;
                            float:left;
                            line-height:2.4em;
                            font-size:1.2em;
                            background:url("../../assets/module/u2100.png") no-repeat 15%;
                            background-size:40%;
                            padding-left:10%;
                            font-size:1em;
                            color:#0099ff;
                            cursor:pointer;
                          }
           			}	
		}
	}
</style>