<template>
    <div class="user-r">
        <h1>用户管理</h1>
        <div class="operation">
            <a href="javascript:void(0)" @click="addUser()">新建用户</a>
            <a href="javascript:void(0)" @click="delUsers">删除</a>
             <p class="sear">
                <input type="text" placeholder="搜索用户名称" v-model="keyname">
                <span class='searchbtn' @click="search">搜索</span>
             </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="" style="margin-bottom:0"><input type="checkbox" @click="checkAll" id="checkAll">All</label></th>
                        <th width="5">用户名</th>
                        <th width="10">真实姓名</th>
                        <th width="10">用户角色</th>
                        <th width="15">教职工/学生ID</th>
                        <th width="5">职称</th>
                        <th width="10">职务</th>
                        <th width="15">所属部门/班级</th>
                        <th width="5">状态</th>
                        <th width="20">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in userlist">
                        <td><input type="checkbox" :value="item.id" v-model="ids"></td>
                        <td :title="item.username">{{item.username}}</td>
                        <td :title="item.realname">{{item.realname}}</td>
                        <td :title="item.rname">{{item.rname}}</td>
                        <td :title="item.number">{{item.number}}</td>
                        <td :title="item.jname">{{item.jname}}</td>
                        <td :title="item.pname">{{item.pname}}</td>
                        <td :title="item.dname">{{item.dname}}</td>
                        <td v-if="item.id==1" class="gray">默认</td>
                        <td v-else :class="[item.enable?'green':'red']">{{item.enable?'启用':'禁用'}}</td>
                        <td>
                            <template v-if="item.id>1">
                              <a href="javascript:void(0)" @click="resetPwd(item)" style="width:5em;">重置密码</a>
                              <a href="javascript:void(0)" @click="addUser(item);">编辑</a>
                              <a href="javascript:void(0)" @click="delUser(item);">删除</a>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <new-user :isNew="isNew" :frmtitle="frmtitle" :uid="uid" @closeNewEvent="closeNewUser"  
        @saveUserEvent="saveUser" @invalidImgEvent="invalidImg"></new-user>
        <common-tip :isShow="ShowDelTip" :message="message" @delObjEvent="deleteUser" @closeTipEvent="closeDelTip" :dangerous="dangerous"></common-tip>
        <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'closeMsgTip'>
      </alert-tip>
      <reset :isOpen="reset" :userId="uid" @closeEvent="reset=false;" @saveEvent="saveReset"></reset>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageindex"
          :page-size="pagesize"
          layout="prev, pager, next"
          :total="count"
          v-if="count>pagesize"
          >
      </el-pagination>
    </div>
</template>

