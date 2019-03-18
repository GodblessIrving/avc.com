<template>
    <div class="position-title">
        <div class="operation">
            <a href="javascript:void(0)" @click="addNew(1)">创建</a>
            <a href="javascript:void(0)" @click="del(1)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索职位名称" v-model="key">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="10">职务ID</th>
                        <th width="25">职务名称</th>
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
        <newpos :isPos='isPos'
                       :isedit = "isedit"
                       :type= "types"
                       :plist = "plist"
                       :mestitle="mestitle"
                       @saveTipEvent="savePos"
                      @closeTipEvent="closenew()">
        </newpos>
        <alert-tip
            :isShowtip="isShowtip"
            :message="mess"
            @closeTipEvent="closeAlert">
        </alert-tip>
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
                isedit:false,
                types:'',
                pid:0,
                isShowtip:false,
                mess:'',
                poslist:[],
                pids:[],
                plist:{},
                mestitle:'职务',
                notDele:false,
                notMess:'',
                key:''
             };
         },
        name:"position",
        components:{CommonTip,newpos,alertTip},
        mounted:function(){
            this.getAllPosition();
        },
        watch:{
            pids:function(){
              if(this.pids.length < this.poslist.length){
                $("#checkAll").prop("checked",false);
              }else if(this.pids.length>0 && this.pids.length==this.poslist.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        methods: {
            // 获取所有的职位信息
            getAllPosition(){
                this.$http.get('/systemManage/GetAllPositions',{
                    params:{
                        pagesize:99999,
                        pageindex:1,
                        name:this.key
                    }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    this.pids = [];
                    $("#checkAll").prop("checked",false);
                    if(d){
                        if(d.msgid == 200){
                            this.pid = [];
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
                this.getAllPosition()
            },
            // 新增或者编辑职务
            savePos(val){
                this.$http.post('/systemManage/SavePosition',{
                    id:this.pid,
                    name:val,
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    this.pids = [];
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
                        }else {
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
            //关闭弹出窗 
             closeAlert(){
                this.isShowtip = false;
             },
            // 编辑或者新增
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
            // 关闭新增窗
            closenew(){
              this.isPos = false;
              this.pid = [];
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
            // 删除询问
            del(type,p){
                if(type == 1){
                    if(this.pids.length < 1){
                        this.isShowtip = true;
                        this.mess = "未选中任何职务信息";
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
                          this.notMess = '共选中'+all+'条职务，其中'+cant+'条不允许被删除';
                          this.message = '不允许删除的职务下有绑定用户，禁止删除';
                          this.notDele = true;
                          this.isDel=true;
                    }
                }else{
                    if(p.count > 0){
                        this.isShowtip = true; 
                        this.mess = '职务'+p.name+'下绑定用户,禁止删除';
                        return
                    }
                    this.pids = [];
                    this.pids.push(p.id);
                    this.isDel=true;
                    this.notDele = false;
                    this.message = "您确定删除该职务吗？"
                }               
            },                                                                                                              
            delClass(){
                this.isDel=false;
                if(this.pids.length < 1){
                    return
                }   
                this.$http.post('/systemManage/DeletePosition',{
                    ids:this.pids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isShowtip = true; 
                        this.pids = [];
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
.position-title{
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