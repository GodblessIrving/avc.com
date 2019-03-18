<template>
    <div class="role-r">
        <h1>角色管理</h1>
        <div class="operation">
            <a href="javascript:void(0)" @click="newRole">新建角色</a>
            <a href="javascript:void(0)" @click="delRoles">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索角色名称" v-model="keywords">
                <span class='searchbtn' @click="search">搜索</span>
             </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="" style="margin-bottom:0"><input type="checkbox" @click="checkAll" id="checkAll">All</label></th>
                        <th width="15">角色ID</th>
                        <th width="25">角色名称</th>
                        <th width="25">功能权限</th>
                        <th width="25">关联用户数</th>
                        <th width="15">状态</th>
                        <th width="35">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in rolelist">
                        <td><input type="checkbox" :value="role.id" v-model="ids"></td>
                        <td :title="role.id">{{role.id}}</td>
                        <td :title="role.name">{{role.name}}</td>
                        <td :title="role.featuresname.join(',')">{{role.featuresname.join(',')}}</td>
                        <td :title="role.count">{{role.count}}</td>
                        <td :class="role.enable?'green':'red'">{{role.enable?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="editRole(role.id)" v-if="role.id>1">编辑</a>
                            <a href="javascript:void(0)" @click="delRole(role);" v-if="role.id>1">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <new-role :show="nshow" :ptitle="ptitle" :model="nmodel" @closeEvent="close" 
        @saveEvent="saveRole"></new-role>
        <common-tip 
          :isShow="showDelTip" 
          :message="message" 
          :notDele="notDele"
          :notMess="notMess"
          @delObjEvent="deleteRole" 
          @closeTipEvent="closeTip">
          </common-tip>
        <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'closeAlert'>
        </alert-tip>
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
    import NewRole from "./NewRole"
    import CommonTip from "../../CommonTip"
    import alertTip from '../../alertTip'
    export default{
        data () {
             return {
                nshow:false,
                message:"",
                rolelist:[],
                pagesize:18,
                pageindex:1,
                count:0,
                keywords:"",//搜索关键字
                ids:[],//保存被选中的角色id的数组
                allCheck:false,
                showDelTip:false,
                rid:0,
                ptitle:"",//新建对话框的标题
                nmodel:null,//修改时用到的数据对象
                //提示
                emsg:'',
                isError:false,
                dType:0,
                notDele:false,
                notMess:''
             };
         },
        name:"role",
        components:{NewRole,CommonTip,alertTip},
        watch:{
            'ids':{
                handler:function(val,oldVal){
                    if (this.rolelist.length==this.ids.length&&this.ids.length>0) {
                        $("#checkAll").prop("checked",true)
                    }else if(this.ids.length < this.rolelist.length){
                        $("#checkAll").prop("checked",false)
                    }
                }
            }
         },
        mounted:function(){
            this.getAllRole();
        },
        methods: {
            checkAll(){
               if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.rolelist.length; i++){
                        this.ids.push(this.rolelist[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            closeAlert(){
              this.isError=false;
              this.ids = [];
            },
             getAllRole(){
                this.$http.get('/systemManage/getRoles',{
                    params:{
                        pagesize:this.pagesize,
                        pageindex:this.pageindex,
                        name:this.keywords}
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    if (d.msgid!=200) {
                        this.emsg=d.msg;
                        this.isError=true;
                        return false;
                    }
                    this.rolelist=d.data;
                    this.count=d.count;
                    this.ids=[];
                     $("#checkAll").prop("checked",false)
                }).catch(err=>{
                    console.log(err.message);
                })
             },
             search(){
                    this.pageindex=1;
                    this.getAllRole();
             },
             handleCurrentChange(val) {
                  this.pageindex = parseInt(val);
                  this.getAllRole();
              },
             delRole(e){
                if(e.enable){
                    this.emsg='请先禁用该角色，再尝试删除操作';
                    this.isError=true;
                    return false;
                 }else{
                  if(e.count > 0){
                      this.emsg='角色'+e.name+'下绑定用户，禁止删除';
                      this.isError=true;
                      return false;
                  }
                  this.ids = [];
                  this.notDele = false;
                  this.showDelTip=true;
                  this.message="您确定删除该角色吗?";
                  this.ids.push(e.id);
                }
             },
             delRoles(){
                if(this.ids.length < 1){
                    this.emsg='请选择要删除的条目';
                    this.isError=true;
                    return false;
                }else{
                  var datas = [];
                  for(var i=0;i<this.rolelist.length;i++){
                            var  item=this.rolelist[i];
                            if (this.ids.contain(item.id)) {
                                if (item.enable==1) {
                                    datas.push(item.id)
                                     continue;
                                }
                            }
                    }
                  if(datas.length!=0&&datas.length<=this.ids.length){
                      this.emsg='请先禁用所选的角色，再尝试删除操作';
                      this.isError=true;
                      return false
                  }else{
                    var all = this.ids.length;
                    var arr = []
                    for(var i=0;i<this.rolelist.length;i++){
                            var  item=this.rolelist[i];
                            if (this.ids.contain(item.id)) {
                                if (item.count>0) {
                                    this.ids.removevalue(item.id);
                                    arr.push(item.id)
                                     continue;
                                }
                            }
                     }
                      var cant = arr.length;
                      this.notMess = '共选中'+all+'条角色，其中'+cant+'条不允许被删除';
                      this.message = '不允许删除的角色下有绑定用户，禁止删除';
                      this.notDele = true;
                      this.showDelTip=true;
                   }  
                }
             },
             closeTip(){
                this.showDelTip=false;
                this.ids = [];
             },
             deleteRole(){   
                this.showDelTip = false;
                if(this.ids.length < 1){
                  return;
                }           
                this.$http.post('/systemManage/deleteRole',{
                    ids:this.ids
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                     this.ids = [];
                    if (d.msgid!=200) {
                        this.emsg=d.msg;
                        this.isError=true;
                        return false;
                    }                   
                    this.emsg='删除成功';
                    this.isError=true;
                    this.pageindex = 1;
                    this.currentPage = 1;
                    this.getAllRole();
                })
             },
             newRole(){
                this.ptitle="新建角色";
                this.rid=0;
                this.nmodel=null;
                this.nshow=true;
                this.ids = [];
             },
             close(){
                this.nshow=false;
             },
             editRole(e){
                this.ids = [];
                this.ptitle="编辑角色";
                this.rid=e;
                this.nmodel=this.getRoleDetails();
                this.nshow=true;
             },
             getRoleDetails(){
                this.features=[];
                this.$http.get('/systemManage/getRoleFeatures',{
                      params:{
                        roleid:this.rid
                      }
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    if (d.msgid!=200) {
                        this.emsg=d.msg;
                        this.isError=true;
                        return false;
                    }
                    this.nmodel=d.data;
                    console.log(JSON.stringify(d.data));
                })
             },
             saveRole(name,space,features,enabled,isgroup){
               if(features.length==0){
                    this.emsg='请为该角色分配功能权限';
                    this.isError=true;
                    return false;
               }
               this.nshow=false;
               this.$http.post('/systemManage/saveRole',{
                    id:this.rid,
                    name:name,
                    space:space,
                    enabled:enabled,
                    features:features,
                    type:isgroup
              }).then(res=>{
                    var d=$.parseJSON(res.data);
                  if (d.msgid!=200) {
                      this.emsg=d.msg;
                      this.isError=true;
                      return false;
                  }
                  if (this.rid==0) {
                      this.emsg="添加成功";
                  }else{
                      this.emsg="修改成功";
                  }
                  this.isError=true;
                  this.getAllRole();
              })
             },
             //关联用户,需求不清
             getAssociatedUser(e){
                    this.emsg='暂不支持该功能';
                    this.isError=true;
             }
         }
    }
</script>
<style lang="scss">
.role-r{
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
            height:3em;
            margin:0;
            line-height:2em;
            padding-left:3em;
            font-size:1.4em;
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
                width:100%;
            }
    }
</style>