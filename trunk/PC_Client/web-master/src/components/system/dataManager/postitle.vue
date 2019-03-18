<template>
    <div class="postitle">
        <div class="operation">
            <a href="javascript:void(0)" @click="addNew(1)">创建</a>
            <a href="javascript:void(0)" @click="del(1)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索职称名称" v-model="key">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="10">职称ID</th>
                        <th width="25">职称名称</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in poslist">
                      <td><input type="checkbox" :value="p.id" v-model="pids"></td>
                        <td>{{p.id}}</td>
                        <td :title="p.name">{{p.name}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="addNew(2,p)">编辑</a>
                            <a href="javascript:void(0)" @click="del(2,p)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip :isShow="isDel" 
                               :message="message" 
                                :notDele = "notDele"
                                :notMess = "notMess"
                               @delObjEvent="delClass" 
                               @closeTipEvent="closeTip">
        </common-tip>
        <alert-tip 
            :isShowtip="isShowtip"
            :message="mess"
            @closeTipEvent="close">
        </alert-tip>
        <newpos :isPos='isPos'
                       :isedit = "isedit"
                       :type= "types"
                       :plist = "plist"
                       :mestitle="mestitle"
                       @saveTipEvent="savePos"
                       @closeTipEvent="closenew()">
        </newpos>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip"
    import newpos from "./newpos"
    import alertTip from "../../alertTip"
    export default{
        data () {
             return {
                isDel:false,
                message:"",
                isPos:false,
                poslist:[],
                isShowtip:false,
                mess:'',
                isedit:false,
                types:'',
                plist:{},
                pid:0,
                pids:[],
                mestitle:'职称',
                notDele:false,
                notMess:'',
                key:'',
             };
         },
        name:"postitle",
        components:{CommonTip,newpos,alertTip},
        watch:{
            pids:function(){
              if(this.pids.length < this.poslist.length){
                $("#checkAll").prop("checked",false);
              }else if(this.pids.length > 0 && this.pids.length == this.poslist.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        mounted:function(){
            this.getAllPosition();
        },
        methods: {
            // 获取所有的职称信息
            getAllPosition(){
                this.$http.get('/systemManage/GetAllJobTitles',{
                    params:{
                        pagesize:99999,
                        pageindex:1,
                        name:this.key,
                    }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    this.pids = [];
                    $("#checkAll").prop("checked",false);
                    if(d){
                        if(d.msgid == 200){
                            this.poslist = d.data;
                        }else if(d.msgid == -1){
                            this.isShowtip = true;
                            this.mess = d.msg
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            search(){
                this.getAllPosition();
            },
            // 新增或者编辑职务
            savePos(val){
                this.$http.post('/systemManage/SaveJobTitle',{
                    id:this.pid,
                    name:val,
                }).then(res=>{
                    this.pids = [];
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isPos = false;
                        if(d.msgid == 200){
                            if(!this.isedit){
                                this.isShowtip = true;
                                this.mess = "新增成功"
                            }else{
                                this.isShowtip = true;
                                this.mess = "编辑成功"
                            }
                            this.getAllPosition();
                        }else{
                            this.isShowtip = true;
                            this.mess = d.msg
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 关闭对话框
            closeTip(){
               this.isDel=false;
               this.pids = [];
            }, 
            // 新增或者编辑弹窗
            addNew(type,p){
                this.pids = [];
                if(type==1){
                    this.isedit = false;
                    this.types = "创建";
                    this.plist = {};
                    this.pid = 0;
                }else if(type == 2){
                    this.isedit = true;
                    this.types = "编辑";
                    this.pid = p.id;
                    this.plist = p;
                }
                this.isPos = true;
             },    
            // 关闭新增弹窗
            closenew(){
              this.isPos = false;
              this.pids = [];
            },
            // 关闭弹窗
            close(){
               this.isShowtip = false;
            },
            // 全选
            checkAll(){
                if($("#checkAll").prop("checked")){
                    this.pids = [];
                    for(var i = 0; i < this.poslist.length; i++){
                        this.pids.push(this.poslist[i].id)
                    }                                    
                }else{
                    this.pids = [];
                }
            },
            // 删除按钮
            del(type,p){
                if(type == 1){
                    if(this.pids.length < 1){
                        this.isShowtip = true;
                        this.mess = "未选中任何职称信息";
                    }else{
                       var all = this.pids.length;
                        var arr = []
                        for(var i=0;i<this.poslist.length;i++){
                                var  item=this.poslist[i];
                                if (this.pids.contain(item.id)) {
                                    if (item.count>0) {
                                        this.pids.removevalue(item.id);
                                        arr.push(item.id)
                                         continue;
                                    }
                                }
                            }
                         var cant = arr.length;
                         this.notMess = '共选中'+all+'条职称，其中'+cant+'条不允许被删除';
                         this.message = '不允许删除的职称下有绑定用户，禁止删除';
                         this.notDele = true;
                         this.isDel=true;
                    }
                }else{
                    if(p.count > 0){
                        this.isShowtip = true;
                        this.mess = '职称'+p.name+'下绑定用户,禁止删除';
                        return
                    }
                    this.pids = [];
                    this.pids.push(p.id);
                    this.notDele = false;
                    this.isDel=true;
                    this.message = "您确定删除该职称吗？"
                }               
            }, 
            delClass(){
                this.isDel=false;
                if(this.pids.length < 1){
                    return
                }
                this.$http.post('/systemManage/DeleteJobTitle',{
                    ids:this.pids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.pids = [];
                        this.isShowtip = true; 
                        if(d.msgid == 200){                           
                            this.mess = "删除成功";                           
                            this.getAllPosition();
                        }else{
                            this.mess = d.msg;
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },                  
         }
    }
</script>
<style lang="scss">
.postitle{
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

            p{
                width:35%;
                height:4em;
                float:right;
                margin: 0 auto;
            }
        }
        .excel{
          height:63em;
          overflow-y:auto;
        }
    }
</style>