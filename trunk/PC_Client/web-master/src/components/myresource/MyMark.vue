<template>
        <div class="my-mark">
                    <div class="res-top">
                        <p style="font-size:1.2em;">
                            <span>我的标注记录</span>
                      </p>
                        <p class="sear-in">
                            <input type="type" v-model="title" placeholder="搜索我的标注记录.." />
                            <span class="searbth" @click="getAllMarks">搜索</span>
                         </p>
                        <div class="last">
                            <label for="chbAll">
                                <input type="checkbox" id="chbAll" @click="checkAll">全选
                            </label>
                            <a v-if="_dels" href="javascript:void(0)" class="delete" @click="delMarks(0)">删除</a>
                        </div>
                    </div>
                    <div class="res-bottom">
                         <div class="excel">
                                <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                                    <thead>
                                        <tr>
                                            <th width="30">资源名称</th>
                                            <th width="10">标注数量</th>
                                            <th width="10">状态</th>
                                            <th width="20">修改时间</th>
                                            <th width="30">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(m,i) in marks">
                                            <td v-if="m.rtid == 2">
                                                        <label :for="'input'+i">
                                                                <input type="checkbox" :id="'input'+i" v-model="ids" :value="m.resid">
                                                                <span class="img-s img-big voice-s"></span>
                                                                <span class="text" :title="m.title">{{m.title.length>20?m.title.substr(0,20)+'...':m.title}}</span>
                                                        </label>
                                           </td>
                                           <td v-if="m.rtid == 1">
                                                        <label :for="'input'+i">
                                                                <input type="checkbox" :id="'input'+i" v-model="ids" :value="m.resid">
                                                                <span v-if="m.pic" class="img-s img-big" v-bind:style = "{ 'background-image' : 'url('+m.pic+')'}"></span>
                                                                <span v-else class="img-s img-big"></span>
                                                                <span class="text" :title="m.title">{{m.title.length>20?m.title.substr(0,20)+'...':m.title}}</span>
                                                        </label>
                                           </td>
                                            <td>{{m.markcount}}</td>
                                            <td :class="getClassName(m.status)">{{getStatus(m.status)}}</td>
                                            <td>{{m.createtime}}</td>
                                            <td>
                                                    <span class="submit" v-if="_submit&&m.status==0" @click="submit(m.resid)">提交</span>
                                                    <span class="eidt" v-if="_edit&&m.status!=2&&m.status!=1" @click="edit(m.resid,m.rtid)">编辑</span>
                                                    <span class="td-del" v-if="_delete&&m.status!=2&&m.status!=1" @click="delMarks(m.resid)">删除</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div>
                    <common-tip :isShow="showDel" :message="message" @delObjEvent="confirm" @closeTipEvent="closeDel"></common-tip> 
                    <el-pagination background layout="prev, pager, next" :total="total" :current-page.sync="pageindex"
                    :page-size="pagesize" v-if="total>pagesize">
                    </el-pagination>
                    <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
        </alert-tip>                  
            </div>