<script type="text/ecmascript-6">
    import NewUser from "./NewUser"
    import CommonTip from "../../CommonTip"
    import alertTip from '../../alertTip'
    import reset from './userRest.vue'
    export default{
        data () {
             return {
                //列表数据
                userlist:[],
                pagesize:19,
                pageindex:1,
                count:0,
                ids:[],
                keyname:"",//搜索关键字,
                //新增/编辑
                uid:0,
                isNew:false,
                optype:0,//0表示新增，1表示修改
                frmtitle:"",
                //消息提示
                emsg:'',
                isError:false,
                //删除
                ShowDelTip:false,
                message:"",
                delType:0,//1表示删除所有选中项，0表示删除本行；
                allCheck:false,//全选
                //重置密码
                reset:false,
                dangerous:false,
             };
         },
        name:"user",
        components:{CommonTip, NewUser,alertTip,reset},
        watch:{
            'ids':{
                handler:function(val,oldVal){
                    if (this.userlist.length>0&&this.userlist.length==this.ids.length) {
                        $("#checkAll").prop("checked",true)
                    }else if(this.ids.length < this.userlist.length){
                        $("#checkAll").prop("checked",false)
                    }
                }
            }
         },
        mounted:function(){
            this.getAllUser();
        },
        methods: {
            checkAll(){
               if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.userlist.length; i++){
                        this.ids.push(this.userlist[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            //分页获取表格数据；
           getAllUser(){
                 this.$http.get('/systemManage/getUsers',{
                    params:{
                      pagesize:this.pagesize,
                      pageindex:this.pageindex,
                      name:this.keyname}
                  }).then(res=>{
                    var  d=$.parseJSON(res.data);
                    if (d.msgid!=200) {
                      this.emsg=d.msg;
                      this.isError=true;
                      return false;
                    }
                    this.userlist=d.data;
                    this.count = d.count;
                    this.ids=[];
                    $("#checkAll").prop("checked",false);
                  }).catch(err=>{
                    console.log(err);
                  })
             },
             search(){
                  this.pageindex=1;
                  this.getAllUser();
             },
              handleCurrentChange(val) {
                  this.pageindex = parseInt(val);
                  this.getAllUser();
              },
            //新建/编辑
            addUser(e){
                this.ids = [];
                if (e) {
                    this.frmtitle="编辑用户-"+e.username;
                    this.optype=1;
                    this.uid=e.id;
                }else{
                    this.frmtitle="新建用户";
                    this.optype=0;
                    this.uid=0;
                }            
                this.isNew=true;
            },
            closeNewUser(){
                this.isNew = false;
             },
             //确定新增/编辑用户
             saveUser(id,username,realname,password,number,avatar,rid,jid,pid,did,remarks,enable){          
                            this.isNew = false;
                            this.$http.post('/systemManage/saveUserInfo',{
                                  uid:id,
                                  username:username,
                                  realname:realname,
                                  password:password,
                                  number:number,
                                  avatar:avatar,
                                  rid:rid,
                                  jid:jid,
                                  pid:pid,
                                  did:did,
                                  remarks:remarks,
                                  enable:enable
                            }).then(res=>{
                              var  d=JSON.parse(res.data);
                              if (d.msgid!=200) {
                                this.emsg=d.msg;
                                this.isError=true;
                                return false;
                              }
                              if(id==0){
                                this.emsg='添加成功';
                              }else{
                                this.emsg='更新成功';
                              }
                              this.isError=true;
                              this.getAllUser();
                            }).catch(err=>{
                              console.log(err);
                            })
             },
             invalidImg(){
                  this.emsg='建议尺寸为80*80的JPG或PNG图片，小于2MB';
                  this.isError=true;
             },
             //重置密码
             resetPwd(e){
                  this.ids = [];
                  this.uid=e.id;
                  if(e.email){
                    this.sendMail(e.id,e.email);
                  }else{
                    this.reset=true;
                  }
             },
             saveReset(id,email){
                  this.reset=false;
                  if(!email){
                      this.emsg='请填写邮箱地址';
                      this.isError=true;
                      return
                  }
                  this.sendMail(id,email);
             },
             sendMail(uid,email){
                     var _this=this;
                     this.$http.post('/systemManage/sendMail',{
                          uid:uid,
                          email:email
                      }).then(res=>{
                        var  d=$.parseJSON(res.data);
                        if (d.msgid!=200) {
                          this.emsg=d.msg;
                          this.isError=true;
                          return false;
                        }
                        this.getAllUser();

                        if(this.$store.state.user.uid==uid){
                            this.emsg='新密码已发送至您的邮箱,即将跳转至登录页';
                            this.isError=true;
                            setTimeout(function(){
                                _this.$router.push({path: '/login',query:{cmd:reset}});
                            }, 2000);
                        }else{
                            this.emsg='新密码已发送至填写的邮箱,请查收';
                            this.isError=true;
                        }
                      }).catch(err=>{
                        console.log(err);
                      })
             },
             //删除
             delUser (e) {
                this.ids = [];
                if(e.enable){
                  this.emsg='请先禁用该用户，再尝试删除操作';
                  this.isError=true;
                  return false;
                }
                 this.ShowDelTip = true;
                 this.uid=e.id;
                 this.ids.push(e.id);
                 this.delType=0;
                 this.dangerous = true;
                 this.message="您是否确定删除该用户，删除后该用户的其他相关信息不能进行维护，请慎重操作！";
             },
             delUsers(){
                  if(this.ids.length < 1){
                    this.emsg='请选择要删除的条目';
                    this.isError=true;
                    return false
                  }
                 this.ShowDelTip = true;
                 //this.uid=0;
                 this.delType=1;
                  this.dangerous = true;
                 this.message="您是否确定删除所选用户，删除后该用户的其他相关信息不能进行维护，请慎重操作！";
             },
             closeDelTip(){
                this.ids = [];
                this.ShowDelTip=false;
             },
             deleteUser(){
             var  datas=[];
                if (this.delType==1) {
                    datas=this.ids;
                    this.userlist.forEach(function(user){
                        if(user.enable){
                            datas.removevalue(user.id);
                        }
                    });
                }else{
                    datas.push(this.uid);
                }
                this.ShowDelTip=false;
                if(datas.length < 1){
                  this.emsg='暂无可删除的用户，请先禁用所选用户';
                  this.isError=true;
                  return false
                }
                this.$http.post('/systemManage/deleteUsers',{
                       ids:datas
                  }).then(res=>{
                       var  data=res.data;
                       var d;
                       if (data) {
                         d=$.parseJSON(data);
                       }
                       if (d.msgid!=200) {
                            this.emsg=d.msg;
                            this.isError=true;
                            return false;
                        }
                       this.emsg='删除成功';
                       this.isError=true;
                       this.pageindex = 1; 
                       this.currentPage = 1;
                       this.getAllUser();
                 }).catch(err=>{
                        console.log(err);
                 })
             },
             //关闭提示框
             closeMsgTip(){
                this.isError=false;
             }
         }
    }
</script>
<style lang="scss">
.el-pagination{
  text-align:center;
}

.user-r{
        height:83em;
        width:76%;
        float:left;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        left:18%;
        top:0;
        padding:2em;
        box-sizing:border-box;

        h1{
            font-size:1.4em;
            height:3em;
            margin:0;
            line-height:2em;
            padding-left:3em;
            border-bottom:1px dashed #fff;
        }
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
                margin-top:0;
            }
    }
</style>