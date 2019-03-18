<template>
    <div class="live-video">
        <div class="operation">
            <a href="javascript:void(0)" @click="openNew(0);">创建频道</a>
            <a href="javascript:void(0)" @click="openDel(0)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索直播频道名称" v-model="key">
                <span class='searchbtn' @click="search">搜索</span>
             </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="" style="margin-bottom:0">
                        <input type="checkbox" @click="checkAll" id="checkAll">All</label></th>
                        <th width="10">频道封面</th>
                        <th width="10">频道名称</th>
                        <th width="10">频道位置</th>
                        <th width="20">频道URL</th>
                        <th width="20">播出时间</th>
                        <th width="8">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in channels" v-if="channels">
                        <td><input type="checkbox" :value="c.id" v-model="ids"></td>
                        <!-- <img :src="c.channelcover" alt="" width="30%" > -->
                        <td v-if="c.channelcover"><span class="img-fm" v-bind:style = " { 'background-image' : 'url('+c.channelcover+')'} "></span></td>
                        <td v-else><span class="img-fm"></span></td>
                        <td :title="c.channelname">{{c.channelname}}</td>
                        <td :title="c.channelposition">{{c.channelposition}}</td>
                        <td :title="c.channelurl">{{c.channelurl}}</td>
                        <td v-if="c.startdate&&c.enddate" :title="c.startdate.substring(0,10)+' '+c.starttime+'-'+c.enddate.substring(0,10)+' '+c.endtime">{{c.startdate.substring(0,10)+' '+c.starttime+'-'+c.enddate.substring(0,10)+' '+c.endtime}}</td>
                        <td v-else>{{'-'}}</td>
                        <td :class="[c.enabled?'green':'red']">{{c.enabled?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="openNew(c.id)">编辑</a>
                            <a href="javascript:void(0)" @click="openDel(c.id)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip :isShow="isDel" :message="message" @delObjEvent="delChannel" 
        @closeTipEvent="closeTip"></common-tip>
        <new-channel  :isNew="isNew" :initdata="editmodel" :title="title" @closeEvent="closeNew" 
        @saveEvent="saveChannel" @invalidImgEvent="invalidImg">
        </new-channel>
         <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
      </alert-tip>
      <div class="pagetion">
            <el-pagination
             background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="18"
                layout="prev, pager, next"
                :total="count"
                v-show="page">
         </el-pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip"
    import NewChannel from "./NewChannel"
    import alertTip from '../../alertTip'
    export default{
        data () {
             return {
                pagesize:18,
                pageindex:1,
                name:'',
                channels:[],
                ids:[],//选中的频道数组；
                key:'',
                allchecked:false,
                //新建/编辑;
                isNew:false,
                channelid:0,
                editmodel:null,
                //删除
                isDel:false,
                message:"您确定删除该频道？",
                isdels:false,//删除多个；
                //
                //消息提示
                emsg:'',
                isError:false,
                title:'',
                count:0,
                page:true,
                currentPage:1,
             };
         },
        name:"live-video",
        components:{CommonTip,NewChannel,alertTip},
        watch:{
            'ids':{
                handler:function(val,oldVal){
                    if (this.ids.length==this.channels.length&&this.ids.length>0) {
                        $("#checkAll").prop("checked",true);
                    }else if(this.ids.length<this.channels.length){
                        $("#checkAll").prop("checked",false);
                    }
                },
                deep:true
            }
         },
        mounted:function(){
            this.getLiveChannels();
        },
        methods: {
            checkAll(){
               if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.channels.length; i++){
                        this.ids.push(this.channels[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
             closeNew(){
                this.isNew = false;
                this.ids = [];
             },
             search(){
                this.pageindex = 1;
                this.getLiveChannels();
             },
             openNew(e){
                this.channelid=e;
                this.ids = [];
                if (e>0) {
                    this.initChannel();
                    this.title = '编辑'
                }else {
                    this.editmodel=null;
                    this.title= '创建'
                }
                this.isNew = true;
             },
             getLiveChannels(){
                this.$http.get('/systemManage/getLiveChannels',{
                    params:{
                      pagesize:this.pagesize,
                      pageindex:this.pageindex,
                      name:this.key
                    }
                  }).then(res=>{
                    var d=$.parseJSON(res.data);
                    if (d.msgid!=200) {
                      this.emsg=d.msg;
                      this.isError=true;
                      return false;
                    }
                    this.channels=d.data;
                    this.count = d.count;
                    if(this.count <= 18){
                      this.page = false;
                    }else{
                      this.page = true;
                    }
                    this.ids=[];
                    $("#checkAll").prop("checked",false)
                  }).catch(err=>{
                    console.log(err);
                  })
             },
             handleCurrentChange(val){
              this.pageindex = parseInt(val);
              this.getLiveChannels();
             },
             saveChannel(id,cover,name,position,url,repeat,starttime,endtime,setdate,startdate,enddate,curriculum,enabled){
                              if(repeat==1&&(!starttime||!endtime)){
                                   this.emsg='您尚未设置开始时间或结束时间，请设置后保存!';
                                   this.isError=true;
                                  return false;
                              }
                              if(setdate==1&&(!enddate||!enddate)){
                                   this.emsg='您尚未设置开始日期或结束日期，请设置后保存!';
                                   this.isError=true;
                                  return false;
                              }else if(setdate == 1&&enddate&&enddate){
                                var st = startdate.replace(/-/g,'/');
                                var et = enddate.replace(/-/g,'/');
                              }
                              
                              if(Date.parse(st) > Date.parse(et)){
                                  this.emsg='结束日期不能小于开始日期！';
                                  this.isError=true;
                                  return false;
                              }
                                this.isNew=false;
                                this.$http.post('/systemManage/saveLiveChannel',{
                                    id:id,
                                    channelcover:cover,
                                    channelname:name,
                                    channelposition:position,
                                    channelurl:url,
                                    repeat:repeat,
                                    starttime:starttime,
                                    endtime:endtime,
                                    startday:setdate,
                                    startdate:startdate,
                                    enddate:enddate,
                                    curriculum:curriculum,
                                    enabled:enabled
                                  }).then(res=>{
                                    var  d=$.parseJSON(res.data);
                                    if (d.msgid!=200) {
                                       this.emsg=d.msg;
                                       this.isError=true;
                                      return false;
                                    }

                                    if (id==0) {
                                       this.emsg="添加成功";
                                    }else{
                                       this.emsg="修改成功";
                                    }
                                    this.isError=true;
                                    this.getLiveChannels();
                                  }).catch(err=>{
                                    console.log(err);
                                  })
             },
             invalidImg(){
                  this.emsg='建议尺寸为220*130的JPG或PNG图片，小于2MB';
                  this.isError=true;
             },
             initChannel(){
                   this.$http.get('/systemManage/getLiveChannelById',{
                    params:{
                        id:this.channelid
                    }
                  }).then(res=>{
                    var  d=$.parseJSON(res.data);
                    if (d.msgid!=200) {
                      console.log(d.msg);
                      return false;
                    }

                    this.editmodel=d.data;
                  }).catch(err=>{
                    console.log(err);
                  })
             },
             openDel (e) {
                if (e==0) {
                    if(this.ids.length < 1){
                      this.emsg='请选择删除条目';
                      this.isError=true;
                    }else{
                      this.isDel = true;
                      this.message='您确定要删除所选的频道?';
                    } 
                }else{
                    this.ids = [];
                    this.ids.push(e);
                    this.isDel = true;
                    this.message='您确定要删除该频道?';
                    this.isdels=false;
                }
             },
             closeTip(){
                this.isDel=false;
                this.ids = [];
             },
             delChannel(){
                this.isDel=false;
                this.$http.post('/systemManage/deleteLiveChannel',{
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

                    this.emsg='删除成功';
                    this.isError=true;
                    this.pageindex = 1;
                    this.currentPage = 1;
                    this.getLiveChannels();
                  }).catch(err=>{
                    console.log(err);
                  })
             }
         }
    }
</script>
<style lang="scss">
.live-video{
        .operation{
            width:100%;
            padding:1em;
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
          .img-fm{
              display:inline-block;
              width:3em;
              height:2em;
              position:relative;
              top:0.5em;
              background-size:contain;
              background-repeat:no-repeat;
              background-position:center center;
              background-image:url("../../../assets/live/u175.png");
            }
        }
    }
</style>