<template>
  <div class="marktask">
      <div class="opera">
            <a href="javascript:void(0)" @click="toggleNew()">分配</a>
            <select name="" id="" v-model="type">
                <option value="0">请选择类型</option>
                <option value="2">音频</option>
                <option value="1">视频</option>
            </select>
             <select name="" id="" v-model="clas">
                <option value="0">请选择分类</option>
                <option v-for="c in classList" :value="c.id">{{c.name}}</option>
            </select>
            <p class="sear">
                <input type="text" placeholder="搜索标注视音频名称" v-model="keyknows">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
            <p class="check">
                <label for="input1"><input type="checkbox" value="1" id="input1" v-model="status">待分配</label>
                <label for="input2"><input type="checkbox" value="2" id="input2" v-model="status">已分配</label>
            </p>
      </div>
      <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th ><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th >名称</th>
                        <th >类型</th>
                        <th>分类</th>
                        <th >标注数量</th>
                        <th >操作时间</th>
                        <th>提交人</th>
                        <th>审核人</th>
                        <th >状态</th>
                        <th >操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in tasklist">
                        <td><input type="checkbox" :value="t.id" v-model="ids"></td>
                        <td :title="t.title">{{t.title}}</td>
                        <td :title="t.tname">{{t.tname}}</td>
                        <td :title="t.cname">{{t.cname}}</td>
                        <td :title="t.count">{{t.count}}</td>
                        <td :title="t.opreattime">{{t.opreattime}}</td>
                        <td :title="t.submitter">{{t.submitter}}</td>
                        <td :title="t.examiner?t.examiner:'--'">{{t.examiner?t.examiner:'--'}}</td>
                        <td v-if="t.status==1">待分配</td>
                        <td v-if="t.status==1">
                            <a href="javascript:void(0)" @click="togglePreview(t.id,t.tname,t.rid)">预览</a>
                            <a href="javascript:void(0)" @click="toggleOne(t)">分配</a>
                        </td>
                        <td class="green" v-if="t.status==2">已分配</td>
                        <td v-if="t.status==2">
                            <a href="javascript:void(0)" @click="togglePreview(t.id,t.tname,t.rid)">预览</a>
                            <a href="javascript:void(0)" @click="toggleOne(t)">分配</a>
                        </td>
                        <td class="green" v-if="t.status==3">已审核</td>
                        <td v-if="t.status==3">
                            <a href="javascript:void(0)" @click="togglePreview(t.id,t.tname,t.rid)">预览</a>
                        </td>
                        <td class="red" v-if="t.status==4">驳回</td>
                        <td v-if="t.status==4">
                            <a href="javascript:void(0)" @click="togglePreview(t.id,t.tname,t.rid)">预览</a>
                        </td>
                        <td class="red" v-if="t.status==5">禁用</td>
                        <td v-if="t.status==5">
                            <a href="javascript:void(0)" @click="togglePreview(t.id,t.tname,t.rid)">预览</a>
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
          :markinfo = "markinfo"
          :uid="uid"
          :rid="rid"
          @closeNewEvent="closeView()">
        </mark-preview>
        <distribution 
          :isNew="isNew" 
          :examinerArr="examinerArr"
          :title="title"
          :restitle="restitle"
          :typename="typename"
          @saveNewEvent="saveEmit"
          @closeNewEvent="closeNew()">
        </distribution>
        <alert-tip 
          :isShowtip="isShowtip"
          :message="message"
          @closeTipEvent="closetip"></alert-tip>
  </div>
</template>

