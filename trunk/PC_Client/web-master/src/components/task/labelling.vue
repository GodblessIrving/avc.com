<template>
  <div class="labelling">
      <div class="opera">
      	<a href="javascript:void(0)" @click="PassTask">通过</a>
            <a href="javascript:void(0)" @click="rejected()">驳回</a>
            <a href="javascript:void(0)" @click="deleteAll()">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索标注视音频名称" v-model="keyknows">
                <span class='searchbtn' @click="searchList">搜索</span>
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
                        <th width="5"><label for="" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="15">标注音视频名称</th>
                        <th width="10">类型</th>
                        <th width="10">分类</th>
                        <th width="10">标注数量</th>
                        <th width="15">提交时间</th>
                        <th width="5">提交人</th>
                        <th width="10">状态</th>
                        <th width="20">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in infoList">
                        <td><input type="checkbox" :value="i.id" v-model="ids"></td>
                        <td :title="i.title">{{i.title}}</td>
                        <td :title="i.tname">{{i.tname}}</td>
                        <td :title="i.cname">{{i.cname}}</td>
                        <td :title="i.count">{{i.count}}</td>
                        <td :title="i.subtime">{{i.subtime}}</td>
                        <td :title="i.submitter">{{i.submitter}}</td>
                        <td v-if="i.status == 2">待审核</td>
                        <td v-if="i.status == 2">
                            <a href="javascript:void(0)" @click="openPreview(i.id,i.tname,i.rid)">预览</a>
                            <a href="javascript:void(0)" @click="passOne(i.id)">通过</a>
                            <a href="javascript:void(0)" @click="rejectOne(i.id)">驳回</a>
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                        <td class="green" v-if="i.status == 3">已审核</td>
                        <td v-if="i.status == 3">
                            <a href="javascript:void(0)" @click="openPreview(i.id,i.tname,i.rid)">预览</a>
                            <a href="javascript:void(0)" @click="enabletask(i.id,i.status)">禁用</a>
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                        <td class="red" v-if ="i.status == 4">驳回</td>
                        <td v-if="i.status == 4">
                            <a href="javascript:void(0)" @click="openPreview(i.id,i.tname,i.rid)">预览</a>
                            <a href="javascript:void(0)" @click="toggleDel(i.id);">删除</a>
                        </td>
                        <td class="red" v-if ="i.status == 5">禁用</td>
                        <td v-if="i.status == 5">
                            <a href="javascript:void(0)" @click="openPreview(i.id,i.tname,i.rid)">预览</a>
                            <a href="javascript:void(0)" @click="enabletask(i.id,i.status)">启用</a>
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
        <mark-preview 
            :isPreview="isPreview" 
            :isvideo="isvideo"
            :markinfo = 'markinfo'
            :uid="uid"
            :rid="rid"
            @closeNewEvent="close()">
        </mark-preview>
        <common-tip 
            :isShow="isShow"
            :message="message"
            @delObjEvent = "sureOperation"
            @closeTipEvent="closeTip">
        </common-tip>
        <alert-tip 
          :isShowtip="isShowtip"
          :message="mess"
          @closeTipEvent="closeAlert">
        </alert-tip>
  </div>
