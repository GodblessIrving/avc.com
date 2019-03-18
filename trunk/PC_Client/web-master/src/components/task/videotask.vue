<template>
  <div class="videotask">
      <div class="opera">
            <a href="javascript:void(0)" @click="toggleNew">分配</a>
            <select name="" id="" v-model="type">
                <option value="0">请选择类型</option>
                <option value="2">音频</option>
                <option value="1">视频</option>
            </select>
             <select name="" id="" v-model="clas">
                <option value="0">请选择分类</option>
                <option v-for="c in classList" :value="c.id">{{c.name}}</option>
            </select>
             <select name="" id="" v-model="source">
                <option value="0">请选择来源</option>
                <option v-for="s in sourceList" :value="s.id">{{s.name}}</option>
            </select>
            <p class="sear">
                <input type="text" placeholder="搜索视音频审核名称" v-model="keyknows">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
            <p class="check">
                <label for="input1"><input type="checkbox" id="input1" value="1" v-model="status">待分配</label>
                <label for="input2"><input type="checkbox" id="input2" value="2" v-model="status">已分配</label>
            </p>
      </div>
      <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th>名称</th>
                        <th>类型</th>
                        <th>分类</th>
                        <th>来源</th>
                        <th>标签</th>
                        <th>操作时间</th>
                        <th>提交人</th>
                        <th>审核人</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in avInfo">
                        <td><input type="checkbox" :value="a.id" v-model="ids"></td>
                        <td :title="a.title">{{a.title}}</td>
                        <td :title="a.tname">{{a.tname}}</td>
                        <td :title="a.cname">{{a.cname}}</td>
                        <td :title="a.sname">{{a.sname}}</td>
                        <td :title="toString(a.label)">{{toString(a.label)}}</td>
                        <td :title="a.opreattime">{{a.opreattime}}</td>
                        <td :title="a.submitter">{{a.submitter}}</td>
                        <td :title="a.examiner?a.examiner:'--'">{{a.examiner?a.examiner:'--'}}</td>
                        <td v-if='a.status == 1'>待分配</td>
                        <td v-if='a.status == 1'>
                            <a href="javascript:void(0)" @click="togglePreview(a.tname,a.rid)">预览</a>
                            <a href="javascript:void(0)" @click="toggleOne(a)">分配</a>
                        </td>
                        <td class="green" v-if="a.status == 2">已分配</td>
                        <td v-if="a.status == 2">
                            <a href="javascript:void(0)" @click="togglePreview(a.tname,a.rid)">预览</a>
                            <a href="javascript:void(0)" @click="toggleOne(a)">分配</a>
                        </td>
                        <td class="green" v-if="a.status == 3">已审核</td>
                        <td v-if="a.status == 3"> 
                            <a href="javascript:void(0)" @click="togglePreview(a.tname,a.rid)">预览</a>
                        </td>
                        <td class="red" v-if="a.status == 4">驳回</td>
                        <td v-if="a.status == 4">
                            <a href="javascript:void(0)" @click="togglePreview(a.tname,a.rid)">预览</a>
                        </td>
                        <td class="red" v-if="a.status == 5">禁用</td>
                        <td v-if="a.status == 5">
                            <a href="javascript:void(0)" @click="togglePreview(a.tname,a.rid)">预览</a>
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
        <preview 
            :isPreview="isPreview" 
            :isView="isView" 
            :path="path"
            :isvideo="isvideo"
            :profile="profile"
            :tipArr="tipArr"
            :mestitle="mestitle"
            :copyright= "copyright"
            :duration='getTime(durations)'
            :format = "format"
            :isedit = "isedit"
            :uid="uid"
            :rid="rid"
            :classList="classList"
            @closeNewEvent="closeView()">
        </preview>
        <distribution 
            :isNew="isNew" 
            :title="title"
            :restitle="restitle"
            :typename="typename"
            :examinerArr="examinerArr"
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
import preview from "./preview"
import distribution from "./distribution"
import alertTip from "../alertTip"
export default {
  name: 'videotask',
  data(){
    return{
      isPreview:false,
      isNew:false,
      isView:true,
      keyknows:'',
      currentPage:1,
      count:0,
      page:true,
      classList:[],
      sourceList:[],
      status:[],
      type:0,
      clas:0,
      source:0,
      pagesize:15,
      pageindex:1,
      avInfo:[],
      path:'',
      isedit:false,
      mestitle:'',
      isvideo:true,
      taskinfo:[],
      profile:[],
      tipArr:[],
      format:'',
      durations:'',
      copyright:[],
      ids:[],
      isShowtip:false,
      message:'',
      title:'',
      typename:'',
      tname:[],
      titleArr:[],
      keyname:'',
      totask:0,
      alltask:0,
      endtime:0,
      examinerArr:[],
      restitle:'视音频审核任务分配',
      rid:0,
    }
  },
  watch:{
    status:function(){
      this.getAVTask();
    },
    type:function(){
      this.getAVTask();
    },
    clas:function(){
      this.getAVTask();
    },
    source:function(){
      this.getAVTask();
    },
    ids:function(){
      if(this.ids.length < this.avInfo.length){
        $("#checkAll").prop("checked",false);
      }else if(this.ids.length > 0&&this.ids.length == this.avInfo.length){
        $("#checkAll").prop("checked",true);
      }
    }
  },
 components:{preview,distribution,alertTip},
 mounted:function(){
  this.getClasses();
  this.getAllSource();
  this.getAVTask();
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
      // 获取视音频审核任务
      getAVTask(){
        this.$http.get('task/GetAVTask',{
          params:{
            pagesize:this.pagesize,
            pageindex:this.pageindex,
            type:parseInt(this.type),
            class:parseInt(this.clas),
            source:parseInt(this.source),
            status:this.status.join(","),
            keywords:this.keyknows
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              this.count = d.count;
              if(d.count <= 15){
                this.page = false;
              }else{
                this.page = true;
              }
              this.avInfo = d.data;
              this.ids = [];
              $("#checkAll").prop("checked",false);
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
        this.getAVTask();
      },
      // 预览
      togglePreview(path,tname,rid){
        this.isPreview = true;
        this.rid = rid;
        if(tname == "视频"){
          this.isvideo = true;
          this.mestitle = "视频"
        }else if(tname == "音频"){
          this.isvideo = false;
          this.mestitle = "音频"
        }
        this.getAudioinfo(rid);
        this.getCopyright(rid)
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
                }else{
                  console.log(d.msg)
                }
            }
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
      // 转换时间格式
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
              for(var i = 0; i < this.avInfo.length; i++){
                  this.ids.push(this.avInfo[i].id)
              }                                    
          }else{
              this.ids = [];
          }
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
          for(var i = 0; i < this.avInfo.length; i++){
            for(var j = 0; j < this.ids.length; j++){
              if(this.avInfo[i].id == this.ids[j]){
                this.titleArr.push(this.avInfo[i].title);
                this.tname.push(this.avInfo[i].tname);
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
        this.ids.push(a.id);
        this.title = a.title;
        this.typename = a.tname;
        this.getExaminer();
      },
      // 获取所有审核人
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
      //关闭分配
      closeNew(){
        this.isNew = false;
        this.ids = [];
        this.titleArr = [];
        this.tname=[];
      },
      // 分页
      handleCurrentChange(val){
        this.pageindex = parseInt(val);
        $("#checkAll").prop("checked",false);
        this.ids=[];
        this.getAVTask();
      },
      toString(str){
        if(str){
          return str.replace('，', '、')
        }else{
          return '--'
        }
     },
     closetip(){
      this.isShowtip = false;
     },
     saveEmit(val){
        if(!val){
          this.isShowtip = true;
          this.message = "未选中任何审核人"
        }else{
          this.$http.post('task/AllocatingTasks',{
            id:this.ids,
            uid:val,
            type:0,
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
                  this.getAVTask();
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
  .videotask{
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