<template>
    <div class="messge">
          <div class="mess-top">
            <div class="top-sear">
                <span>消息内容</span>
                <input type="text" placeholder="按消息内容模糊搜索" v-model="key">
            </div>
            <div class="top-sear1">
                <span>发布时间</span>
            <el-date-picker
                v-model="lstart"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
                v-model="lend"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime">
            </el-date-picker>
            </div>
            <div> <span class="mess-searchBtn" @click="searchMess">搜索</span></div>
          </div>
          <div class="opeartion-btn">
            <span class="mess-add" @click="openNew()">新建</span>
            <span class="mess-del blue" @click="DelMore()">删除</span>
            <a class="export" :href="path">导出</a>
          </div>
          <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><input type="checkbox" id="checkAll" @change="checkAll"></th>
                        <th width="5">ALL</th>
                        <th width="55">消息内容</th>
                        <th width="10">消息来源</th>
                        <th width="15">消息发布时间</th>
                        <th width="10">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="m in MessgaeList">
                        <td><input type="checkbox" :id="m.id" :value="m.id" v-model="ids"></td>
                        <td>
                            <div v-bind:class="[m.read==0?'e-mail':'e-mail-read']"></div>
                        </td>
                        <td style="cursor:pointer; padding:0 10px; box-sizing:border-box;" @click="openEmail(m)">{{m.content}}
                        </td>
                        <td :title="m.fname?m.fname:'管理员'">{{m.fname?m.fname:'管理员'}}</td>
                        <td>{{m.createtime}}</td>
                        <td>
                            <span class="del-mess" @click="openDel(m.id)"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagetion">
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
        <mess-content 
            :Email="Email" 
            :message='content'
            @closeEmail="closeEmail()">
        </mess-content>
        <common-tip 
            :isShow="isDel" 
            :message="message" 
            @closeTipEvent="closeDel"
            @delObjEvent = "sureDel">
        </common-tip>
        <alert-tip :isShowtip="isShowtip" :message="text" @closeTipEvent="closeTip">
        </alert-tip>
        <newmess :isNew="isNew" @closeNewMess="closeNew" @saveTipEvent="saveSuess"></newmess>
    </div>