<script>
import markPreview from "./MarkPreview.vue"
import distribution from "./distribution"
import alertTip from "../alertTip"
export default {
  name: 'marktask',
  data(){
    return{
      isPreview:false,
      isNew:false,
      isView:true,
      keyknows:'',
      status:'',
      type:0,
      clas:0,
      page:true,
      count:0,
      currentPage:1,
      classList:[],
      status:[],
      pagesize:15,
      pageindex:1,
      tasklist:[],
      ids:[],
      markinfo:[],
      isvideo:false,
      isShowtip:false,
      message:'',
      examinerArr:[],
      titleArr:[],
      tname:[],
      keyname:'',
      totask:0,
      alltask:0,
      endtime:0,
      title:'',
      typename:'',
      rid:0,
      restitle:'视音频标注审核任务分配'
    }
  },
 components:{markPreview,distribution,alertTip},
 watch:{
  type:function(){
    this.getMarkTask();
  },
  clas:function(){
    this.getMarkTask();
  },
  status:function(){
    this.getMarkTask();
  },
  ids:function(){
      if(this.ids.length < this.tasklist.length||this.ids.length==0){
        $("#checkAll").prop("checked",false);
      }else if(this.ids.length > 0&&this.ids.length == this.tasklist.length){
        $("#checkAll").prop("checked",true);
      }
    }
 },
 mounted:function(){
  this.getClasses();
  this.getMarkTask();
 },
 computed:{
          uid:function(){
              return this.$store.state.user.uid;
          }
  },
  methods:{
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
    // 获取任务总数
    getMarkTask(){
      this.$http.get('task/GetMarkTask',{
        params:{
          pagesize:this.pagesize,
          pageindex:this.pageindex,
          type:parseInt(this.type),
          class:parseInt(this.clas),
          keywords:this.keyknows,
          status:this.status.join(",")
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.tasklist = d.data;
            this.ids = [];
            $("#checkAll").prop("checked",false);
            this.count = d.count;
            if(d.count <= 15){
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
    search(){
      this.pageindex = 1;
      this.getMarkTask()
    },
    // 全选
    checkAll(){
        if($("#checkAll").prop("checked")){
            this.ids = [];
            for(var i = 0; i < this.tasklist.length; i++){
                this.ids.push(this.tasklist[i].id)
            }                                    
        }else{
            this.ids = [];
        }
    },
    // 预览
    togglePreview(id,tname,rid){
          if(tname == "视频"){
              this.isvideo = true;
            }else if(tname == "音频"){
              this.isvideo = false;
            }
            this.isPreview = true;
            this.rid = rid;
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
          }
        }
      })
    },
    // 关闭预览
    closeView(){
      this.isPreview = false;
    },
    // 分配
    toggleNew(){
        if(this.ids.length < 1){
          this.isShowtip = true;
          this.message="未选中任何审核任务"
        }else{
          this.isNew = true;
        }
        for(var i = 0; i < this.tasklist.length; i++){
          for(var j = 0; j < this.ids.length; j++){
            if(this.tasklist[i].id == this.ids[j]){
              this.titleArr.push(this.tasklist[i].title);
              this.tname.push(this.tasklist[i].tname);
            }
          }
        }
        this.title = this.titleArr.join(",");
        this.tname = this.unique(this.tname);
        this.typename = this.tname.join(",");
        this.getExaminer();
    },
    // 数组去重
    unique(arr){
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    },
    // 单个分配
    toggleOne(a){
      this.ids = [];
      this.isNew = true;
      this.title = a.title;
      this.ids.push(a.id);
      this.typename = a.tname;
      this.getExaminer();
    },
    // 获取审核人列表
    getExaminer(){
      this.$http.get('task/GetExaminer',{
        params:{
            name:this.keyname,
            totask:this.totask,
            alltask:this.alltask,
            endtime:this.endtime
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.examinerArr = d.data;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 关闭分配
    closeNew(){
      this.isNew = false;
      this.ids = [];
      this.titleArr = [];
      this.tname=[];
    },
    // 分页
    handleCurrentChange(val){
      this.pageindex = parseInt(val);
      this.ids=[];
      $("#checkAll").prop("checked",false);
      this.getMarkTask()
    },
    closetip(){
      this.isShowtip=false;
    },
    saveEmit(val){
        if(!val){
          this.isShowtip = true;
          this.message = "未选中任何审核人"
        }else{
          this.$http.post('task/AllocatingTasks',{
            id:this.ids,
            uid:val,
            type:1
          }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
              this.isNew = false;
              this.ids = [];
              this.titleArr = [];
              this.tname=[];
              if(d.msgid == 200){
                if(d.data){
                  this.isShowtip = true;
                  this.message = "任务分配成功";
                  this.getMarkTask();
                }else{
                  this.isShowtip = true;
                  this.message = "任务分配失败";
                }
              }else{
                console.log(d.msg)
              }
            }
          }).catch(err=>{
            console.log(err)
          })
        }
     }
  }
}
</script>

<style lang="scss">
  .marktask{
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
                select{
                  color:#333;
                  height:2em;
                  margin-top:2em;
                  margin-left:1em;
                  width:9%;
                }

                .check{
                          float:right;
                          width:17%;
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