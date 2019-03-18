<template>
    <div class="queue">
        <div class="operation">
            <a href="javascript:void(0)" @click="startTask(1)">开始</a>
            <a href="javascript:void(0)" @click="stopTask(1)">停止</a>
            <a href="javascript:void(0)" @click="toggleDel(1)">删除</a>
            <select name="" id="" v-model="status">
                <option value="10">请选择转码状态</option>
                <option value="0">转码中</option>
                <option value="2">等待</option>
                <option value="4">停止</option>
            </select>
            <p class="sear">
                <input type="text" placeholder="搜索视频名称" v-model="keyword">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel" style="height:65em; overflow-y:auto;">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="2"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="12">转码视频名称</th>
                        <!-- <th width="6">分辨率</th> -->
                        <th width="6">分类</th>
                        <th width="6">来源</th>
                        <th width="13">开始时间</th>
                        <th width="8">耗时</th>
                        <th width="8">速率</th>
                        <th width="8">状态</th>
                        <th width="8">进度</th>
                        <th width="23">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(t,index) in translist">
                        <td><input type="checkbox" :value="t.id" v-model='ids'></td>
                        <td :title="t.title">{{t.title}}</td>
                        <!-- <td>{{t.sharpness==2?'高清':(f.type ==1?'超清':'标清'}}</td>分辨率 -->
                        <td :title="t.classification">{{t.classification}}</td>
                        <td :title="t.source">{{t.source}}</td>
                        <td :title="t.status==0?t.starttime:'--'">{{t.status==0?t.starttime:'--'}}</td>
                        <td :title="t.status==0?getCurrent(t.timeconsuming):'--'">{{t.status==0?getCurrent(t.timeconsuming):'--'}}</td>
                        <td :title="t.status==0?t.rate:'--'">{{t.status==0?t.rate:'--'}}</td>
                        <td v-if="t.status==0">转码中</td>
                        <td v-if="t.status==2">等待</td>
                        <td v-if="t.status==4">停止</td>
                        <td v-if="t.status==5" class="red">失败</td>
                        <td :class="[t.status==0?'green':'']">{{t.status==0?t.schedule+'%':'--'}}</td>
                        <td style="text-align:left; padding-left:5em;">
                            <a href="javascript:void(0)" v-if="t.status==4||t.status==5" @click="startTask(2,t.id)">开始</a>
                            <a href="javascript:void(0)" v-if="t.status == 0||t.status == 2" @click="stopTask(2,t.id)">停止</a>
                            <a href="javascript:void(0)" @click="toggleDel(2,t.id);">删除</a>
                            <img src="../../../assets/system/shang.png" v-if="index != 0"  alt="" style="cursor:pointer" @click="junpTeam(t.id,1)">
                            <img src="../../../assets/system/xia.png" alt="" v-if="index != length" style="cursor:pointer" @click="junpTeam(t.id,0)">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip 
            :isShow="isDel" 
            :message="message" 
            @closeTipEvent="closeDel"
            @delObjEvent="sureOpration">
        </common-tip>
        <alert-tip :isShowtip="isShowtip" :message="mess" @closeTipEvent="closeAlert"></alert-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip";
    import alertTip from "../../alertTip"
    export default{
        data () {
             return {
                isDel:false,
                message:'',
                status:10,
                keyword:'',
                translist:[],
                length:0,
                ids:[],
                isShowtip:false,
                mess:'',
                uid:0,
                rids:[],
                md5:'',
                mdlist:[],
                timer:0,
             };
         },
        components:{CommonTip,alertTip},
        watch:{
            status:function(){
              this. getAllinfo();
            },
            ids:function(){
              if(this.ids.length < this.translist.length){
                $("#checkAll").prop("checked",false);
              }else if(this.ids.length>0&&this.ids.length==this.translist.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        mounted:function(){
            this. getAllinfo();
            var  d=localStorage.avc_info;
            if (d) {
                var info=JSON.parse(d);
                this.uid=info.uid;
            }
            var _this = this;
            this.timer = setInterval(function(){
                _this. getAllinfo();
            }, 5000);
        },
        destroyed(){
             clearInterval(this.timer);//离开组件时,清除计时器 
        },
        methods: {
            getAllinfo(){
                this.$http.get('/transcoding/GetTaskList',{
                    params:{
                        pagesize:999999,
                        pageindex:1,
                        status:this.status,
                        keyword:this.keyword
                    }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    $("#checkAll").prop("checked",false);
                    this.ids = [];
                    if(d){                       
                        if(d.msgid== 200){
                            this.translist = d.data;
                            this.length = this.translist.length-1;
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 全选
            checkAll(){
                if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.translist.length; i++){
                        this.ids.push(this.translist[i].id);
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            // 停止转码
            stopTask(type,id){
                if(type == 1){
                    if(this.ids.length < 1){
                        this.mess = "请选择要停止的任务";
                        this.isShowtip = true;
                        return
                    }
                }else{
                        this.ids = [];
                        this.ids.push(id);
                    }
                this.$http.post('/Transcoding/StopTranscoding',{
                    ids:this.ids,
                    nTimeout:10
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.ids = [];
                        if(d.msgid == 200){
                            this. getAllinfo();
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 开始转码
            startTask(type,id){
                if(type == 1){
                    if(this.ids.length < 1){
                        this.mess = "请选择要开始的任务";
                        this.isShowtip = true;
                        return
                    }
                }else{
                    this.ids = [];
                    this.ids.push(id);
                }
                this.$http.post('/transcoding/StartTranscoding',{
                    ids:this.ids,
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.ids = [];
                        if(d.msgid == 200){                           
                            this. getAllinfo();
                        }else{
                            console.log(d.msg);
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 计算耗时
            getCurrent(time){
              var i=0 , s = parseInt(time);
              var timer;
              if(s>60){
                  i=parseInt(s/60);
                  s=parseInt(s%60);
                }
                if(parseInt(i) < 10){
                  i = "0"+i
                }
                if(parseInt(s) < 10){
                  s = "0"+s
                }
                timer = i+'`'+s+'``';
                return timer;
            },
            // 搜索
            search(){
                 this. getAllinfo();
             },
            // 关闭弹出层
            closeAlert(){
                this.isShowtip = false;
            },
            // 关闭对话框
            closeDel(){
                this.isDel = false;
                this.ids = [];
            },
            // 删除事件
            toggleDel(type,id){
                 if(type==1){
                    if(this.ids.length < 1){
                        this.isShowtip = true;
                        this.mess = '请选择要删除的任务';
                        return
                    }
                    this.isDel = true;
                    this.message = '您确定删除您所选择转码任务？'
                 }else{
                    this.ids = [];
                    this.ids.push(id);
                    this.isDel = true;
                    this.message = '您确定删除该转码任务？'
                 }                
             },
            // 删除请求
            sureOpration(){
                this.$http.post('/transcoding/DeleteTask',{
                    ids:this.ids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.ids = [];
                        this.isDel = false;
                        this.isShowtip = true;
                        console.log(d)
                        if(d.msgid == 200){
                           if(d.data){
                                this.mess = '删除成功'
                                this. getAllinfo();
                            }else{
                                this.mess = '删除失败'
                            }
                        }else{
                            console.log(d.msg)
                            this.mess = '删除失败'
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 任务插队
            junpTeam(id,order){
                console.log(id,order)
                this.$http.get('/transcoding/JumpTeam',{
                   params:{
                     id:id,
                     action:order
                   }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                       if(d.msgid == 200){
                            if(d.data){
                                this. getAllinfo();
                            }else{
                                console.log(d.msg)
                            }
                       }else{
                        console.log(d.msg)
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
.queue{
        .operation{
            width:100%;
            padding:1em;
            overflow:hidden;
            .red{
                color:red;
            }
            a{
                float:left;
                width:5em;
                height:2em;
                line-height:2em;
                background-color:#0099ff;
                text-align:center !important;
                color:#fff;
                margin-top:1em;
                margin-left:1em;
                text-decoration: none;
            }

            select{
                height:2em;
                margin-top:1em;
                color:#999;
                margin-left:1em;
            }
            
        }
       
    }
</style>