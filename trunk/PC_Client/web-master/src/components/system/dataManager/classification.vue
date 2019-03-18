<template>
    <div class="classification">
        <div class="operation">
            <a href="javascript:void(0)" @click="addClass">创建分类</a>
            <a href="javascript:void(0)" @click="moveTo">迁移</a>
            <a href="javascript:void(0)" @click="deleteAll">删除</a>
           <p class="sear">
                <input type="text" placeholder="搜索分类名称" v-model="className">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="10">分类名称</th>
                        <th width="25">分类描述</th>
                        <th width="10">内容数量</th>
                        <th width="25">修改时间</th>
                        <th width="8">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in classifications">
                      <td><input type="checkbox" :value="c.id" v-model="ids"></td>
                        <td :title="c.name">{{c.name}}</td>
                        <td :title="c.description">{{c.description}}</td>
                        <td :title="c.count">{{c.count}}</td>
                        <td :title="c.createtime">{{c.createtime}}</td>
                        <td :class="[c.enabled?'green':'red']">{{c.enabled?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="editClass(c)">编辑</a>
                            <a href="javascript:void(0)" @click="deleteClass(c)" >删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip 
          :isShow="isDel" 
          :message="message" 
          :notDele = "notDele"
          :notMess = "notMess"
          @delObjEvent="delClass" 
          @closeTipEvent="closeTip">
        </common-tip>
        <migration :boolean="boolean" :title="title" :contents="contents" :ids="ids"
        @closeMigreEvent="closeMigre"@saveMigreEvent="saveMigre" ></migration>
        <new-sou 
            :show="showNew" 
            :title="title" 
            :type="ntype" 
            :model="editmodel" 
            @closeEvent="closeClass" 
            @saveEvent="saveClass" >
        </new-sou>
        <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
        </alert-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip"
    import NewSou from "./NewSou"
    import migration from "./migration"
    import alertTip from '../../alertTip'
    export default{
        data () {
             return {
                //列表数据
                classifications:[],
                ids:[],
                allCheck:false,
                pagesize:9999,
                pageindex:1,
                className:"",
                //新增或编辑
                id:0,
                showNew:false,
                editmodel:null,
                title:'分类',
                ntype:'',
                //删除
                isDel:false,
                delType:0,
                message:"",
                //迁移
                boolean:false,
                contents:[],
                //提示
                emsg:'',
                isError:false,
                notDele:false,
                notMess:''
             };
         },
        name:"classification",
        components:{CommonTip,NewSou,migration,alertTip},
        mounted:function(){
            this.getClassifications();
        },
       watch:{
            ids:function(){
              if(this.ids.length < this.classifications.length){
                $("#checkAll").prop("checked",false);
              }else if( this.ids.length > 0 && this.ids.length == this.classifications.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        methods: {
           checkAll(){
               if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.classifications.length; i++){
                        this.ids.push(this.classifications[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            addClass(){
                this.showNew=true;
                this.id=0;
                this.ntype="创建";
                this.editmodel=null;
            },
            closeClass(){
                this.ids = [];
                this.showNew = false;
             },
             getClassifications(){
                   this.$http.get('/systemManage/getClassifications',{
                      params:{
                        'pagesize':this.pagesize,
                        'pageindex':this.pageindex,
                        'name':this.className
                      }
                   }).then(res=>{
                      var  d=$.parseJSON(res.data);
                      if (d.msgid!=200) {
                              this.emsg=d.msg;
                              this.isError=true;
                              return false;
                       }
                        this.classifications=d.data;
                        this.ids=[];
                        $("#checkAll").prop("checked",false);
                   }).catch(err=>{
                            console.log(err);
                  });
             },
             search(){
                    this.pageindex = 1;
                    this.getClassifications();
             },
             saveClass(name,description,enabled){
                this.showNew=false;
                this.$http.post('/systemManage/saveClassification',{
                    'id':this.id,
                    'name':name,
                    'description':description,
                    'enabled':enabled
                }).then(res=>{
                    var  d=$.parseJSON(res.data);
                    if (d.msgid!=200) {
                            this.emsg=d.msg;
                            this.isError=true;
                            return false;
                     }

                     if (this.id==0) {
                       this.emsg="添加成功";
                     }else {
                       this.emsg="编辑成功";
                     }
                     this.isError=true;
                     this.getClassifications();
                 });
             },
             editClass(e){
                this.ids = [];
                this.id=e.id;
                this.ntype="编辑";
                this.editmodel=e;
                this.showNew=true;
             },
             closeTip(){
                this.isDel=false;
                this.ids = [];
             },
             moveTo(){
              if(this.ids.length < 1){
                this.emsg='请选择要迁移的分类';
                this.isError=true;
                return
              }else{
                var enableList = [];
                for(var i = 0; i<this.classifications.length; i++){
                  for(var j = 0; j < this.ids.length; j++){
                    if(this.classifications[i].id == this.ids[j]){
                      if(this.classifications[i].enabled == 1){
                          enableList.push(this.classifications[i].enabled);
                      }
                    }
                  }
                }
                if(enableList.length > 0){
                  this.getAllClasses();
                  this.boolean = true;
                }else{
                  this.emsg='请先启用选中的分类，再进行迁移';
                  this.isError=true;
                }
              }
                
             },
            closeMigre(){
                this.boolean = false;
                this.ids = [];
             },
             saveMigre(to){
              this.boolean = false;
               if(!to){
                  this.emsg='请选择目标分类';
                  this.isError=true;
                  return
               }
               if(this.ids.length == 0){
                  this.emsg='请选择要迁移的分类';
                  this.isError=true;
                  return
               }
               this.$http.post('/systemManage/MoveClassification',{
                  ids:this.ids,
                  id:to
               }).then(res=>{
                  var d= $.parseJSON(res.data);
                  if (d.msgid!=200) {
                          this.emsg=d.msg;
                          this.isError=true;
                          return false;
                   }
                  this.getClassifications();
                  this.emsg='迁移成功';
                  this.isError=true;
               }).catch(err=>{
                        console.log(err);
              });
             },
             getAllClasses(){
                this.$http.get('/systemManage/getClassifications',{
                    params:{
                        pagesize:9999,
                        pageindex:1,
                        name:''
                    }
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    if (d&&d.msgid==200) {
                        this.contents=d.data;
                    }
                })
             },
             delClass(){
                this.isDel=false;
               if(this.ids.length < 1){
                 return;
               }
               this.$http.post('/systemManage/deleteClassification',{
                  ids:this.ids
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
                  this.getClassifications();
                  this.emsg='删除成功';
                  this.isError=true;
               }).catch(err=>{
                   console.log(err);
              });
             },
             deleteClass(e){
                if(e.count>0){
                    this.emsg=e.name+"分类下还关联内容资源，请将内容资源迁移后再删除";
                    this.isError=true;
                    return false;
                }
                this.ids = [];
                this.ids.push(e.id);
                this.message="您确定删除"+e.name+"分类吗?";
                this.notDele = false;
                this.isDel=true;
                this.delType=0;
             },
             deleteAll(){
              if(this.ids.length<1){
                this.emsg="请选择删除条目";
                this.isError=true;
                return false;
              }else{
                var all = this.ids.length;
                var arr = []
                for(var i=0;i<this.classifications.length;i++){
                        var  item=this.classifications[i];
                        if (this.ids.contain(item.id)) {
                            if (item.count>0) {
                                this.ids.removevalue(item.id);
                                arr.push(item.id)
                                 continue;
                            }
                        }
                    }
                  var cant = arr.length;
                  this.notMess = '共选中'+all+'条分类，其中'+cant+'条不允许被删除';
                  this.message = '不允许删除的分类下还关联内容资源，请将内容资源迁移后再删除';
                  this.notDele = true;
                  this.isDel=true;
              }
               this.delType=1;
             }
         },
    }
</script>
<style lang="scss">
.classification{
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