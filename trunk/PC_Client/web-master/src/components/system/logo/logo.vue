<template>
    <div class="logo-set">
        <h1>LOGO设置</h1>
        <div class="operation">
            <a href="javascript:void(0)" @click="openNew(1)">新建</a>
            <p    ></p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10">缩略图</th>
                        <th width="10">logo名称</th>
                        <th width="20">备注</th>
                        <th width="10">状态</th>
                        <th width="15">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                          <span class="logo-pic">
                            <img src="../../../assets/module/u2160.png" alt="" width="100%">
                          </span>
                        </td>
                        <td>TFAVCC</td>
                        <td>中国教育信息化的领航者</td>
                        <td class="gray">默认</td>
                        <td></td>
                    </tr>
                    <tr v-for="l in logolist">
                        <td>
                          <span class="logo-pic logoavatar" v-bind:style = " { 'background-image' : 'url('+l.logo+')'} ">
                          </span>
                        </td>
                        <td :title="l.name">{{l.name}}</td>
                        <td :title="l.remark">{{l.remark}}</td>
                        <td :class="[l.enable===1?'green':'red']">{{l.enable==1?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="openNew(2,l)">编辑</a>
                            <a href="javascript:void(0)" @click="del(l)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <new-logo 
            :isNew="isNew" 
            :logoinfo = "logoinfo"
            :ntype="ntype"
            @closeEvent="close"
            @saveEvent="saveLogo">
        </new-logo>
        <alert-tip 
            :isShowtip="isShowtip" 
            :message="mess" 
            @closeTipEvent="closeAlert">
        </alert-tip>
        <common-tip 
            :isShow="isShow" 
            :message="message"
            @closeTipEvent="closetip"
            @delObjEvent="sureOpration"></common-tip>
    </div>
</template>

<script type="text/ecmascript-6">
  import NewLogo from "./NewLogo";
  import alertTip from "../../alertTip";
  import CommonTip from "../../CommonTip"
    export default{
        data(){
          return{
            isNew:false,
            logolist:[],
            isShowtip:false,
            isShow:false,
            message:'',
            mess:'',
            lid:0,
            avatar:'',
            name:'',
            discription:'',
            enable:'',
            type:1,
            ntype:'',
            logoinfo:null,
            oldenable:'',
            enableList:[],
          }
        },
        components:{NewLogo,alertTip,CommonTip},
        mounted:function(){
            this.GetLogos();
        },
        methods:{
            // 获取所有的LOGO信息
            GetLogos(){
                this.$http.get('/systemManage/GetLogos',{
                    params:{}
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        if(d.msgid == 200){
                            this.logolist = d.data;
                            console.log(this.logolist)
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 新建或者编辑
            saveLogo(name,discription,enable,avatar){ 
                this.enableList = [];
                this.type = 1;
                this.avatar = avatar;
                this.name = name;
                this.discription = discription;
                this.enable = enable;  
                if(this.oldenable == 1&&enable==0){
                        this.isShow = true;
                        this.message = '您确定禁用该LOGO吗？';
                        return;
                }
                if(enable==1){
                    if(this.logolist.length >= 1){
                        for(var i = 0; i < this.logolist.length; i++){
                            this.enableList.push(this.logolist[i].enable)
                        }
                        if(this.enableList.indexOf(1) != -1){
                            this.isShow = true;
                            this.message = '您确定启用该LOGO吗？启用后原先的LOGO将会被取代';
                            return;
                        }else{
                            this.isShow = true;
                            this.message = '您确定启用该LOGO吗？';
                            return;
                        }
                    }
                }
                this.savaNewLogo();
            },
            // 新增或者编辑请求
            savaNewLogo(){
                this.$http.post('/systemManage/SaveLogo',{
                    id:this.lid,
                    logo:this.avatar,
                    name:this.name,
                    remark:this.discription,
                    enable:this.enable
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isNew = false;
                        if(d.msgid == 200){
                            if(this.ntype == '创建'){
                                this.isShowtip = true;
                                this.mess = "创建成功"
                            }else{
                                this.isShowtip = true;
                                this.mess = "编辑成功"
                            }
                            this.GetLogos();
                            // if(this.enable){
                            //     var parms={
                            //         id:this.lid,
                            //         logo:this.avatar,
                            //         name:this.name,
                            //         remark:this.discription,
                            //         enable:this.enable
                            //     };
                            //     this.$store.commit('setLogo',parms);
                            // }else{
                            //     // this.$store.commit('setLogo',{});

                            // }
                            this.getEnableLogo();                            
                        }else{
                                this.isShowtip = true;
                                this.mess = d.msg
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            getEnableLogo(){
                this.$http.get('/systemManage/GetEnableLogo',{
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        if(d.msgid == 200){
                            this.$store.commit('setLogo',d.data);
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 编辑或创建弹窗
            openNew(type,l){
              if(type == 1){
                this.ntype = '创建';
                this.logoinfo = null;
                this.lid = 0;
              }else{
                this.ntype = '编辑';
                this.logoinfo = l;
                this.lid = l.id;
                this.oldenable = l.enable;
              }
              this.isNew = true;
            },
            // 关闭编辑或者创建
            close(){
              this.isNew = false;
            },
            // 关闭提示窗
            closeAlert(){
                this.isShowtip = false;
            },
            // 关闭对话框
            closetip(){
                this.isShow = false;
            },
            // 对话框确认操作
            sureOpration(){
                if(this.type == 1){
                    this.savaNewLogo();
                    this.isShow = false;
                }else{
                    this.deleteLogo();
                    this.isShow = false;
                }
            },
            // 删除弹窗
            del(l){
                this.lid = l.id;
                this.type = 2;
                if(l.enable == 1){
                    this.mess="请先禁用该LOGO，再尝试删除操作！";
                    this.isShowtip = true;
                }else{
                    this.message="您确定删除该LOGO吗？";
                    this.isShow = true;
                }
            },
            // 删除请求
            deleteLogo(){
                // console.log(this.lid)
                this.$http.post('/systemManage/DeleteLogo',{
                    id:this.lid
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        if(d.msgid == 200){
                            this.mess="删除成功";
                            this.isShowtip = true;
                            this.GetLogos();
                        }else{
                            this.mess= d.msg;
                            this.isShowtip = true;
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
.logo-set{
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
        .gray{
          color:#666666;
        }
        .red{
            color:red;
        }
        .green{
            color:green;
        }
        .excel{
            height:64em !important;
            overflow-y:auto;
        }
        h1{
            font-size:1.4em;
            margin:0;
            height:3em;
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

            p{
                width:40%;
                height:4em;
                float:right;
                margin: 0 auto;
            }
        }
        .excel{
          td:first-child,th:first-child{
            text-align:center !important;
            .logo-pic{
              width:3em;
              height:2em;
              display:inline-block;
              position:relative;
              background-size:contain;
              background-repeat:no-repeat;
              background-position:center center;
            }
            .logoavatar{
                top:0.5em;
            }
          }
        }
    }
</style>