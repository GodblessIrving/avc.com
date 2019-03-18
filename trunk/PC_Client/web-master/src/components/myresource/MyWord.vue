<template>
        <div class="my-word">
                    <div class="res-top">
                        <p class="audio-opration">
                            <a v-if="_upload" href="javascript:void(0)" class="blue up" @click="toggleUp">上传</a>
                            <a v-if="_move" href="javascript:void(0)" class="blue-none move" data-num="move" @click="toggleBlock($event)">移动到</a>
                            <a v-if="_copy" href="javascript:void(0)" class="blue-none res-copy" data-num="copy" @click="toggleBlock($event)">复制到</a>
                            <a v-if="_delete" href="javascript:void(0)" class="blue-none del" @click="showDel()">删除</a>
                            <a v-if="_download" href="javascript:void(0)" class="blue-none down" @click="downLoad">下载</a>
                            <a v-if="_share" href="javascript:void(0)" class="blue-none share" @click="share">分享</a>
                            <a v-if="_look" href="javascript:void(0)" class="blue-none onlook" @click="goToWordView()">浏览</a>
                            <a v-if="_public" href="javascript:void(0)" class="blue-none own" @click="ownfile()">私有</a>
                            <a v-if="_public" href="javascript:void(0)" class="blue-none open" @click="openfile()">公开</a>
                            <a href="javascript:void(0)" class="blue-none edit" @click="edit">编辑</a>
                        </p>
                        <div class="last">
                            <label for="checkAll" style="cursor:pointer" ><input type="checkbox" id="checkAll" @change="checkAll">全选</label>
                            <a href="javascript:void(0)"  :class="[isA?'type-table':'type']" @click="toggle()"></a>
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
                            <li @click="addChose($event)" v-for="w in wordfiles" :value="w.resid" class="lis">
                                 <div>
                                        <p class="imgs" :class="flieTypeName(w.format)"></p>
                                        <p :title="w.restitle">{{w.restitle}}</p>
                                </div>
                                <p class="instruction">
                                        <span class="left" :class="[w.type===0?'collect-video':'doc-copy']">{{w.type==0?'收藏文稿':'上传文稿'}}</span>
                                        <span class="s-right" :class="[w.public===1?'open-s':'own-s']">{{w.public==1?'公开':'私有'}}</span>
                                </p>
                            </li>
                            <li v-for="u in uploadings" v-show="u.status!=4&&u.status!=5">
                                <div>
                                <p class="imgs" :class="$parent.getUploadingStatus(u.rtid,u.status)"></p>
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
                                            <th width="20">文稿名称</th>
                                            <th width="10">分类</th>
                                            <th width="8">来源</th>
                                            <th width="8">格式</th>
                                            <th width="8">大小</th>
                                            <th width="10">修改时间</th>
                                            <th width="10">文稿类型</th>
                                            <th width="8">公开私有</th>
                                            <th width="8">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="w in wordfiles">
                                            <td :value="w.resid">
                                                <label :for="w.resid">
                                                    <input type="checkbox" :id="w.resid" :value="w.resid" v-model="ids"/>
                                                    <span class="img-s word-s"></span>
                                                    <span class="text" :title="w.restitle">{{w.restitle}}</span>
                                                </label>
                                            </td>
                                            <td :title="w.classname">{{w.classname?w.classname:'--'}}</td>
                                            <td>{{w.sourcename?w.sourcename:'--'}}</td>
                                            <td>{{flieTypeName(w.format)}}</td>
                                            <td>{{getSize(w.size)}}MB</td>
                                            <td :title="w.rescreatetime">{{w.rescreatetime}}</td>
                                            <td>{{w.type==1?'上传':'收藏文稿'}}</td>
                                            <td>{{w.public==1?'公开':'私有'}}</td>
                                            <td>--</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div> 
                <common-tip :isShow="isShow"
                                      :message="mess" 
                                      @closeTipEvent="closeTip" 
                                      @delObjEvent="deleteWord()">
                </common-tip>   
                <alert-tip :isShowtip="isShowtip" 
                               :message="messa" 
                               @closeTipEvent="closeAlertTip()">
                </alert-tip> 
                <move-to :isBlock="isBlock" 
                               :message="message"  
                               @closeNewEvent="closeBlock"
                               v-on:child-say="listenTomove">
                </move-to>  
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
</template>
<script  type="text/ecmascript-6">
        import CommonTip from "../CommonTip"
        import alertTip from "../alertTip"
        import moveTo from "./moveTo"
        import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
        import {oDownLoad} from '../../scripts/download.js' 
        export default {
                name:"my-word",
                        data(){
                            return{
                                isOrder:false,
                                isA:true,
                                isBlock:false,
                                tip:'',
                                rtid:4,
                                count:0,
                                page:false,
                                currentPage:1,
                                md5:'',
                                move:0,
                                isShowtip:false,
                                isShow:false,
                                messa:'',
                                message:'',
                                mess:"",
                                wordfiles:[],    
                                ids:[],
                                orderby:0, 
                                keywords:'',  
                                type:0,
                                md5:'',
                                //上传中
                                uploadings:[],
                                pagesize:20,
                                pageindex:1,
                            }
                        },
                        components:{CommonTip,alertTip,moveTo},
                        computed: {
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/mydraft');
                            },
                            _upload:function(){
                                return handleAuth(90,this.handles);
                            },
                            _move:function(){
                                return handleAuth(91,this.handles);
                            },
                            _copy:function(){
                                return handleAuth(92,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(93,this.handles);
                            },
                            _download:function(){
                                return handleAuth(94,this.handles);
                            },
                            _share:function(){
                                return handleAuth(95,this.handles);
                            },
                            _look:function(){
                                return handleAuth(96,this.handles);
                            },
                            _public:function(){
                                return handleAuth(97,this.handles);
                            },
                        },
                        watch:{
                            ids:function(newval,oldval){
                                if(this.ids.length>0){
                                    $(".audio-opration a").addClass('blue').removeClass('blue-none');
                                    $("a.up").addClass('blue-none').removeClass('blue');
                                }else{
                                     $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                     $("a.up").addClass('blue').removeClass('blue-none');
                                }
                                if(this.ids.length>1){
                                     $("a.onlook").addClass('blue-none').removeClass('blue');
                                     $("a.share").addClass('blue-none').removeClass('blue');
                                     $("a.down").addClass('blue-none').removeClass('blue');
                                     $("a.edit").addClass('blue-none').removeClass('blue');
                                }
                                if(this.ids.length==1){
                                    for(var i = 0; i < this.wordfiles.length; i++){
                                        if(this.wordfiles[i].resid == this.ids[0]){
                                            if(this.wordfiles[i].public == 1){
                                                $("a.open").addClass('blue-none').removeClass('blue');
                                            }else{
                                                $("a.own").addClass('blue-none').removeClass('blue');
                                            }
                                        }
                                    }
                                }
                                if(this.ids.length < this.wordfiles.length){
                                    $("#checkAll").prop("checked",false);
                                }else if(this.ids.length > 0&&this.ids.length == this.wordfiles.length){
                                    $("#checkAll").prop("checked",true);
                                }
                            }
                        },
                        mounted:function(){
                            this.getAllwords();
                        },
                        methods:{
                            // 获取所有文稿数据
                            getAllwords(){
                                this.$http.get('/MyResources/GetMyFiles',{
                                    params:{
                                        uid:this.uid,
                                        rtid:this.rtid,
                                        orderby:this.orderby,
                                        keywords:this.keywords,
                                        pageindex:1,
                                        pagesize:99999
                                    }
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        if(d.msgid==200){
                                            this.wordfiles = d.data;
                                            this.count = d.count;
                                            this.getUploading();
                                            this.$emit('changeSize');
                                            if(this.count <= 20){
                                                this.page = false;
                                            }else{
                                                this.page = true;
                                            }
                                             this.ids=[];
                                             $("#checkAll").prop("checked",false);
                                             $('.choseSure').remove();
                                        }else{
                                            console.log(d.msg)
                                        }
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // handleCurrentChange(val){
                            //     this.pageindex = parseInt(val);
                            //     $("#checkAll").prop("checked",false);
                            //     this.isShow = false;
                            //     this.isShowtip = false;
                            //     this.isOrder = false;
                            //     this._root.isTask = false;
                            //      this._root.isUp=false;
                            //     this.isBlock = false;
                            //     this.getAllwords();
                            // },
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
                                for(var i = 0; i < this.wordfiles.length; i++){
                                    if(this.wordfiles[i].resid == this.ids[0]){
                                        this.md5 = this.wordfiles[i].md5;
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
                            // 排序
                            changeOrder(val){
                                this.orderby=val;
                                this.getAllwords();
                            },
                            getSize(size){
                                var num = Math.pow(1024,2);
                                var a = size/num;
                                return a.toFixed(2);
                            },
                            // 根据文件后缀判断文件类型和类名
                            flieTypeName(type){
                                var fliename;
                                switch(type) {
                                    case ".doc": 
                                    case ".docx":
                                        fliename = "DOC"
                                        break;
                                    case ".pdf":
                                         fliename = "PDF"
                                        break;
                                    case ".ppt":
                                    case ".pptx":
                                         fliename = "PPT"
                                        break;
                                    case ".txt":
                                         fliename = "TXT"
                                        break;
                                    case ".ai":
                                         fliename = "AI"
                                        break;
                                    case ".eps":
                                         fliename = "EPS"
                                        break;
                                    case ".xls":
                                    case ".xlsx":
                                        fliename = "EXC"
                                        break
                                    default:
                                        fliename='other';
                                    break;
                                }
                                return fliename;
                            },
                            // 排序弹框的出现和隐藏
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
                            // 当前文稿文件列表状态的选中效果
                            addChose(e){
                                var dom = e.currentTarget;
                                var id = $(dom).attr("value");
                                id = parseInt(id);
                                    if($(dom).children(".choseSure").length){
                                        $(dom).children(".choseSure").remove();
                                        this.ids.splice(jQuery.inArray(id,this.ids),1);
                                    }else{
                                        var span = `<span class="choseSure"></span>`;
                                        $(dom).append(span);
                                        this.ids.push(id);
                                    }                              
                            },
                             // 全选
                            checkAll(){
                                if($("#checkAll").prop("checked")){
                                    for(var i = 0; i < this.wordfiles.length; i++){
                                        this.ids.push(this.wordfiles[i].resid)
                                    }                                    
                                    var span = `<span class="choseSure"></span>`;
                                    $(".lis").append(span);
                                }else{
                                    this.ids = [];
                                    $(".choseSure").remove();
                                }
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
                            // 列表状态和表格状态的切换
                            toggle(){
                                this.isA = !this.isA;
                                this.ids = this.unique(this.ids);
                                console.log(this.ids)
                                if(this.isA){
                                    if(this.ids.length){
                                        $(".choseSure").remove();
                                        for(var i = 0; i < this.ids.length; i++){
                                            var sid = this.ids[i];
                                            var span = `<span class="choseSure"></span>`;
                                            $(".lis[value='"+sid+"']").append(span)
                                        }
                                    }else{
                                        $(".choseSure").remove();
                                    }
                                }
                            },
                            // 删除选中的音频文件
                            deleteWord(){
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
                                                    this.getAllwords();
                                                }else{
                                                    console.log(d.msg)
                                                }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                }else if(this.type == 1){
                                    this.Setown();
                                }else{
                                    this.Setopen();
                                }
                            },
                            // 关闭删除弹窗
                            closeTip(){
                                this.isShow = false;
                                this.ids = [];
                                $(".choseSure").remove();  
                            },
                            // 打开删除弹窗
                            showDel(){
                                if($("a.del").hasClass('blue')){
                                    this.isShow = true;
                                    this.type = 3;
                                    this.mess = '您确定删除该文稿吗？'
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.del").addClass('blue').removeClass('blue-none');
                                 }
                            },
                            // 关闭公共提示框
                            closeAlertTip(){
                                this.isShowtip = false;
                            },
                            // 设置文件私有
                            ownfile(){
                                if($("a.own").hasClass('blue-none')){
                                    return
                                }else{
                                    this.isShow = true;
                                    this.type = 1;
                                    this.mess = '您确定将所选的文稿设置为私有吗？'
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
                                                this.getAllwords();
                                        }else{
                                            console.log(d.msg)
                                        }
                                    }
                               }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // 设置文件公开
                            openfile(){
                                if($("a.open").hasClass('blue-none')){
                                    return
                                }else{
                                    this.isShow = true;
                                    this.type = 2;
                                    this.mess = '您确定将所选的文稿设置为公开吗？'
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
                                                this.getAllwords();
                                        }else{
                                            console.log(d.msg)
                                        }
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // 关闭移动复制弹窗
                            closeBlock(){
                                this.isBlock = false;
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
                                        this.isShowtip = true;
                                        if(d){
                                            if (d.msgid==200) {
                                                this.messa = "移动文稿成功";     
                                            }else{
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
                                        this.isShowtip = true;
                                        this.ids=[];
                                        $(".choseSure").remove();
                                        if(d){
                                            if (d.msgid==200) {
                                                this.messa = "复制文稿成功";                                              
                                                this.getAllwords();
                                            }else{
                                                this.messa = d.msg;
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                }
                            },
                            // 上传文件弹窗出现
                            toggleUp(){
                                if ($('a.up').hasClass('blue')) {
                                        $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.up").addClass('blue').removeClass('blue-none');
                                        this.$parent.createUpload(0,0,'全部资源\\我的收藏\\文稿',4);
                                }
                            },
                            // 上传文件弹窗隐藏
                            closeUp(){
                               this.ids = [];
                                $(".choseSure").remove();
                            },
                            // 打开上传状态面板
                            toggleNew(){
                                this.$parent.isTask = true;
                            },
                            // 浏览文稿
                            goToWordView(){
                                if($("a.onlook").hasClass('blue-none')){
                                    return
                                }     
                                for(var i = 0; i < this.wordfiles.length; i++){
                                    if(this.wordfiles[i].resid == this.ids[0] && this.wordfiles[i].format == ".txt"){
                                        this.messa = "该格式暂不支持预览";
                                        this.isShowtip = true;
                                        return
                                    }
                                }                                                     
                               this.$router.push({path:'resource/draft/detail',query:{id:this.ids[0]} });
                            },
                            edit(){
                                 if ($('a.edit').hasClass('blue')) {
                                        $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.edit").addClass('blue').removeClass('blue-none');
                                        this.$parent.createUpload(this.ids[0],0,'全部资源\\我的收藏\\文稿',4);
                                }
                            },
                             getUploading(){
                                this.uploadings=[];
                                var _this=this;
                                this.$parent.tasklist.forEach(function(task){
                                    if(task.resType==4){
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
                                this.getAllwords();
                             }                                 
                        }
        }
</script>
<style lang="scss">
        .my-word{
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
                             margin-bottom:1em;
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
                      .show-li{
                                width:100%;
                                padding:0;
                                height:52em;
                                overflow-y:auto;
                                li{
                                        margin-bottom:3em;
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
                                        position:relative;  

                                        .imgs{
                                                width:80%;
                                                height:6em;
                                                overflow:hidden;
                                                margin:0 auto;
                                                margin-bottom:0;
                                                background-repeat: no-repeat;
                                                background-position: center center;
                                                background-size: contain;
                                        }  

                                        em{
                                                position:absolute;
                                                font-style:normal;
                                                top:6em;
                                                right:1em;
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
                                  }
                                  .instruction{
                                        position:relative;
                                        top:-0.6em;
                                        padding:0 10px;
                                        box-sizing:border-box;
                                        overflow:hidden;
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