</template>
<script>
import MarkPreview from "./MarkPreview"
import CommonTip from "../CommonTip"
import alertTip from "../alertTip"
export default {
  name: 'labelling',
  data(){
    return{
      isPreview:false,
      keyknows:'',
      status:[],
      page:true,
      currentPage:1,
      pagesize:15,
      pageindex:1,
      infoList:[],
      count:0,
      ids:[],
      isShow:false,
      message:'',
      isShowtip:false,
      mess:'',
      type:0,
      pass:0,
      isvideo:false,
      markinfo:[],
      rid:0,
    }
  },
  components:{MarkPreview,CommonTip,alertTip},
  watch:{
    status:function(){
      this.getMyMarkTask();
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
    this.getMyMarkTask();
  },
  computed:{
      uid:function(){
          return this.$store.state.user.uid;
      }
  },
  methods:{
      // 获取标注任务列表
      getMyMarkTask(){
        this.$http.get('task/GetMyMarkTask',{
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
      // 搜索
      searchList(){
      this.pageindex = 1;
      this.getMyMarkTask();
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
      // 关闭弹窗
      closeAlert(){
      this.isShowtip = false;
    },
      // 关闭对话框
      closeTip(){
      this.isShow = false;
      this.ids = [];
    },
      // 未选中任务下的弹出信息
    alertMessage(){
      this.isShowtip = true;
      this.mess = '未选中任何审核任务';
    },
      // 批量通过审核
      PassTask(){
      if(this.ids.length < 1){
        this.alertMessage();
      }else{
        this.isShow = true;
        this.type = 1;
        this.pass = 1;
        this.message = '您确认选中的视音频的标注内容符合相关规范的要求，您确定通过？'
      }
    },
      // 批量驳回
      rejected(){
        if(this.ids.length < 1){
          this.alertMessage()
        }else{
          this.isShow = true;
          this.type = 2;
          this.pass = 0,
          this.message = '选中的视音频标注内容不符合相关规范的要求，您确定驳回吗？'
        }
      },
      // 批量删除
      deleteAll(){
        if(this.ids.length < 1){
          this.alertMessage();
        }else{
          this.isShow = true;
          this.type = 3;
          this.message = '您确定要删除选中的标注信息，删除后将无法恢复？'
        }
      },
      // 单个通过
      passOne(id){
        this.ids = [];
        this.ids.push(id);
        this.isShow = true;
        this.type = 1;
        this.pass = 1;
        this.message = '您确认该视音频标注内容符合相关规范的要求，您确定通过？'
      },
      // 单个驳回
      rejectOne(id){
        this.ids = [];
        this.ids.push(id);
        this.isShow = true;
        this.type = 2;
        this.pass = 0,
        this.message = '该视音频标注内容不符合相关规范的要求，您确定驳回吗？'
      },
      // 单个删除
      toggleDel(id){
        this.ids = [];
        this.ids.push(id);
        this.isShow = true;
        this.type = 3;
        this.message = '您确定要删除该内容的标注信息，删除后将无法恢复？'
      },
      // 设置启用或禁用
      enabletask(id,status){
        this.ids = [];
        this.ids.push(id);
        this.type = 4;
        if(status == 5){
          this.enable = 1;
          this.isShow = true;
          this.message = '您确定将重新启用该视（音）频的标注信息，所有成员将可预览？'
        }else{
          this.enable = 0;
          this.isShow = true;
          this.message = '您确定禁用该该视（音）频的标注信息，所有成员将无法预览该内容？'
        }
      },
      // 通过或驳回请求
      passRequest(){
        this.$http.post('task/PassTask',{
          tid:this.ids,
          pass:this.pass,
          type:1
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
                this.getMyMarkTask();           
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
      // 删除请求
      deleteTask(){
        this.$http.post('task/DeleteMarkTask',{
          tid:this.ids
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            this.isShow = false;
            this.ids = [];
            this.isShowtip = true;
            if(d.msgid == 200){            
              if(d.data){
                this.mess = '删除成功';
                this.pageindex = 1;
                this.currentPage = 1;
                this.getMyMarkTask();
              }else{
                this.mess = '删除失败'
              }
            }else{
              console.log(d.msg);
               this.mess = '删除失败'
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 启用或禁用请求
      setEnable(){
        this.$http.post('task/EnableTask',{
          tid:this.ids[0],
          enable:this.enable,
          type:1
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            this.isShow = false;
            this.ids = [];
            console.log(d)
            if(d.msgid == 200){
              this.isShowtip = true;
              if(d.data){
                if(this.enable == 0){
                  this.mess = '禁用成功'
                }else if(this.enable == 1){
                  this.mess = '启用成功'
                }
                this.getMyMarkTask();
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
      // 对话框确定事件
      sureOperation(){
          if(this.type == 1 || this.type == 2){
            this.passRequest();
          }else if(this.type == 3){
            this.deleteTask();
          }else if(this.type == 4){
          this.setEnable();
        } 
      },
      // 打开预览
      openPreview(id,tname,rid){       
            if(tname == "视频"){
              this.isvideo = true;
            }else if(tname == "音频"){
              this.isvideo = false;
            }
            this.rid = rid;
            this.isPreview = true;
            this.getPreviewMark(id);
      },
      // 获取标注预览
      getPreviewMark(id){
        this.$http.get('task/PreviewMarks',{
          params:{
            tid:id
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid==200){
              this.markinfo = d.data;
              console.log(this.markinfo)
            }
          }
        })
      },
      // 关闭预览
      close(){
        this.isPreview = false;
      },
      // 分页点击
      handleCurrentChange(val){
        this.pageindex = parseInt(val);
        this.ids=[];
        $("#checkAll").prop("checked",false);
        this.getMyMarkTask();
      },
  }
}
</script>

<style lang="scss">
	.labelling{
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
            .el-pagination .btn-next,.el-pagination .btn-prev{
              padding:0 0.5em !important;
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