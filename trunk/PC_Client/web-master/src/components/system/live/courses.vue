<template>
    <div class="live-coursess">
        <div class="operation">
            <a href="javascript:void(0)" @click="openNew(0)">创建课程</a>
            <a href="javascript:void(0)" @click="openDel(0)">删除</a>
            <a href="javascript:void(0)" @click="openGet()">获取课程</a>
            <p class="sear">
                <input type="text" placeholder="搜索直播课程名称" v-model="name">
                <span class='searchbtn' @click="search">搜索</span>
             </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="" style="margin-bottom:0">
                        <input type="checkbox" @click="checkAll" v-model="allchecked">All</label></th>
                        <th width="10">课程ID</th>
                        <th width="10">课程名称</th>
                        <th width="10">开课学院</th>
                        <th width="10">授课老师</th>
                        <th width="10">职称</th>
                        <th width="10">类型</th>
                        <th width="8">状态</th>
                        <th width="22">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>K73641</td>
                        <td>计算机通讯原理与应用</td>
                        <td>计算机学院</td>
                        <td>李学东</td>
                        <td>副教书</td>
                        <td>自定义</td>
                        <td class="green">启用</td>
                        <td>
                            <a href="javascript:void(0)" >更新</a>
                            <a href="javascript:void(0)" @click="openConfig(1)">配置</a>
                            <a href="javascript:void(0)" @click="openNew(1)">编辑</a>
                            <a href="javascript:void(0)" @click="openDel(1)">删除</a>
                        </td>
                    </tr>
                    <tr v-for="c in courses" v-if="courses">
                      <td><input type="checkbox" :value="c.id" v-model="ids"></td>
                        <td>{{c.courseid}}</td>
                        <td>{{c.coursename}}</td>
                        <td>{{c.college}}</td>
                        <td>{{c.teacher}}</td>
                        <td>{{c.jname}}</td>
                        <td>{{c.type?'课表':'自定义'}}</td>
                        <td :class="[c.enable?'green':'red']">{{c.enable?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" v-if="c.type" @click="freshCourse">更新</a>
                            <a href="javascript:void(0)" @click="openConfig(c.id)">配置</a>
                            <a href="javascript:void(0)" @click="openNew(c.id)">编辑</a>
                            <a href="javascript:void(0)" @click="openDel(c.id)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip :isShow="showDel" :message="message" @delObjEvent="delCourse" 
        @closeTipEvent="closeDel"></common-tip>
        <new-courses :show="showNew" :editmodel="editInfo" @closeEvent="closeNew" 
        @saveEvent="saveCourse"></new-courses>
        <get-courses :isGet="isGet" @closeEvent="closeGet" @saveEvent="saveCourseSettings"></get-courses>
        <config :isConfig="isConfig" :configs="configs" @closeEvent="closeConfig" @saveEvent="saveConfig"></config>
        <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
      </alert-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip"
    import NewCourses from "./NewCourses"
    import GetCourses from "./GetCourses"
    import config from "./config"
    import alertTip from '../../alertTip'
    export default{
        data () {
             return {
                //搜索相关
                pagesize:25,
                pageindex:1,
                name:'',//搜索框值；
                //数据
                courses:[],
                ids:[],
                id:0,
                allchecked:false,
                //新建/编辑
                editInfo:{},
                optype:0,//0新建,1编辑,2单删,3多删
                showNew:false,
                //删除
                showDel:false,
                message:"您确定删除该课程?",
                //获取课程
                isGet:false,
                //配置
                isConfig:false,
                configs:[],
                //提醒
                emsg:'该页面功能正在开发中',
                isError:true,
             };
         },
        name:"live-coursess",
        components:{CommonTip,NewCourses,GetCourses,config,alertTip},
        watch:{
             'ids':{
                handler:function(val,oldVal){
                    if (this.ids.length==this.courses.length) {
                        this.allchecked=true;
                    }else{
                        this.allchecked=false;
                    }
                },
                deep:true
            }
        },
        mounted:function(){
            this.getCourses();
        },
        methods: {
            //region 逻辑；
             openNew(e){
                this.id=e;
                if (e>0) {
                    this.getCourseById();
                    this.optype=1;
                }else{
                    this.editInfo={};
                    this.optype=0;
                }
                this.showNew = true;
             },
             search(){
                this.pageindex = 1;
                this.getCourses();
             },
             closeNew(){
                this.showNew = false;
             },//全选
             checkAll(){
                var _this=this;
                if(this.allchecked){
                    _this.ids=[];
                }else{
                    _this.ids=[];
                    _this.courses.forEach(function(item){
                        _this.ids.push(item.id);
                    });
                }
             },
              openDel (e) {
                if (e==0) {//0表示删除多个
                    this.message="您确定要删除这些课程?";
                    this.optype=3;
                }else{
                    this.message="您确定要删除该课程?";
                    this.id=e;
                    this.optype=2;
                }
                 this.showDel = true;
             },
             closeDel(){
                this.showDel = false;
             },
             openGet(){
                this.isGet = true;
             },
             closeGet(){
                this.isGet = false;
             },
             openConfig(e){
                this.id=e;
                this.getConfigs();
                this.isConfig = true;
             },
             closeConfig(){
                this.isConfig  = false;
             },
             //region数据库操作
             getCourses(){
                this.$http.get('/SystemManage/GetLiveCourses',{
                    params:{
                        pagesize:this.pagesize,
                        pageindex:this.pageindex,
                        name:this.name
                    }
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    //console.log(d);
                    if (d) {
                        if (d.msgid==200) {
                            this.courses=d.data;
                        }else{
                            this.emsg=d.msg;
                            this.isError=true;
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                });
             },
             getCourseById(){
                this.$http.get('/SystemManage/GetLiveCourseById',{
                    params:{
                        id:this.id
                    }
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    console.log(d);
                    if (d) {
                        if (d.msgid==200) {
                            //更新editinfo;
                            this.editInfo=d.data;
                        }else{
                            this.editInfo={};
                            console.log(d.msg);
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                });
             },
             saveCourse(cid,name,college,teacher,jid){
                this.$http.post('/SystemManage/saveLiveCourse',{
                    id:this.id,
                    courseid:cid,
                    coursename:name,
                    college:college,
                    teacher:teacher,
                    jid:jid
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    console.log(d);
                    if (d) {
                        if (d.msgid==200) {
                            if (this.id==0) {
                                this.emsg='添加成功';
                            }else{
                                this.emsg='修改成功';
                            }
                            this.showNew=false;
                            this.isError=true;
                            this.getCourses();
                        }else{
                            console.log(d.msg);
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                });
             },
             delCourse(){
                var parms=[];
                if (this.optype==2) {
                    parms.push(this.id);
                }else if(this.optype==3){
                    parms=ids;
                }
                this.$http.post('/SystemManage/deleteLiveCourse',{
                    ids:parms
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    //console.log(d);
                    if (d) {
                        if (d.msgid==200) {
                            this.showDel=false;
                            this.emsg='删除成功';
                            this.isError=true;
                            this.getCourses();
                        }else{
                            this.emsg=d.msg;
                            this.isError=true;
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                });
             },
             saveCourseSettings(courseid,apiUrl,starttime,endtime,settime){
                //暂无接口
                // this.$http.post('/SystemManage/saveCourseSettings',{
                //     courseid:courseid,
                //     apiurl:apiUrl,
                //     starttime:starttime,
                //     endtime:endtime,
                //     settime:settime
                // }).then(res=>{
                //     var d=$.parseJSON(res.data);
                //     //console.log(d);
                //     if (d) {
                //         if (d.msgid==200) {
                //             this.emsg='保存成功';
                //         }else{
                //             this.emsg=d.msg;
                //         }
                //         this.isError=true;
                //     }
                // }).catch(err=>{
                //     console.log(err);
                // });
             },
             saveConfig(config){
                //暂无接口
                // this.$http.post('/SystemManage/saveLiveCourse',{
                //     id:this.id,
                //     config:config
                // }).then(res=>{
                //     var d=$.parseJSON(res.data);
                //     //console.log(d);
                //     if (d) {
                //         if (d.msgid==200) {
                //             this.emsg='保存成功';
                //         }else{
                //             this.emsg=d.msg;
                //         }
                //         this.isError=true;
                //     }
                // }).catch(err=>{
                //     console.log(err);
                // });
             },
             getConfigs(){
                //暂无接口
                // this.$http.get('/SystemManage/GetLiveCourseById',{
                //     params:{
                //         id:this.id
                //     }
                // }).then(res=>{
                //     var d=$.parseJSON(res.data);
                //     //console.log(d);
                //     if (d) {
                //         if (d.msgid==200) {
                //           var  info=d.data;
                //           if (info&&info.config) {
                //               this.configs=info.config;
                //           }
                //         }else{
                //             console.log(d.msg);
                //         }
                //     }
                // }).catch(err=>{
                //     console.log(err);
                // });
             }
             //endregion 数据库操作；
         }
    }
</script>
<style lang="scss">
.live-coursess{
        .operation{
            width:100%;
            padding:1em;
            overflow:hidden;

            a{
                float:left;
                width:5em;
                height:2em;
                line-height:2em;
                background-color:#0099ff;
                text-align:center;
                color:#fff;
                margin-top:1em;
                margin-left:1em;
                text-decoration: none;
            }
        }
        .excel{
          height:63em;
          overflow-y:auto;
        }
    }
</style>