</template>
<script type="text/ecmascript-6">
import CommonTip from "../CommonTip"
import MessContent from "./MessContent"
import newmess from "./newmess"
import alertTip from "../alertTip"
export default {
        name:"messge",
        data(){
            return{
                lstart:'',
                lend:'',
                key:'',
                isShowtip:false,
                text:'',
                Email:false,
                isDel:false,
                message:'',
                isNew:false,
                pageindex:1,
                pagesize:15,
                MessgaeList:[],
                ids:[],
                content:[],
                delid:'',
                type:0,
                paramsId:[],
                currentPage:1,
                count:10000,
                page:true,
                path:'',
            }
        },
        computed:{
                uid:function(){
                    return this.$store.state.user.uid;
                }
        },
        components:{MessContent,CommonTip,newmess,alertTip},
        watch:{
            ids:function(){
                if(this.ids.length < this.MessgaeList.length){
                    $("#checkAll").prop("checked",false);
                }else if(this.ids.length>0&&this.ids.length == this.MessgaeList.length){
                    $("#checkAll").prop("checked",true);
                }
                this.path = this.ajaxBaseUrl+'/User/ExportUsermessage?ids='+this.ids.join(',');
            },
        },
        mounted:function(){
            this.path = this.ajaxBaseUrl+'/User/ExportUsermessage?ids='
            this.getUserMessage();
        },
        methods:{
            // 获取所有消息列表
            getUserMessage(){
                this.$http.get('/User/GetUserMsg',{
                    params:{
                        uid:this.uid,
                        pagesize:this.pagesize,
                        pageindex:this.pageindex,
                        content:this.key,
                        begin:this.lstart,
                        end:this.lend
                    }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    this.ids = [];
                    if(d){
                        if(d.msgid == 200){
                            this.MessgaeList = d.data; 
                            if(d.data.length > 0){
                                $(".mess-del").addClass('blue').removeClass('blue-none');
                            }else{
                                $(".mess-del").addClass('blue-none').removeClass('blue');
                            }
                            this.count = d.count;
                            if(this.count <= 15){
                                this.page = false;
                            }else{
                                this.page = true;
                            }
                            this.UnreadCount();
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 消息发送
            saveSuess(ids,message){
                this.$http.post('/User/NewMessage',{
                   ids:ids,
                   uid:this.uid,
                   content:message
                 }).then(res=>{
                   var d = $.parseJSON(res.data);
                   this.ids = [];
                   this.isShowtip = true;
                   this.isNew = false;
                   if(d){
                     if(d.msgid == 200){
                       this.text = '消息发送成功';
                       this.getUserMessage();
                     }else{
                        this.text = '消息发送失败'
                     }
                   }
                 }).catch(err=>{
                   console.log(err);
                 })              
            },
            // 读取消息详情
            openEmail(m){
                this.content = m;
                this.Email = true;
                this.$http.post('/User/ReadMessage',{
                    id:m.id
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        if(d.msgid == 200){
                             this.getUserMessage();
                             this.UnreadCount();
                         }else{
                            console.log(d.msg)
                         }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            UnreadCount(){
                this.$http.get('/User/UnreadCount',{
                    params:{}
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        if(d.msgid == 200){
                            var count = d.data;
                             var ds=sessionStorage.avc_info;
                             if(ds){
                                var info = JSON.parse(ds);
                                info.count = count;
                                sessionStorage.setItem("avc_info",JSON.stringify(info));
                                localStorage.setItem("avc_info",JSON.stringify(info));
                                this.$store.commit('updateInfo',info);
                             }
                        }
                    }
                })
            },
            // 关闭读取详情弹窗
            closeEmail(){
                this.Email = false;
            },
            // 单个删除消息
            openDel(id){
                this.delid = id;
                this.isDel = true;
                this.ids.push(id);
                this.type = 0;
                this.message = '您确定删除该条消息吗?'
            },
            // 多条删除及全删
            DelMore(){
                if($(".mess-del").hasClass('blue-none')){
                    return
                }
                this.isDel = true;
                this.type = 1;
                if(this.ids.length < 1){
                    this.message = '您确定删除全部消息吗?';
                    for(var i = 0; i < this.MessgaeList.length; i++){
                        this.ids.push(this.MessgaeList[i].id)
                    } 
                }else{
                    this.message = '您确定删除所选中的所有消息吗?'
                }
                
            },
            // 确认删除事件
            sureDel(){
                if(this.type == 0){
                    this.paramsId = [];
                    this.paramsId.push(this.delid);
                }else{
                    this.paramsId = this.ids;
                }
                this.$http.post('/User/DelUserMsg',{
                    ids:this.paramsId
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isDel = false;
                        if(d.msgid == 200){
                            this.isShowtip = true;
                            this.text = '删除成功';
                            this.pageindex = 1;
                            this.currentPage = 1;
                            this.getUserMessage();
                            this.ids = [];
                        }else{
                            this.isShowtip = true;
                            this.text = '删除失败';
                        }
                    }
                }).catch(res=>{
                    console.log(err)
                })
            },
            checkAll(){
                if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.MessgaeList.length; i++){
                        this.ids.push(this.MessgaeList[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            searchMess(){
                this.pageindex=1;
                this.getUserMessage();
            },
            closeTip(){
                this.isShowtip = false;
            },
            closeDel(){
                this.isDel = false;
                this.ids = [];
            },
            openNew(){
                this.isNew = true;
            },
            closeNew(){
                this.isNew = false;
            },
            handleCurrentChange(val){
                this.pageindex = parseInt(val);
                this.getUserMessage();
            },
        }
       }
</script>
<style lang="scss">
@media screen and (max-width: 1366px) {
    .newmess .content{
        height:30em;
        overflow-y:auto !important;
    }
}
.messge{
    width:100%;
    padding:2em;
    height:75em;
    color:#fff;
    position:relative;

    .mess-top{
        width:100%;
        height:5em;
        line-height:5em;
        background-color:#666;
        padding:0 2em;
        overflow:hidden;
        .top-sear{
            float:left;
            input{
                border:1px solid #0099ff;
                height:2.5em;
                background-color:#fff;
                border-radius:3px;
                width:15em;
                                                color:#666;
                                                padding-left:0.2em;
            }
        }
        .top-sear1{
            float:left;
            margin-left:5em;
            .el-input__inner{
                background-color:#fff !important;
                height:2.5em;
                                                color:#666 !important;
            }
        }
        .mess-searchBtn{
            padding-left:2.5em;
            background-color:#0099ff;
            height:2em;
            margin-top:1.5em;
            line-height:2em;
            border-radius:3px;
            float:right;
            cursor:pointer;
            background-image:url("../../assets/message/u61.png");
            background-repeat:no-repeat;
            background-position:10px center;
            background-size:30%;
            padding-right:10px;

        }       
    }
    .opeartion-btn{
        width:100%;
        margin-bottom:1.5em;
        span,a{
            padding-left:2.5em;
            background-color:#0099ff;
            height:2.5em;
            margin-top:1.5em;
            line-height:2.5em;
            border-radius:3px;
            cursor:pointer;
            background-repeat:no-repeat;
            background-position:10px center;
            padding-right:10px;
            display:inline-block;
            margin-right:2em;
            color:#fff;
            text-decoration: none;
        }
        .blue{
            background-color:#0099ff;
        }
        .blue-none{
            background-color:#666;
        }
        .mess-add{
            background-image:url("../../assets/message/u612.png");
            background-size:33%;
        }
        .mess-del{
            background-image:url("../../assets/videoPlay/u148.png");
            background-size:21%;
        }
        .export{
            background-image:url("../../assets/message/u397.png");
            background-size:33%;
        }
    }
    .excel{
                width:100%;
                margin-top:1.5em;
                table{
                    width:100%;
                    text-align:center;
                    tr{
                        height:3em;
                        line-height:3em;
                        border-top:1px solid #313030;
                        th{
                            color:#0099ff;
                            font-size:1.3em;
                            font-weight:normal;
                            text-align:center;
                            background-color:#242424;
                            }
                             td{
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;

                                .e-mail{
                                    background:url("../../assets/message/u131.png") no-repeat center;
                                    background-size:30%;
                                    width:100%;
                                    height:3em;
                                }
                                .e-mail-read{
                                    background:url("../../assets/message/u129.png") no-repeat center;
                                    background-size:30%;
                                    width:100%;
                                    height:3em;
                                }
                                .del-mess{
                                    display:inline-block;
                                    width:3em;
                                    height:2em;
                                    cursor:pointer;
                                    background:url("../../assets/message/u109.png") no-repeat center;
                                    background-size:40%;
                                    position:relative;
                                    top:0.5em;
                                }
                            }
                          
                    }
                    tr:nth-child(2n){
                        background-color:#242424;
                    }
                    tr:nth-child(2n+1){
                        background-color:#1c1b1b;
                    }

                }
            }
            .pagetion{
                width:100%;
                text-align:center;
                position:absolute;
                bottom:2em;
                .el-pagination .btn-next, .el-pagination .btn-prev{
          padding:0 10px;
          width:5.5em;
        }
            }
}
</style>