</template>
<script  type="text/ecmascript-6">
        import CommonTip from "../CommonTip"
        import alertTip from '../alertTip'
        import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js' 
        export default {
                        name:"my-mark",
                        data(){
                            return{
                                isOrder:false,
                                // allChecked:false,
                                pagesize:20,
                                pageindex:1,
                                title:'',
                                // defaultImg:'this.src="'+require('../../assets/videoPlay/pin.png')+'"',
                                marks:[],
                                ids:[],
                                mid:0,//删除单条记录的id;
                                total:0,
                                //确认框
                                message:'你确定要删除该条标注记录?',
                                showDel:false,
                                optype:0,//0删除、1提交
                                //提示
                                emsg:'',
                                isError:false,
                            }
                        },
                        components:{CommonTip,alertTip},
                        computed: {
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/mymark');
                            },
                            _dels:function(){
                                return handleAuth(124,this.handles);
                            },
                            _submit:function(){
                                return handleAuth(125,this.handles);
                            },
                            _edit:function(){
                                return handleAuth(126,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(127,this.handles);
                            }
                        },
                        watch:{
                            'ids':{
                                handler:function(val,oldVal){
                                    if (this.marks.length > this.ids.length) {
                                        $("#chbAll").prop("checked",false)
                                    }else if(this.marks.length>0&&this.marks.length == this.ids.length){
                                        $("#chbAll").prop("checked",true)
                                    }
                                }
                            },
                         },
                        mounted:function(){
                            this.getAllMarks();
                        },
                        methods:{
                            toogleOrder(){
                                this.isOrder = !this.isOrder
                            },
                            getAllMarks(){
                                    this.$http.get('/myResources/GetMarks',{
                                        params:{
                                            pagesize:this.pagesize,
                                            pageindex:this.pageindex,
                                            uid:this.uid,
                                            title:this.title
                                        }
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            if (d.msgid==200) {
                                                this.marks=d.data;
                                                console.log(this.marks)
                                                this.total=d.count;
                                                this.ids=[];
                                                for(let i=0;i<this.marks.length;i++){
                                                        let info=this.marks[i];
                                                        if(info.rtid==1){
                                                                info.pic=require('../../assets/module/shipinmoren.png');
                                                                this.$http.get('/storage/getfilepath',{
                                                                    params:{
                                                                        fileid:info.md5
                                                                    }
                                                                }).then(res=>{
                                                                        var d=$.parseJSON(res.data);
                                                                        if (d.msgid==200&&d.data) {
                                                                            var _d=JSON.parse(d.data); 
                                                                            var addr=_d.file_addr;
                                                                            if (addr) {
                                                                               var  pic=addr+'.jpg';
                                                                               var img=new Image();
                                                                               img.src=pic;
                                                                               img.onload=function(){
                                                                                      info.pic=pic;
                                                                               };
                                                                            }
                                                                        } 
                                                                });
                                                        }
                                                  }
                                            }else{
                                                this.emsg=d.msg;
                                                this.isError=true;
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                   });
                            },
                            getStatus(num){
                                var str='';
                                switch(num){
                                    case 0:
                                        str='未提交';
                                        break;
                                    case 1:
                                        str='审核中';
                                        break;
                                    case 2:
                                        str='审核中';
                                        break;
                                    case 3:
                                        str='审核通过';
                                        break;
                                    case 4:
                                        str='审核失败';
                                        break;
                                    default:
                                        str='未提交';
                                        break;
                                }
                                return str;
                            },
                            getClassName(num){
                                var classname='';
                                switch(num){
                                    case 0:
                                        classname='';
                                        break;
                                    case 1:
                                        classname='orange';
                                        break;
                                    case 2:
                                        classname='orange';
                                        break;
                                    case 3:
                                        classname='green';
                                        break;
                                   case 4:
                                        classname='red';
                                        break;
                                }
                                return classname;
                            },
                           checkAll(){
                                var _this=this;
                                if($("#chbAll").prop("checked")){
                                     _this.ids=[];
                                    _this.marks.forEach(function(item){
                                        _this.ids.push(item.resid);
                                    });
                                    
                                }else{
                                  _this.ids=[]; 
                               }
                          },
                          submit(id){
                                this.message='您确定提交该标注记录吗?';
                                this.showDel=true;
                                this.mid=id;
                                this.optype=0;
                          },
                          submitMarks(){
                                  this.$http.post('/myResources/SubMarks',{
                                            rid:this.mid,
                                            uid:this.uid
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            if (d.msgid==200) {
                                                this.emsg='提交成功';
                                                this.showDel=false;
                                            }else{
                                                this.emsg=d.msg;
                                            }
                                            this.isError=true;
                                            this.getAllMarks();
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                   });
                          },
                          confirm(){
                            if(this.optype==0){
                                this.submitMarks();
                            }else{
                                this.deleteMarks();
                            }
                          },
                          edit(id,rtid){
                                if (rtid==1) {//这里的类型只有音、视频；
                                    this.$router.push({'path':'/resource/video/detail',query:{id:id} });
                                }else{
                                    this.$router.push({'path':'/resource/audio/detail',query:{id:id} });
                                }
                          },
                          deleteMarks(){
                                    var arr=[];
                                    this.showDel=false;
                                    if(this.optype==3){
                                        arr.push(this.mid);
                                    }else{
                                        arr=this.ids;
                                        for(var i=0;i<this.marks.length;i++){
                                            var m=this.marks[i];
                                            if(arr.contain(m.resid)&&(m.status==1||m.status==2)){
                                                arr.removevalue(m.resid);
                                            }
                                        }
                                        if(arr.length == 0){
                                             this.isError=true;
                                             this.emsg='审核中标注不允许删除';
                                             return
                                        }
                                    }
                                    this.$http.post('/myResources/DeleteMarks',{
                                            uid:this.uid,
                                            rids:arr
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            this.showDel=false;
                                            if (d.msgid==200) {
                                                this.emsg='删除成功';
                                                this.ids = [];
                                                this.getAllMarks();
                                            }else{
                                                this.emsg=d.msg;
                                            }
                                            this.isError=true;
                                            this.getAllMarks();
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                   });
                          },
                          delMarks(id){
                                if (id==0) {
                                    if(this.ids.length < 1){
                                        this.isError=true;
                                        this.emsg='请选择删除条目';
                                        this.optype=2;//删除所有；
                                        return
                                    }
                                    this.message='你确定删除选择的标注记录?';
                                   this.optype=1;//删除所选项；
                                }else{
                                    this.message='你确定删除该标注记录?';
                                    this.mid=id;
                                    this.ids.push(id);
                                    this.optype=3;
                                }
                                this.showDel=true;
                          },
                          closeDel(){
                                this.showDel=false;
                                this.ids = [];
                          },
                }
        }
</script>
<style lang="scss">
        .my-mark{
                height:73em;
                        width:80%;
                        float:left;
                        background:url("../../assets/module/u10.png") no-repeat;
                        background-size:100% 100%;
                        position:absolute;
                        left:20%;
                        top:0;
                        padding:2em;
                    .res-top{
                            overflow:hidden;
                            border-bottom:1px dashed #ffffff;
                             .sear-in{
                                width:38%;
                                height:4em;
                                float:right;
                                background:url("../../assets/module/u2098serch.png") no-repeat;
                                background-size:100% 100%;
                                margin-top:3em;
                                margin-right:2em;
                                position:relative;            
                                input{
                                  width:80%;
                                  height:2.5em;
                                  margin:0.5em 1em;
                                  background-color:#1c1f1f;                               
                                  border-radius:5px;                              
                                }
                                 .searbth{
                                  position:absolute;
                                  right:1em;
                                  top:0.5em;
                                  height:2.5em;
                                  line-height:2.5em;
                                  // width:10%;
                                  background-image:url("../../assets/module/u2100.png");
                                  background-size:50%;
                                  background-repeat:no-repeat;
                                  background-position:left center;
                                  text-align:right;
                                  cursor:pointer;
                                  padding-left:6%;
                                 }
                            }

                            p{
                                width:59%;
                                height:auto;
                                margin-top:1em;
                                margin-bottom:2em;
                                display:inline-block;

                                a{
                                    color:#fff;
                                     text-decoration: none;
                                     margin-right:1em;
                                     border-radius:3px;
                                     padding:0.6em 2em;
                                     background-repeat:no-repeat;
                                     background-position:5px center;
                                }                               
                                
                            }
                            .last{ 
                                margin-bottom:2em;                              
                                label{
                                    margin-left:1em;

                                    input{
                                            position:relative;
                                            top:1px;
                                            left:-1em;
                                    }
                                }

                                .delete{
                                                width:4em;
                                                height:2em;
                                                background-color:#0099ff;
                                                border-radius:5px;
                                                line-height:2em;
                                                text-align:center;
                                                display:inline-block;
                                                color:#fff;
                                                margin-left:2em;
                                        }
                                }
                            }
                        .res-bottom{
                            width:100%;
                            height:auto;
                            padding-top:2em;
                            tr{
                                height:5em !important;
                                line-height:5em !important;
                            }

                            td:last-child{
                                text-align:right;
                                padding-right:2em;
                                box-sizing:border-box;
                            }
                          tr,th,td{
                                background:none !important;
                                border:none !important;
                            }

                            td{
                                height:3em;
                                overflow:hidden;
                                label{
                                        position:relative;
                                        top:0.5em !important; 
                                        input{
                                            top:-1.2em !important;
                                        }
                                        .img-s{
                                                top:0.4em !important;
                                        }
                                        .img-big{
                                            width:5em !important;
                                            height:5em !important;
                                            background-image:url("../../assets/module/shipinmoren.png");
                                            background-repeat:no-repeat;
                                            background-position:center center;
                                            background-size:contain;
                                        }
                                        .text{
                                            top:0.8em !important;
                                        }
                                }

                            }

                        }
        }
</style>