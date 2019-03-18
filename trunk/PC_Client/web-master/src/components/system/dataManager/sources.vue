<template>
    <div class="sources">
        <div class="operation">
            <a href="javascript:void(0)" @click="openNew()">创建来源</a>
            <a href="javascript:void(0)" @click="openMigre">迁移</a>
            <a href="javascript:void(0)" @click="openDels">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索来源名称" v-model="name">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="" style="margin-bottom:0"><input type="checkbox"
                        @change="checkAll" id="checkAll">All</label></th>
                        <th width="10">来源名称</th>
                        <th width="25">来源描述</th>
                        <th width="10">内容数量</th>
                        <th width="25">修改时间</th>
                        <th width="8">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in sources">
                        <td><input type="checkbox" :value="s.id" v-model="ids"></td>
                        <td :title="s.name">{{s.name}}</td>
                        <td :title="s.description">{{s.description}}</td>
                        <td :title="s.count">{{s.count}}</td>
                        <td :title="s.createtime">{{s.createtime}}</td>
                        <td :class="[s.enabled?'green':'red']">{{s.enabled?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="openNew(s);">编辑</a>
                            <a href="javascript:void(0)" @click="openDel(s);">删除</a>
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
            @delObjEvent="delSource" 
            @closeTipEvent="closeDel"></common-tip>
        <migration :boolean="boolean" :contents="contents" title="来源" :ids="ids" @closeMigreEvent="closeMigre" 
        @saveMigreEvent="saveMigre"></migration>
        <new-sou :show="shownew" :title="stitle"  :model="smodel" :type="stype" @closeEvent="closeNew" 
        @saveEvent="saveSource" ></new-sou>
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
                sid:0,//来源id;
                sources:[],
                ids:[],
                name:"",
                pagesize:9999,
                pageindex:1,
                //全选
                allCheck:false,
                //新建/编辑相关
                shownew:false,//是否显示新建对话框
                stitle:"来源",//弹出窗的标题；
                smodel:null,
                stype:"",
                //迁移
                contents:[],
                boolean:false,
                //删除相关
                isDel:false,
                message:"",
                delType:0,
                //提示
                emsg:'',
                isError:false,
                notDele:false,
                notMess:'',
             };
         },
        name:"sources",
        components:{CommonTip,NewSou,migration,alertTip},
        mounted:function(){
            this.getSources();
        },
       watch:{
            ids:function(){
              if(this.ids.length < this.sources.length){
                $("#checkAll").prop("checked",false);
              }else if(this.ids.length > 0 && this.ids.length == this.sources.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        methods: {
            checkAll(){
               if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.sources.length; i++){
                        this.ids.push(this.sources[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
             //查询
             getSources(){
                   this.$http.get('/systemManage/getSources',{
                      params:{
                        'pagesize':this.pagesize,
                        'pageindex':this.pageindex,
                        'name':this.name
                        }
                   }).then(res=>{
                      var  d=$.parseJSON(res.data);
                      if (d.msgid!=200) {
                              this.emsg=d.msg;
                              this.isError=true;
                              return false;
                       }
                        this.sources=d.data;
                        this.ids=[];
                        $("#checkAll").prop("checked",false);
                   }).catch(err=>{
                            console.log(err);
                  });
             },
             search(){
                this.pageindex = 1;
                 this.getSources();
             },
             //新建
             closeNew(){
                this.shownew=false;
                this.ids = [];
             },
             openNew(d){
                this.ids = [];
                if(d){
                    this.stype="编辑";
                    this.smodel=d;
                    this.sid = d.id;
                }else{
                    this.stype="创建";
                    this.smodel=null;
                    this.sid = 0;
                }
                this.shownew=true;
             },
             saveSource(name,description,enabled){
                this.shownew=false;
                this.$http.post('/systemManage/saveSource',{
                            'id':this.sid,
                            'name':name,
                            'description':description,
                            'enabled':enabled
                       }).then(res=>{
                          var d= $.parseJSON(res.data);
                          if (d.msgid!=200) {
                                  this.emsg=d.msg;
                                  this.isError=true;
                                  return false;
                           }
                           if(this.sid==0){
                                  this.emsg='添加成功';
                           }else{
                                  this.emsg='编辑成功';
                           }
                           this.isError=true;
                           this.getSources();
                });
             },
             //迁移
             closeMigre(){
                this.boolean=false;
                this.ids = [];
             },
             openMigre(){
                if(this.ids.length < 1){
                    this.emsg='请选择要迁移的来源';
                    this.isError=true;
                    return 
                }else{
                  var enableList = [];
                  for(var i = 0; i<this.sources.length; i++){
                    for(var j = 0; j < this.ids.length; j++){
                      if(this.sources[i].id == this.ids[j]){
                        if(this.sources[i].enabled == 1){
                            enableList.push(this.sources[i].enabled);
                        }
                      }
                    }
                  }
                  if(enableList.length > 0){
                    this.getAllSources();
                    this.boolean=true;
                  }else{
                    this.emsg='请先启用选中的来源，再进行迁移';
                    this.isError=true;
                  }
                }
                
             },
             saveMigre(to){
                this.boolean = false;
                if(!to){
                  this.emsg='请选择目标来源';
                  this.isError=true;
                  return
               }
                if(this.ids.length == 0){
                  this.emsg='请选择要迁移的来源';
                  this.isError=true;
                  return
               }
                this.$http.post('/systemManage/MoveSource',{
                  ids:this.ids,
                  id:to
               }).then(res=>{
                  var d= $.parseJSON(res.data);
                  if (d.msgid!=200) {
                          this.emsg=d.msg;
                          this.isError=true;
                          return false;
                   }
                  this.getSources();
                  this.emsg='迁移成功';
                  this.isError=true;
               }).catch(err=>{
                        console.log(err);
              });
             },
             getAllSources(){
                this.$http.get('/systemManage/getSources',{
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
             //删除
             closeDel(){
                this.isDel=false;
                this.ids = [];
             },
             openDel (e) {
                if (e.count>0) {
                    this.emsg=e.name+"来源下还关联内容资源，请将内容资源迁移后再删除";
                    this.isError=true;
                    return false;
                }
                this.ids = [];
                this.ids.push(e.id);
                this.message="您确定删除"+e.name+"来源?";
                this.notDele = false;
                this.delType=0;
                this.isDel = true;
             },
             openDels(){
               if(this.ids.length<1){
                  this.emsg="请选择删除条目";
                  this.isError=true;
                  return false;
                }else{
                  var arr=[];
                  var all = this.ids.length;
                  for(var i=0;i<this.sources.length;i++){
                       var  item=this.sources[i];
                       if (this.ids.contain(item.id)) {
                           if (item.count>0) {
                               this.ids.removevalue(item.id);
                               arr.push(item.id)
                           }
                       }
                   }
                   var cant = arr.length;
                    this.notMess = '共选中'+all+'条来源，其中'+cant+'条不允许被删除';
                    this.message = '不允许删除的来源下还关联内容资源，请将内容资源迁移后再删除';
                    this.notDele = true;
                    this.isDel=true;
               }
               this.delType=1;
             },
             delSource(){
                this.isDel=false;
                if(this.ids.length < 1){
                  return
                }
               this.$http.post('/systemManage/deleteSource',{
                    ids:this.ids
               }
               ).then(res=>{
                  var  d=$.parseJSON(res.data);
                  if(d.msgid==200){
                    this.emsg='删除成功';
                  }else{
                    this.emsg=d.msg;
                  }
                  this.isError=true;
                  this.getSources();
               }).catch(err=>{
                        console.log(err);
              });
             }
         },
    }
</script>
<style lang="scss">
.sources{
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
            
            // 弹出窗
           .new-sou{
            width:50em;
            height:35em;
            background:url("../../../assets/module/u10.png") no-repeat;
            background-size:100% 100%;
            position:absolute;
            z-index:10;
            top:15em;
            left:50%;
            margin-left:-25em;
            padding:2em;
            .edit-top{
                width:100%;
                height:3em;
                font-size:1.2em;
                border-bottom:1px dashed #fff;
                line-height:2em;

                p{
                    float:left;
                }
                span{
                    float:right;
                    font-size:2em;
                    cursor:pointer;
                }
            }
            .edit-form{
                width:100%; 
                p{
                    margin-top:2em;
                    position:relative;
                    height:auto;
                    clear:both;

                    span{
                        width:8em;
                        height:2.5em;
                        line-height:2.5em;
                        text-align:right;
                        display:inline-block;

                    }
                    input[type="text"]{
                        height:2.5em;
                        width:20em;
                        border-radius:3px;
                        border:1px solid #4e4e4e;
                        position:absolute;
                        left:11em;
                    }

                    select{
                        color:#000;
                        height:2.5em;
                        width:10em;
                        position:absolute;
                        left:11em;
                    }
                    textarea{
                        position:absolute;
                        left:11em;
                        background:none;
                        border-radius:3px;
                        border:1px solid #4e4e4e;
                        resize:none;
                    }

                    label{
                        position:relative;
                        left:2em;
                        margin-right:3em;
                    }
                }
            }
            .edit-tip{
                margin-left:2.5em;
            }
            .edit-btn{
                width:100%;
                text-align:center;
                margin-top:3em;
                a{
                    display:inline-block;
                    color:#fff;
                    text-decoration: none;
                    width:4em;
                    height:2em;
                    line-height:2em;
                    text-align:center;
                    background-color:#0099ff;
                    margin-right:3em;
                    border-radius:3px;
                }
                a:nth-child(2){
                    background-color:#666666;
                }
            }
        }
        .excel{
          height:63em;
          overflow-y:auto;
        }
    }
</style>