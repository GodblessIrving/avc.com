<template>
        <div class="my-video">
                <div class="res-top">
                        <p class="audio-opration">
                            <a v-if="_upload" href="javascript:void(0)" class="blue up" @click="toggleUp">上传</a>
                            <a v-if="_move" href="javascript:void(0)" class="blue-none move" data-num="move" 
                            @click="toggleBlock($event)">移动到</a>
                            <a v-if="_copy" href="javascript:void(0)" class="blue-none res-copy"  data-num="copy" @click="toggleBlock($event)">复制到</a>
                            <a v-if="_delete" href="javascript:void(0)" class="blue-none del" @click="showTip">删除</a>
                            <a v-if="_download" href="javascript:void(0)" class="blue-none down" @click="downLoad">下载</a>
                            <a v-if="_share" href="javascript:void(0)" class="blue-none share" @click="share">分享</a>
                            <a v-if="_play" href="javascript:void(0)" class="blue-none onplay" @click="goToPlay()">播放</a>
                            <a v-if="_public" href="javascript:void(0)" class="blue-none own" @click="ownAudiofile()">私有</a>
                            <a v-if="_public" href="javascript:void(0)" class="blue-none open" @click="openAudiofile()">公开</a>
                            <a href="javascript:void(0)" class="blue-none edit" @click="edit">编辑</a>
                        </p>
                        <div class="last">
                            <label for="checkAll" style="cursor:pointer"><input type="checkbox"  id="checkAll" @click="checkAll">全选</label>
                            <a href="javascript:void(0)" :class="[isA?'type-table':'type']" @click="toggle">
                            </a>
                            <div class="order">
                                <span class="order-inner" @click="toogleOrder()"></span>
                                <div class="order-div">
                                    <ol class="order-li">
                                        <li @click="changeOrder(0)">按文件名</li>
                                        <li @click="changeOrder(1)">按大小</li>
                                        <li @click="changeOrder(2)">按修改时间</li>
                                    </ol>
                                </div>
                            </div>
                             <span class="up-video" @click="toggleNew()"></span>
                        </div>
                    </div>
                    <div class="res-bottom">
                        <ol class="show-li" v-show="isA">
                            <li v-for="v in videoArray" @click="addChose($event)" :data-id="v.resid" class="lis" :value="v.resid">
                                 <div>
                                 <template v-if="v.status==0">
                                        <p class="img" v-if="v.thumbnail" v-bind:style="{ 'background-image' : 'url('+v.thumbnail+')'}"></p> 
                                        <p v-else class="img"></p>
                                        <em>{{getCurrent(v.duration)}}</em>  
                                 </template>
                                 <p v-else  class="img" :class="$parent.getTransCodingStatus(v.rtid,v.status)"></p> 
                                        <p :title="v.restitle">{{v.restitle}}</p>
                                        <p class="file-op" v-if="v.status==2"><span style="width:4em" @click="$parent.retranscoding(v.resid)">重新转码</span><span class="icon-start"></span></p>
                                </div>
                                <p class="instruction">
                                        <span class="left"
                                        :class="[v.type == 2?'compositing':(v.type==1?'up-s':'collect-video')]">
                                        {{v.type ==2?'合成视频':(v.type==1?'上传视频':'收藏视频')}}</span>
                                        <span class="s-right" :class="[v.public==1?'open-s':'own-s']">{{v.public==1?'公开':'私有'}}</span>
                                </p>
                            </li>
                            <li v-for="u in uploadings" v-show="u.status!=4&&u.status!=5">
                                <div>
                                <p class="img" :class="$parent.getUploadingStatus(u.rtid,u.status)"></p>
                                <p class="file-op" v-if="u.status==2">
                                    <span style="width:4em" @click="$parent.continue1(u.inx)">继续上传</span>
                                    <span class="icon-start"></span>
                                </p>
                                <p :title="u.filename">{{u.filename}}</p>
                                </div>
                            </li>
                        </ol>
                         <div class="excel" v-show="!isA">
                                <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                                    <thead>
                                        <tr>
                                            <th>视频名称</th>
                                            <th>分类</th>
                                            <th>来源</th>
                                            <th>时长</th>
                                            <th>大小</th>
                                            <th>修改时间</th>
                                            <th>视频类型</th>
                                            <th>公开私有</th>
                                            <th>状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="f in videoArray">
                                            <td :value="f.resid">
                                                <label for="f.resid">
                                                    <input type="checkbox" :id="f.resid" :value="f.resid" v-model="ids"/>
                                                    <span class="img-s blue-s"></span>
                                                    <span class="text" :title="f.restitle">{{f.restitle}}</span>
                                                </label>
                                            </td>
                                            <td>{{f.classname?f.classname:'--'}}</td>
                                            <td>{{f.sourcename?f.sourcename:'--'}}</td>
                                            <td>{{getCurrent(f.duration)}}</td>
                                            <td>{{getSize(f.size)}}MB</td>
                                            <td :title="f.rescreatetime">{{f.rescreatetime}}</td>
                                            <td>{{f.type ==2?'合成视频':(f.type ===1?'上传视频':'收藏视频')}}</td>
                                            <td>{{f.public===1?'公开':'私有'}}</td>
                                            <td>{{$parent.getTransCodingTitle(f.status)}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div> 
                    <move-to :isBlock="isBlock" 
                                    :message="message"
                                    :resType="1"  
                                    @closeNewEvent="closeBlock"
                                    v-on:child-say="listenTomove">
                    </move-to>
                    <common-tip :isShow="isShow"
                                         :message="mess" 
                                         @closeTipEvent="closeTip" 
                                         @delObjEvent="deleteVideo()">
                    </common-tip>
                    <alert-tip :isShowtip="isShowtip" 
                                   :message="messa" 
                                   @closeTipEvent="closeAlertTip()">
                    </alert-tip>  
                    <!-- <el-pagination
                             background
                             @current-change="handleCurrentChange"
                             :current-page.sync="currentPage"
                             :page-size="20"
                             layout="prev, pager, next"
                             :total="count"
                             v-show="page">
                     </el-pagination>  -->   
                </div>
            </div>
</template>
<script  type="text/ecmascript-6">
        import moveTo from "./moveTo"
        import CommonTip from "../CommonTip"
        import alertTip from "../alertTip"
        import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
        import {oDownLoad} from '../../scripts/download.js' 
        $(document).click(function(){  
           $(".order-div").css("display","none");
           $(".order-div").removeClass('linav');
        });
        export default {
                name:"my-audio",
                        data(){
                            return{
                                isOrder:false,
                                isA:true,
                                isBlock:false,                                                          
                                title:'', 
                                allChecked:false,                               
                                messTitle:'视频',
                                treeId:[],
                                ids:[],
                                currentPage:1,
                                page:false,
                                count:0,
                                floderId:'',
                                floders:[],
                                videoArray:[],
                                classList:[],
                                message:"",
                                islock:false,
                                isShow:false,
                                isShowtip:false,
                                mess:"",
                                messa:'',                               
                                val:'', 
                                orderby:0, 
                                keywords:'',    
                                type:0,    
                                md5:'', 
                                restitle:'', 
                                //上传中
                                uploadings:[],      
                                pagesize:20,
                                pageindex:1,             
                            }
                        },
                        watch:{
                            ids:function(newval,oldval){
                                if(this.ids.length==0){
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.up").addClass('blue').removeClass('blue-none');
                                }else if(this.ids.length==1){
                                    $(".audio-opration a").addClass('blue').removeClass('blue-none');
                                    $("a.up").addClass('blue-none').removeClass('blue');
                                    for(var i = 0; i < this.videoArray.length; i++){
                                        if(this.videoArray[i].resid == this.ids[0]){
                                            if(this.videoArray[i].public == 1){
                                                $("a.open").addClass('blue-none').removeClass('blue');
                                            }else{
                                                $("a.own").addClass('blue-none').removeClass('blue');
                                            }
                                        }
                                    }
                                }else{
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.move").addClass('blue').removeClass('blue-none');
                                    $("a.res-copy").addClass('blue').removeClass('blue-none');
                                    $("a.del").addClass('blue').removeClass('blue-none');
                                    $("a.own").addClass('blue').removeClass('blue-none');
                                    $("a.open").addClass('blue').removeClass('blue-none');
                                }
                                if (this.ids.length>0&&this.videoArray.length==this.ids.length) {
                                    $("#checkAll").prop("checked",true);
                                }else if(this.ids.length<this.videoArray.length){
                                    $("#checkAll").prop("checked",false);
                                }
                            }
                        },
                        components:{moveTo,CommonTip,alertTip},
                        computed:{
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/myvideo');
                            },
                            _upload:function(){
                                return handleAuth(62,this.handles);
                            },
                            _move:function(){
                                return handleAuth(63,this.handles);
                            },
                            _copy:function(){
                                return handleAuth(64,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(65,this.handles);
                            },
                            _download:function(){
                                return handleAuth(66,this.handles);
                            },
                            _share:function(){
                                return handleAuth(67,this.handles);
                            },
                            _play:function(){
                                return handleAuth(68,this.handles);
                            },
                            _public:function(){
                                return handleAuth(69,this.handles);
                            },
                        },
                        beforeMount:function(){
                            this.getVideoFile();
                        },
                        methods:{
                            // 获取我的资源里面所有的视频文件
                            getVideoFile(){
                                this.$http.get('/MyResources/GetMyFiles',{
                                    params:{
                                        uid:this.uid,
                                        rtid:1,
                                        orderby:this.orderby,
                                        keywords:this.keywords,
                                        pageindex:1,
                                        pagesize:99999,
                                    }
                                }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            this.ids=[];
                                            $("#checkAll").prop("checked",false);
                                            if (d.msgid==200) {
                                                 this.videoArray=d.data;
                                                 this.count = d.count;
                                                 this.getUploading();
                                                 this.$emit('changeSize');
                                                 if(this.count <= 20){
                                                    this.page = false;
                                                 }else{
                                                    this.page = true;
                                                 }
                                                 $('.choseSure').remove();
                                                 for(let i=0;i<this.videoArray.length;i++){
                                                    let info=this.videoArray[i];
                                                    this.$http.get('/storage/getfilepath',{
                                                        params:{
                                                            fileid:info.md5
                                                        }
                                                    }).then(res=>{
                                                            if(res){
                                                                var d=$.parseJSON(res.data);
                                                            if (d.msgid==200) {
                                                                if(d.data){
                                                                    var json=JSON.parse(d.data); 
                                                                    var addr=json.file_addr;
                                                                        if (addr) {
                                                                           var  pic=addr+'.jpg';
                                                                           var  path=addr+'.json';
                                                                           var img=new Image();
                                                                           img.src=pic;
                                                                           img.onload=function(){
                                                                                info.thumbnail=pic;//只有图片有值(数组),其他都为null
                                                                           };                                                              
                                                                        }
                                                                    }
                                                                } 
                                                            }
                                                       });
                                                    }
                                            }else{
                                                console.log(d.msg);
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                            },
                            share(){
                                if($("a.share").hasClass('blue-none')){
                                    return
                                }
                                this.messa = "该功能正在开发中";
                                this.isShowtip = true;
                                this.ids = [];
                                $(".choseSure").remove();
                            },
                            downLoad(){
                                if($("a.down").hasClass('blue-none')){
                                    return
                                }
                                for(var i = 0; i < this.videoArray.length; i++){
                                    if(this.videoArray[i].resid == this.ids[0]){
                                        this.md5 = this.videoArray[i].md5
                                    }
                                }
                                this.$http.get('/storage/getfilepath',{
                                        params:{
                                            fileid:this.md5
                                        }
                                    }).then(res=>{
                                            var d=$.parseJSON(res.data);
                                            if (d.msgid==200) {
                                                var json=JSON.parse(d.data); 
                                                var addr=json.file_addr;
                                                if(addr){
                                                   oDownLoad(addr);
                                                }
                                            } 
                                    });
                                }, 
                            getCurrent(time){
                                var duration='00:00';
                                var sec=0,min=0;
                                if(time){
                                    sec=time%60;
                                    min=(time-sec)/60;
                                    duration=(min>9?min:'0'+min)+':'+(sec>9?sec:'0'+sec);
                                }
                                return duration;
                            },
                            getSize(size){
                                var num = Math.pow(1024,2);
                                var a = size/num;
                                return a.toFixed(2);
                            },
                            // 数组去重
                            unique(arr){
                                var result = [], hash = {};
                                for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                                    if (!hash[elem]) {
                                        result.push(elem);
                                        hash[elem] = true;
                                    }
                                }
                                return result;
                            },
                            changeOrder(val){
                                this.orderby=val;
                                $(".order-div").css("display","none");
                                $(".order-div").removeClass('linav');
                                this.getVideoFile();
                            },
                            checkAll(){
                                if($("#checkAll").prop("checked")){
                                    this.ids = [];
                                    for(var i = 0; i < this.videoArray.length; i++){
                                        this.ids.push(this.videoArray[i].resid)
                                    }                                    
                                    var span = `<span class="choseSure"></span>`;
                                    $(".show-li li").append(span);
                                }else{
                                    this.ids = [];
                                    $(".choseSure").remove();
                                }
                            },
                            // 当前音频文件列表状态的选中效果
                            addChose(e){
                                var dom = e.currentTarget;
                                //防止点击重新转码出现选中的样式;
                                if(e.target.innerText!=""){
                                    return false;
                                }

                                var vid = $(dom).data("id");
                                var id = parseInt(vid);

                                    if($(dom).children(".choseSure").length){
                                        $(dom).children(".choseSure").remove();
                                        this.ids.splice(jQuery.inArray(id,this.ids),1);
                                    }else{
                                        var span = `<span class="choseSure"></span>`;
                                        $(dom).append(span);
                                        this.ids.push(id);
                                    }                               
                            },
                            // 删除选中的视频文件
                            deleteVideo(){
                                if(this.type == 3){
                                    this.$http.post('/MyResources/DeleteFoldersOrResources',{                              
                                        resid:this.ids,
                                        foid:[],
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                                if (d.msgid==200) {
                                                    this.isShow = false,
                                                    this.messa = "删除成功";
                                                    this.isShowtip = true;
                                                    this.ids=[];
                                                    $(".choseSure").remove();
                                                    this.getVideoFile();
                                                }else{
                                                    console.log(d.msg)
                                                }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                }else if(this.type == 2){
                                    this.Setopen();
                                }else{
                                    this.Setown();
                                }
                            },
                            // 设置文件私有
                            ownAudiofile(){
                                if($("a.own").hasClass('blue-none')){
                                    return
                                }else{
                                    this.isShow = true;
                                    this.type = 1;
                                    this.mess = '您确定将所选择的视频设置为私有吗？';
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.own").addClass('blue').removeClass('blue-none');
                                }
                            },
                            Setown(){
                                this.$http.post('/MyResources/ChangeFileScope',{
                                        uid:this.uid,
                                        resid:this.ids,
                                        public:0
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        this.isShow = false;
                                        if (d.msgid==200) {
                                                this.messa = "设置私有成功";
                                                this.isShowtip = true;
                                                this.ids=[];
                                                $(".choseSure").remove();
                                                this.getVideoFile();
                                        }else{
                                            console.log(d.msg)
                                        }
                                    }
                               }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // 设置文件公开
                            openAudiofile(){
                                if($("a.open").hasClass('blue-none')){
                                    return
                                }else{
                                    this.isShow = true;
                                    this.type = 2;
                                    this.mess = '您确定将所选择的视频设置为公开吗？';
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.open").addClass('blue').removeClass('blue-none');
                                }
                            },
                            Setopen(){
                                this.$http.post('/MyResources/ChangeFileScope',{
                                        uid:this.uid,
                                        resid:this.ids,
                                        public:1
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        this.isShow = false;
                                        if (d.msgid==200) {
                                                this.messa = "设置公开成功";
                                                this.isShowtip = true;
                                                $(".choseSure").remove();
                                                this.ids=[];
                                                $(".choseSure").remove();
                                                this.getVideoFile();
                                        }else{
                                            console.log(d.msg)
                                        }
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            //排序控件的出现和隐藏
                            toogleOrder(){
                                if($(".order-div").hasClass('linav')){
                                    $(".order-div").css("display","none");
                                    $(".order-div").removeClass('linav');
                                }else{
                                    $(".order-div").css("display","block");
                                    $(".order-div").addClass('linav');
                                };
                                event.stopPropagation();  
                            },                           
                            // 列表状态和表格状态的切换
                            toggle(){
                                this.isA = !this.isA;
                                this.ids = this.unique(this.ids);
                                if(this.isA){
                                    if(this.ids.length){
                                        for(var i = 0; i < this.ids.length; i++){
                                            var sid = this.ids[i];
                                            sid = String(sid);
                                            var span = `<span class="choseSure"></span>`;
                                            $(".lis[value='"+sid+"']").append(span)
                                        }
                                    }else{
                                        $(".choseSure").remove();
                                    }
                                }
                            },
                            // 上传状态弹窗出现
                            toggleNew(){
                                this.$parent.isTask=true;
                            },
                            // 关闭上传状态弹窗
                            close(){
                                this.$parent.isTask=false;
                            },
                            // 关闭公共提示弹窗
                            closeAlertTip(){
                                this.isShowtip = false;
                            },
                            // 上传文件弹窗出现
                            toggleUp(){
                                if ($('a.up').hasClass('blue')) {
                                        $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.up").addClass('blue').removeClass('blue-none');
                                        this.$parent.createUpload(0,0,'全部资源\\我的收藏\\视频',1);
                                }
                            },
                            // 上传文件弹窗隐藏
                            closeUp(){
                                this.ids = [];
                                $(".choseSure").remove(); 
                            },
                            // 移动和复制为一个组件，所以根据data属性判定是移动还是复制出现
                            toggleBlock(e){
                                var data = e.target.getAttribute('data-num');
                                if (data=="move"&&$('a.move').hasClass('blue')) {
                                        this.isBlock = true;
                                        this.message="移动到"
                                        this.move = 0;
                                        $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.move").addClass('blue').removeClass('blue-none');
                                }else if(data=="copy"&&$('a.res-copy').hasClass('blue')){
                                    this.isBlock = true;
                                    this.message="复制到"
                                    this.move = 1;
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.res-copy").addClass('blue').removeClass('blue-none');
                                }                              
                            },
                            // 判断move值，如果为0的时候，事件在进行移动，如果为1的时候是复制
                            listenTomove(tid){
                                this.floderId = tid;
                                this.isBlock = false;
                                if(this.move == 0){
                                    this.$http.post('/MyResources/MoveFoldersOrResources',{
                                        uid:this.uid,
                                        foid:[],
                                        resid:this.ids,
                                        tid:tid
                                    }).then(res=>{
                                        var d = $.parseJSON(res.data);
                                        this.ids=[];
                                        $(".choseSure").remove();
                                        if(d){
                                            if (d.msgid==200) {
                                                this.messa = "移动视频成功";
                                                this.isShowtip = true;
                                                this.ids=[];
                                                $(".choseSure").remove();
                                            }else{
                                                this.isShowtip = true;
                                                this.messa = d.msg;
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                }else if(this.move == 1){
                                    this.$http.post('/MyResources/CopyResources',{
                                        uid:this.uid,
                                        resid:this.ids,
                                        tid:this.floderId
                                    }).then(res=>{
                                        var d = $.parseJSON(res.data);
                                        if(d){
                                            if (d.msgid==200) {
                                                this.messa = "复制视频成功";
                                                this.isShowtip = true;
                                                this.ids=[];
                                                $(".choseSure").remove();
                                                this.getVideoFile();
                                            }else{
                                                this.isShowtip = true;
                                                this.messa = d.msg;
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                }
                            },
                            // 移动弹窗关闭
                            closeBlock(){
                                this.isBlock = false;
                                this.ids = [];
                                $(".choseSure").remove();                          
                            },
                            // 删除弹窗出现
                            showTip(){
                                if($("a.del").hasClass('blue')){
                                    this.isShow = true;
                                    this.type = 3;
                                    this.mess = '您确定删除该视频吗？';
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.del").addClass('blue').removeClass('blue-none');
                                 } 
                            },
                            // 删除弹窗隐藏
                            closeTip(){
                               this.isShow = false; 
                               this.ids = [];
                               $(".choseSure").remove();                                 
                            },
                            // 视频播放按钮
                            goToPlay(){
                                if($("a.onplay").hasClass('blue-none')){
                                    return
                                }
                                var resid=this.ids[0];
                                for(var i=0;i<this.videoArray.length;i++){
                                    var video=this.videoArray[i];
                                    if(video.resid==resid&&video.status>0){
                                        this.messa = '该视频无法播放';
                                        this.isShowtip = true;
                                        return;
                                    }
                                }
                                 this.$router.push({path:'resource/video/detail',query:{id:resid} });
                            },
                            edit(){
                                if ($('a.edit').hasClass('blue')) {
                                        $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.edit").addClass('blue').removeClass('blue-none');
                                        this.$parent.createUpload(this.ids[0],0,'全部资源\\我的收藏\\视频',1);
                                }
                            },
                             getUploading(){
                                this.uploadings=[];
                                var _this=this;
                                this.$parent.tasklist.forEach(function(task){
                                    if(task.resType==1){
                                        var up={
                                            filename:task.filename,
                                            rtid:task.data.rtid,
                                            status:task.status
                                        }
                                        _this.uploadings.push(up);
                                    }
                                });
                             },
                             uploaded(){
                                this.getVideoFile();
                             }
                    }
        }
</script>
<style lang="scss">
        .my-video{
                height:73em;
                width:80%;
                float:left;
                background:url("../../assets/module/u10.png") no-repeat;
                background-size:100% 100%;
                position:absolute;
                left:20%;
                top:0;
                padding:2em;

                .img-s{
                    margin:0 0.3em !important;
                }

                .res-top{
                    overflow:hidden;
                    border-bottom:1px dashed #ffffff;

                    p{
                        width:100%;
                        height:auto;
                        margin-top:1em;
                        margin-bottom:2em;

                        a{
                            color:#fff;
                             text-decoration: none;
                             margin-right:1em;
                             border-radius:3px;
                             padding:0.6em 1em;
                             background-repeat:no-repeat;
                             background-position:5px center;
                        }
                        
                    }
                    .last{ 
                        margin-bottom:2em; 
                        margin-top:4em;                             
                        label{
                            margin-left:1em;

                            input{
                                    position:relative;
                                    top:1px;
                                    left:-1em;
                            }
                        }
                        .type{
                            width:3em;
                            height:3em;
                            float:right;
                            background:url("../../assets/resouce/u247.png") no-repeat center;
                            background-size:60%;
                        }
                        .type-table{
                            width:3em;
                            height:3em;
                            float:right;
                            background:url("../../assets/resouce/u250.png") no-repeat center;
                            background-size:60%;
                        }
                        .up-video{
                                width:3em;
                                height:3em;
                                float:right;
                                margin-right:2em;
                                background:url("../../assets/resouce/u797.png") no-repeat center;
                                background-size:65%;
                                cursor:pointer;
                        }
                        .order{
                            width:3em;
                            height:3em;
                            float:right;
                            margin-right:2em;
                            position:relative;
                            .order-inner{
                                display:block;
                                width:3em;
                                height:3em;
                                background:url("../../assets/resouce/u253.png") no-repeat center;
                                background-size:65%;
                                cursor:pointer;
                            }
                             .order-div{
                                    position:absolute;
                                    width:7em;
                                    height:7em;
                                    background:url("../../assets/resouce/order.png") no-repeat center;
                                    background-size:100% 100%;
                                    top:-6em;
                                    left:-1em;
                                    display:none;

                                    .order-li{
                                            width:100%;
                                            padding:0;
                                            li{
                                                padding:0;
                                                width:100%;
                                                text-align:center;
                                                line-height:2em;
                                                cursor:pointer;
                                            }
                                    }
                                }
                        }
                    }
                }
                .res-bottom{
                    width:100%;
                    height:auto;
                    overflow:hidden;
                    max-height:55em;
                    padding-top:2em;
                    padding-bottom:3em;
                      .show-li{
                                width:100%;
                                padding:0;
                                padding:0;
                                height:52em;
                                overflow-y:auto;
                                li{
                                        margin-bottom:2em;
                                        float:left;
                                        width:18.28%;
                                        height:11em;
                                        margin-right:1.7%;
                                        text-align:center;
                                        cursor:pointer;
                                        position:relative;
                                
                                  div{
                                        height:10em;
                                        background:url("../../assets/module/u176.png");
                                        background-size:100% 100%;
                                        padding:4%;
                                        box-sizing:border-box;  
                                        // width:100%;
                                        // padding:4% 10%;

                                        .img{
                                                width:80%;
                                                height:6em;
                                                overflow:hidden;
                                                margin-bottom:0;
                                                padding:1.5%;
                                                margin-left:10%;
                                        }                                      
                                
                                    p{
                                        width:100%;
                                        font-size:0.9em;
                                        text-align:left;
                                        line-height:2em;
                                        height:2em;
                                        box-sizing:border-box;
                                        padding:1.5%;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        }
                                        em{
                                            font-style:normal;
                                            position:absolute;
                                            right:1em;
                                            top:4.5em;
                                        }
                                  }
                                  .instruction{
                                        position:relative;
                                        top:-0.6em;
                                        padding:0 5px;
                                        box-sizing:border-box;
                                        span{
                                                color:#0099ff;
                                                padding-left:10px;
                                                width:50%;
                                        }
                                        .left{
                                                float:left;
                                        }
                                        .s-right{
                                                float:right;
                                                width:25%;
                                        }
                                   }
                                }
                        }
                }
                
        }
</style>