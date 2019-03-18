<template>
        <div class="my-pic">
                    <div class="res-top">
                        <p class="pic-opration">
                            <a v-if="_upload" href="javascript:void(0)" class="blue up" @click="toggleUp">上传</a>
                            <a v-if="_new" href="javascript:void(0)" class="blue newpic" @click="Newatlas">新建图册</a>
                            <a v-if="_move" href="javascript:void(0)" class="blue-none move" data-num="move" @click="toggleBlock($event)">移动到</a>
                            <a v-if="_copy" href="javascript:void(0)" class="blue-none res-copy" data-num="copy" @click="toggleBlock($event)">复制到</a>
                            <a v-if="_delete" href="javascript:void(0)" class="blue-none del" @click="delblock">删除</a>
                            <a v-if="_download" href="javascript:void(0)" class="blue-none down" @click="downLoad">下载</a>
                            <a v-if="_share" href="javascript:void(0)" class="blue-none share" @click="share">分享</a>
                            <a v-if="_look" href="javascript:void(0)" class="blue-none onlook" @click="goToPicture()">浏览</a>
                            <a v-if="_public" href="javascript:void(0)" class="blue-none own" @click="ownPicfile">私有</a>
                            <a v-if="_public" href="javascript:void(0)" class="blue-none open" @click="openPicfile">公开</a>
                            <a href="javascript:void(0)" class="blue-none edit" @click="edit">编辑</a>
                            <!-- <a href="javascript:void(0)" class="blue-none opendiff" @click="openDiff">打开</a> -->
                        </p>
                        <div class="last">
                            <label for="checkAll" style="cursor:pointer" ><input type="checkbox" id="checkAll" @change="checkAll">全选</label>
                            <a href="javascript:void(0)"  :class="[isA?'type-table':'type']" @click="toggle"></a>
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
                            <li v-for="(p,index) in picfile.photoalbum" @click="addChose($event)" :value="p.id" :val="2" class="lis">
                                 <div>
                                     <div class="bg">
                                        <div class="alatsimg">
                                                <span class="s1">
                                                    <em v-if="p.pic[2]" v-bind:style = "{ 'background-image' : 'url('+p.pic[2]+')'}"></em>
                                                    <em v-else class="img img-pic"></em>
                                                </span>
                                                <span class="s2">
                                                <em v-if="p.pic[1]" v-bind:style = "{ 'background-image' : 'url('+p.pic[1]+')'}"></em>
                                                <em v-else class="img img-pic"></em>
                                                </span>
                                                <span class="s3">
                                                <em v-if="p.pic[0]" v-bind:style = "{ 'background-image' : 'url('+p.pic[0]+')'}"></em>
                                                <em v-else class="img img-pic"></em>
                                                </span>
                                        </div>
                                        <p :title="p.name">{{p.name}}</p>
                                    </div>
                                    <p class="instruction">
                                        <span class="left" :class="[p.type===0?'collect-video':'up-smore']">{{p.type==0?'收藏图册':'上传图册'}}</span>
                                        <span class="s-right" :class="[p.public===1?'open-s':'own-s']">{{p.public==1?'公开':'私有'}}</span>
                                    </p>
                                 </div>
                            </li>
                            <li v-for="(p3,index) in picfile.photo" :val="1" :value="p3.id" @click="addChose($event)" class="lis">
                                <div>
                                     <div class="bg">
                                        <p class="img img-pic" v-if="p3.path" :value="index" v-bind:style = "{ 'background-image' : 'url('+p3.path+')'}"></p>
                                        <p v-else class="img img-pic"></p>
                                        <p :title="p3.name">{{p3.name}}</p>
                                    </div>
                                    <p class="instruction">
                                        <span class="left" :class="[p3.type==0?'collect-video':'up-sone']">{{p3.type==0?'收藏图片':'上传图片'}}</span>
                                        <span class="s-right" :class="[p3.public==1?'open-s':'own-s']">{{p3.public==1?'公开':'私有'}}</span>
                                    </p>
                                 </div>
                            </li>
                            <li v-for="u in uploadings" v-show="u.status!=4&&u.status!=5">
                                <div class="bg">
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
                                            <th width="20">图册（片）名称</th>
                                            <th width="10">分类</th>
                                            <th width="8">来源</th>
                                            <th width="8">数量</th>
                                            <th width="8">大小</th>
                                            <th width="10">修改时间</th>
                                            <th width="10">图片类型</th>
                                            <th width="8">公开私有</th>
                                            <th width="8">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="p in picfile.photoalbum">
                                            <td :value="2" >
                                                <label :for="p.id">
                                                    <input type="checkbox" :id="p.id" :value="p.id" v-model="ids" @change="addClick($event)"/>
                                                    <span class="img-s photo-s"></span>
                                                    <span class="text" :title="p.name">{{p.name}}</span>
                                                </label>
                                            </td>
                                            <td>{{p.cname?p.cname:'--'}}</td>
                                            <td>{{p.sname?p.sname:'--'}}</td>
                                            <td>{{'图册（'+p.count+'）'}}</td>
                                            <td>{{getSize(p.size)}}MB</td>
                                            <td :title="p.rescreatetime">{{p.createtime}}</td>
                                            <td>{{p.type===0?'收藏':'上传'}}图册</td>
                                            <td>{{p.public===1?'公开':'私有'}}</td>
                                            <td>--</td>
                                        </tr>
                                        <tr v-for="p in picfile.photo">
                                            <td :value="1" >
                                                <label :for="p.id">
                                                    <input type="checkbox" :id="p.id" :value="p.id" v-model="ids" @change="addClick($event)"/>
                                                    <span class="img-s photo-s"></span>
                                                    <span class="text" :title="p.name">{{p.name}}</span>
                                                </label>
                                            </td>
                                            <td>{{p.cname?p.cname:'--'}}</td>
                                            <td>{{p.sname?p.sname:'--'}}</td>
                                            <td>图片（1）</td>
                                            <td>{{getSize(p.size)}}MB</td>
                                            <td :title="p.createtime">{{p.createtime}}</td>
                                            <td>{{p.type===0?'收藏':'上传'}}图片</td>
                                            <td>{{p.public===1?'公开':'私有'}}</td>
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
                               :resType="3"
                               @closeNewEvent="closeBlock"
                               v-on:child-say="listenTomove">
                </move-to>   
                <new-photoalbum 
                        :isNewatlas="isNewatlas"
                        :resourcetitle="resourcetitle"
                        :infoList="infoList"
                        @closeTipEvent="closeatlas"
                        @saveEvent="save">                                          
                </new-photoalbum>
                <!-- <el-pagination
                         background
                         @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-size="20"
                         layout="prev, pager, next"
                         :total="count"
                         v-show="page">
                 </el-pagination>    -->        
            </div>
</template>
<script  type="text/ecmascript-6">
        import CommonTip from "../CommonTip"
        import NewPhotoalbum from "./newPhotoAlbum" 
        import alertTip from "../alertTip"
        import moveTo from "./moveTo"
        import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
        import {oDownLoad} from '../../scripts/download.js' 
        export default {
                name:"my-pic",
                        data(){
                            return{
                                isOrder:false,
                                isA:true,
                                isShow:false,
                                isBlock:false,
                                message:'',
                                currentPage:1,
                                count:0,
                                page:false,
                                public:1,
                                ids:[],
                                mess:'',
                                picfile:[],
                                resType:3,
                                atlas:[],
                                isShowtip:false,
                                messa:'',
                                rtid:3,
                                move:0,
                                ids:[],
                                isNewatlas:false,
                                orderby:0, 
                                keywords:'',  
                                type:0,
                                md5:'',
                                editId:0,
                                altasid:0,
                                //上传中
                                uploadings:[],
                                isEdit:false,
                                pageindex:1,
                                pagesize:20,
                                resourcetitle:'',
                                infoList:null,
                            }
                        },
                        components:{CommonTip,alertTip,moveTo,NewPhotoalbum},
                        computed: {
                          value() {
                            const { ids, atlas } = this
                            return {
                              ids,
                              atlas
                            }
                          },
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/mypic');
                            },
                            _upload:function(){
                                return handleAuth(80,this.handles);
                            },
                            _new:function(){
                                return handleAuth(81,this.handles);
                            },
                            _move:function(){
                                return handleAuth(82,this.handles);
                            },
                            _copy:function(){
                                return handleAuth(83,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(84,this.handles);
                            },
                            _download:function(){
                                return handleAuth(85,this.handles);
                            },
                            _share:function(){
                                return handleAuth(86,this.handles);
                            },
                            _look:function(){
                                return handleAuth(87,this.handles);
                            },
                            _public:function(){
                                return handleAuth(88,this.handles);
                            },
                        },
                        watch:{      
                            value: {
                              handler: function(val) {
                                if(val.ids.length>0){
                                    $(".pic-opration a").addClass('blue').removeClass('blue-none');
                                    $("a.up,a.newpic").addClass('blue-none').removeClass('blue');
                                }else{
                                     $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                     $("a.up,a.newpic").addClass('blue').removeClass('blue-none');
                                }
                                if(val.ids.length>1){
                                     $(".pic-opration a").addClass('blue').removeClass('blue-none');
                                     $("a.onlook").addClass('blue-none').removeClass('blue');
                                     $("a.share").addClass('blue-none').removeClass('blue');
                                     $("a.down").addClass('blue-none').removeClass('blue');
                                     $("a.edit").addClass('blue-none').removeClass('blue');
                                }
                                 if(val.atlas.length > 0){
                                    $("a.up").addClass('blue').removeClass('blue-none');  
                                    $("a.down").addClass('blue-none').removeClass('blue');                               
                                }
                                if(val.atlas.length > 1){
                                    $(".pic-opration a").addClass('blue').removeClass('blue-none');
                                    $("a.up").addClass('blue-none').removeClass('blue');
                                    $("a.opendiff").addClass('blue-none').removeClass('blue');  
                                    $("a.newpic").addClass('blue-none').removeClass('blue');                                  
                                }
                                if(val.atlas.length == 1 && val.ids.length > 1){
                                    $(".pic-opration a").addClass('blue').removeClass('blue-none');
                                    $("a.up").addClass('blue-none').removeClass('blue');
                                    $("a.edit").addClass('blue-none').removeClass('blue');
                                }
                                if(val.ids.length==1){
                                    for(var i = 0; i < this.picfile.photoalbum.length; i++){
                                        if(this.picfile.photoalbum[i].id == val.atlas[0]){
                                            if(this.picfile.photoalbum[i].public == 1){
                                                $("a.open").addClass('blue-none').removeClass('blue');
                                            }else{
                                                $("a.own").addClass('blue-none').removeClass('blue');
                                            }
                                        }
                                    }
                                    for(var i = 0; i < this.picfile.photo.length; i++){
                                        if(this.picfile.photo[i].id == val.ids[0]){
                                            if(this.picfile.photo[i].public == 1){
                                                $("a.open").addClass('blue-none').removeClass('blue');
                                            }else{
                                                $("a.own").addClass('blue-none').removeClass('blue');
                                            }
                                        }
                                    }
                                }
                                if(this.ids.length < this.picfile.photo.length+this.picfile.photoalbum.length){
                                    $("#checkAll").prop("checked",false);
                                }else if(this.ids.length > 0&&this.ids.length == this.picfile.photo.length+this.picfile.photoalbum.length){
                                    $("#checkAll").prop("checked",true);
                                }
                              },
                              deep: true
                            }
                        },
                        mounted:function(){
                            this.getAllpicflile();
                            // this.getClasses();
                        },
                        methods:{
                            // 获取全部图片资源
                            getAllpicflile(){
                                this.$http.get('/MyResources/GetMyPic',{
                                    params:{
                                        orderby:this.orderby,
                                        pagesize:99999,
                                        pageindex:1
                                    }
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        this.ids = [];
                                        this.atlas = [];
                                        $("#checkAll").prop("checked",false);
                                        $(".choseSure").remove();
                                        if(d.msgid == 200){
                                            this.picfile = d.data;
                                            var photo = this.picfile.photo;
                                            var photoalbum = this.picfile.photoalbum;
                                            this.$emit('changeSize');
                                            for(let i=0;i<photo.length;i++){
                                              let info=photo[i];
                                                  if(info.md5){
                                                    this.$http.get('/storage/getfilepath',{
                                                      params:{
                                                          fileid:info.md5
                                                      }
                                                    }).then(res=>{
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
                                                                            info.path=pic;
                                                                     };
                                                                  }
                                                                }
                                                            } 
                                                    });
                                                }
                                            }
                                            this.count = d.count;
                                            this.getUploading();
                                            if(this.count <= 20){
                                                this.page = false;
                                            }else{
                                                this.page = true;
                                            }
                                            console.log(this.picfile)
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
                            //     this.isOrder = false;
                            //     this.isShow = false;
                            //     this.isAdd = false;
                            //     this.isBlock = false;
                            //     this._root.isTask = false;
                            //     this.isShowtip = false;
                            //     this.isEdit = false;
                            //      this._root.isUp=false;
                            //     this.getAllpicflile();
                            // },
                            
                            share(){
                                if($("a.share").hasClass('blue-none')){
                                    return
                                }
                                this.messa = "该功能正在开发中";
                                this.isShowtip = true;
                                this.ids = [];
                                this.atlas = [];
                                $(".choseSure").remove();
                            },
                            // 下载
                            downLoad(){
                                if($("a.down").hasClass('blue-none')){
                                    return
                                }
                                for(var i = 0; i < this.picfile.photo.length; i++){
                                    let photo=this.picfile.photo[i];
                                    if(photo.id == this.ids[0]){
                                        var addr = photo.pic;
                                        oDownLoad(addr);
                                    }
                                }
                            },
                            getSize(size){
                                var num = Math.pow(1024,2);
                                var a = size/num;
                                return a.toFixed(2);
                            },
                            
                            // 当前文稿文件列表状态的选中效果
                            addChose(e){
                                var dom = e.currentTarget;
                                var id = $(dom).attr("value");
                                var atlasid = $(dom).attr("val");
                                id = parseInt(id);
                                    if($(dom).children(".choseSure").length){
                                        $(dom).children(".choseSure").remove();
                                        this.ids.splice(jQuery.inArray(id,this.ids),1);
                                        if(atlasid == 2){
                                            this.atlas.splice(jQuery.inArray(id,this.atlas),1);
                                        }
                                    }else{
                                        var span = `<span class="choseSure"></span>`;
                                        $(dom).append(span);
                                        this.ids.push(id);
                                        if(atlasid == 2){
                                            this.atlas.push(id);
                                        }
                                    }                          
                            },
                             // 全选
                            checkAll(){
                                if($("#checkAll").prop("checked")){
                                    this.ids = [];
                                    this.atlas = [];
                                    for(var i = 0; i < this.picfile.photo.length; i++){
                                        this.ids.push(this.picfile.photo[i].id);
                                    }    
                                    for(var i = 0; i < this.picfile.photoalbum.length; i++){
                                        this.ids.push(this.picfile.photoalbum[i].id);
                                        this.atlas.push(this.picfile.photoalbum[i].id)
                                    }                             
                                    var span = `<span class="choseSure"></span>`;
                                    $(".lis").append(span);
                                }else{
                                    this.ids = [];
                                    this.atlas = [];
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
                                if(this.isA){
                                    if(this.ids.length){
                                        $(".choseSure").remove();
                                        this.atlas = [];
                                        for(var i = 0; i < this.ids.length; i++){
                                            var sid = this.ids[i];
                                            sid = String(sid);
                                            var span = `<span class="choseSure"></span>`;
                                            $(".lis[value='"+sid+"']").append(span);
                                            var alat = $(".lis[value='"+sid+"']").attr("val");
                                            if(alat == 2){
                                                this.atlas.push(sid);
                                            }
                                        }
                                    }else{
                                        $(".choseSure").remove();
                                    }
                                }
                            },
                            // 表格状态的时候判断选中的是图片还是图册
                            addClick(e){
                                var dom = e.currentTarget;
                                if($(dom).prop("checked")){
                                    var val = $(dom).parents("td").attr("value");
                                    if(val == 2){
                                        this.atlas.push($(dom).attr("value"))
                                    }
                                }else{
                                    var val = $(dom).parents("td").attr("value");
                                    if(val == 2){
                                        this.atlas.splice(jQuery.inArray($(dom).attr("value"),this.atlas),1);
                                    }
                                }
                            },
                            // 删除弹窗出现
                            delblock(){
                                if($(".del").hasClass('blue')){
                                    if(this.atlas.length == 0){
                                        this.mess = "确定删除该图片吗？"
                                    }else if(this.atlas.length == this.ids.length){
                                        this.mess = "确定删除该图册吗？"
                                    }else if(this.atlas.length > 0){
                                        this.mess = "确定删除该图册和图片吗？"
                                    }
                                    this.isShow = true;
                                    this.type = 3;
                                    $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                    $(".del").addClass('blue').removeClass('blue-none');
                                }
                            },
                            // 删除弹窗关闭
                            closeTip(){
                                this.isShow = false;
                                this.atlas = [];
                                this.ids = [];
                                $(".choseSure").remove(); 
                            },
                            // 排序
                            changeOrder(val){
                                this.orderby=val;
                                 this.getAllpicflile();
                            },
                            deleIds(arr,brr){
                                for(var i=0;i<brr.length;i++){
                                    for(var j=0;j<arr.length;j++){
                                        if(arr[j]==brr[i]){
                                            arr.splice(j,1);
                                            j--;
                                        }
                                    }
                                }
                                return arr;
                            },
                            // 删除图片或者图册文件
                            deleteWord(){
                                if(this.type == 3){
                                    console.log(this.deleIds(this.ids,this.atlas))
                                    this.$http.post('/MyResources/DeleteFoldersOrResources',{                              
                                        resid:this.deleIds(this.ids,this.atlas),
                                        foid:this.atlas,
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                                this.isShow = false;
                                                this.ids=[];
                                                this.atlas = [];
                                                $(".choseSure").remove();
                                                if (d.msgid==200) {
                                                    this.messa = "删除成功";
                                                    this.isShowtip = true;
                                                    this.getAllpicflile();
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
                            // 关闭提示窗
                            closeAlertTip(){
                                this.isShowtip = false;
                                this.atlas = [];
                                this.ids = [];
                                $(".choseSure").remove(); 
                            },
                            // 设置文件私有
                            ownPicfile(){
                                if($("a.own").hasClass('blue-none')){
                                    return
                                }else{
                                    this.type = 1;
                                    this.isShow = true;
                                    this.mess = "您确定将所选择的图片设置为私有？"
                                    $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.own").addClass('blue').removeClass('blue-none');
                                }
                            },
                            Setown(){
                                this.$http.post('/MyResources/ChangeFileScope',{
                                        uid:this.uid,
                                        resid:this.deleIds(this.ids,this.atlas),
                                        foid:this.atlas,
                                        public:0
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        this.isShow = false;
                                        this.ids=[];
                                        this.atlas = [];
                                        this.isShowtip = true;
                                        $(".choseSure").remove();
                                        if (d.msgid==200) {
                                                this.messa = "设置私有成功";                                               
                                                $("a.up,a.new-pic").addClass('blue').removeClass('blue-none');
                                               this.getAllpicflile();
                                        }else{
                                             this.messa = "设置私有失败";
                                            console.log(d.msg)
                                        }
                                    }
                               }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // 设置文件公开
                            openPicfile(){
                                if($("a.open").hasClass('blue-none')){
                                    return
                                }else{
                                    this.type = 2;
                                    this.isShow = true;
                                    this.mess = "您确定将所选择的图片设置为公开？"
                                    $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.open").addClass('blue').removeClass('blue-none');
                                }
                            },
                            Setopen(){
                                this.$http.post('/MyResources/ChangeFileScope',{
                                        uid:this.uid,
                                        resid:this.deleIds(this.ids,this.atlas),
                                        foid:this.atlas,
                                        public:1
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        this.isShow = false;
                                        this.isShowtip = true;
                                        this.ids=[];
                                        this.atlas = [];
                                        $(".choseSure").remove();
                                        if (d.msgid==200) {
                                                this.messa = "设置公开成功";
                                                $("a.up,a.new-pic").addClass('blue').removeClass('blue-none');
                                                 this.getAllpicflile();
                                        }else{
                                            this.messa = "设置公开失败";
                                            console.log(d.msg)
                                        }
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // 打开移动或者复制弹窗
                            toggleBlock(e){
                                var data = e.target.getAttribute('data-num');
                                if (data=="move"&&$('a.move').hasClass('blue')) {
                                        this.isBlock = true;
                                        this.message="移动到"
                                        this.move = 0;
                                        $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.move").addClass('blue').removeClass('blue-none');
                                }else if(data=="copy"&&$('a.res-copy').hasClass('blue')){
                                    this.isBlock = true;
                                    this.message="复制到"
                                    this.move = 1;
                                    $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.res-copy").addClass('blue').removeClass('blue-none');
                                }                              
                            },
                            // 关闭移动或复制弹窗
                            closeBlock(){
                                this.isBlock = false;
                                this.atlas = [];
                                this.ids = [];
                                $(".choseSure").remove(); 
                            },
                            // 判断移动还是复制，完成操作
                            listenTomove(tid){
                                this.floderId = tid;
                                this.isBlock = false;
                                if(this.move == 0){
                                    this.$http.post('/MyResources/MoveFoldersOrResources',{
                                        uid:this.uid,
                                        foid:this.atlas,
                                        resid:this.deleIds(this.ids,this.atlas),
                                        tid:tid
                                    }).then(res=>{
                                        var d = $.parseJSON(res.data);
                                        if(d){
                                            this.isShowtip = true;
                                            this.ids=[];
                                            this.atlas = [];
                                            $(".choseSure").remove();
                                            if (d.msgid==200) {
                                                this.messa = "移动成功";                                                                                              
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
                                        foid:this.atlas,
                                        resid:this.deleIds(this.ids,this.atlas),
                                        tid:tid
                                    }).then(res=>{
                                        var d = $.parseJSON(res.data);
                                        if(d){
                                                this.isShowtip = true;
                                                this.ids=[];
                                                this.atlas = [];
                                                $(".choseSure").remove();
                                            if (d.msgid==200) {
                                                this.messa = "复制成功";
                                                this.getAllpicflile();
                                            }else{
                                                this.messa = d.msg
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                }
                            },
                           
                            // 新建图册
                            save(altasName,classid,tipArr,owenr,describe,holder,ptype,ptime,nature,paddr,author,ownership,protection,statement){
                                   this.$http.post('/MyResources/SavePhotoAlbums',{
                                    id:this.editId,
                                    title:altasName,
                                    cid:classid,
                                    label:tipArr.join(','),
                                    public:JSON.parse(owenr),
                                    description:describe,
                                    holder:holder,
                                    ptype:ptype,
                                    ptime:ptime,
                                    nature:nature,
                                    paddr:paddr,
                                    author:author,
                                    ownership:ownership,
                                    protection:protection,
                                    statement:statement
                                }).then(res=>{
                                        var d = $.parseJSON(res.data);
                                        if(d){
                                            this.isShowtip = true;
                                            this.isNewatlas = false;
                                            if (d.msgid==200) {
                                                if(this.isEdit){
                                                    this.messa = "编辑成功";
                                                }else{
                                                    this.messa = "新建成功";
                                                }                                             
                                                this.getAllpicflile();
                                            }else{
                                                if(this.isEdit){
                                                    this.messa = "编辑失败";
                                                }else{
                                                    this.messa = "新建失败";
                                                }
                                            }
                                            console.log(d)
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });                               
                            },
                            // 排序控件的出现和隐藏
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
                            // 新建图册弹窗出现
                            Newatlas(){
                                if($(".newpic").hasClass('blue')){
                                    this.resourcetitle = '新建图册';
                                    this.isNewatlas = true;
                                    this.infoList = null;
                                    this.editId = 0,
                                     $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                     $("a.newpic").addClass('blue').removeClass('blue-none');
                                }
                            },
                            // 新建图册弹窗隐藏
                            closeatlas(){
                                this.isNewatlas = false;
                                this.atlas = [];
                                this.ids = [];
                                $(".choseSure").remove(); 
                            },
                             //上传弹窗出现 
                            toggleUp(){
                                if($("a.up").hasClass('blue')){
                                    $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.up").addClass('blue').removeClass('blue-none');
                                    if(this.atlas.length > 0){
                                         this.$parent.createUpload(0,this.atlas[0],'全部资源\\我的收藏\\图片',5);
                                     }else{
                                          this.$parent.createUpload(0,0,'全部资源\\我的收藏\\图片',3);
                                     }
                                }                              
                            },
                            //上传弹窗隐藏
                            //这个是上传接口的实现,不能删
                            closeUp(){
                                this.atlas = [];
                                this.ids = [];
                                $(".choseSure").remove(); 
                            },
                            // 路由到图片详情页面
                            goToPicture(){
                                 if($("a.onlook").hasClass('blue-none')){
                                    return
                                }
                                var self = this;
                                if(this.atlas.length > 0){
                                    this.altasid = this.atlas[0]
                                    this.ids[0] = 0;                                 
                                    var count;
                                     this.picfile.photoalbum.forEach(function(item, i){
                                         if(self.altasid == item.id){
                                            count = item.count;
                                         }
                                     });
                                     if(count == 0){
                                            this.isShowtip = true;
                                            this.messa = "该图册暂时没有图片预览，请上传图片后预览";
                                            this.ids = [];
                                            this.atlas = [];
                                            $(".choseSure").remove();
                                            return
                                     }
                                }else{
                                    this.picfile.photo.forEach(function(item, i){
                                        if(self.ids[0] == item.id){
                                             self.altasid = item.foid
                                        }
                                    });
                                    this.picfile.photoalbum.forEach(function(item, i){
                                        if(self.ids[0] == item.id){
                                             self.altasid = item.foid
                                        }
                                    });
                                }
                                this.$router.push({path:'resource/picture/detail',query:{id:this.ids[0],foid:this.altasid} });
                             },
                            edit(){
                                 if ($('a.edit').hasClass('blue')) {
                                    if(this.atlas.length < 1){
                                        $(".pic-opration a").addClass('blue-none').removeClass('blue');
                                        $("a.edit").addClass('blue').removeClass('blue-none');
                                        this.$parent.createUpload(this.ids[0],0,'全部资源\\我的收藏\\图片',3);
                                    }else{
                                        this.editId = this.atlas[0];
                                        this.getAtlasCopyright();                                    
                                    }
                                }
                            },
                            // 获取相册的概要信息和版权信息
                            getAtlasCopyright(){
                                this.$http.get('/MyResources/GetPhotoAlbumInfo',{
                                    params:{
                                        id:this.editId
                                    }
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        if(d.msgid == 200){
                                            this.infoList = d.data;
                                            this.resourcetitle = '编辑图册';
                                            this.isEdit = true;
                                            this.isNewatlas = true;   
                                        }else{
                                            console.log(d.msg)
                                        }
                                    }
                                }).catch(err=>{
                                    console.log(err)
                                })
                            },
                            toggleNew(){
                                this.$parent.isTask=true;
                            },
                             getUploading(){
                                this.uploadings=[];
                                var _this=this;
                                this.$parent.tasklist.forEach(function(task){
                                    if(task.resType==3){
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
                                this.getAllpicflile();
                             }
                        }
                    }
</script>
<style lang="scss">
        .my-pic{
                height:73em;
                width:80%;
                float:left;
                background:url("../../assets/module/u10.png") no-repeat;
                background-size:100% 100%;
                position:absolute;
                left:20%;
                top:0;
                padding:2em;
                
                .is-danger {
                    color: red;
                    padding-left: 11em;
                }
                .img-s{
                    margin:0 0.3em !important;
                }
                .isRepeat{
                    padding-left:0 !important;
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
                                
                                  .bg{
                                        height:10em;
                                        background:url("../../assets/module/u176.png");
                                        background-size:100% 100%;
                                        padding:4%;
                                        box-sizing:border-box;
                                        position:relative;  

                                        .img{                                           
                                            background-size:contain;
                                            background-repeat:no-repeat;
                                            background-position:center center;
                                        }
                                        .img-pic{
                                            background-image:url("../../assets/module/picmoren.png");
                                        }
                                        .alatsimg,.img{
                                                width:100%;
                                                height:6em;
                                                // overflow:hidden;
                                                margin-bottom:0;
                                                text-align:center;
                                                span{
                                                    display:inline-block;
                                                    overflow:hidden;
                                                    width:50%;
                                                    height:4em;
                                                    // background:url("../../assets/module/u176.png");
                                                    // background-size:100% 100%;
                                                    text-align:center;

                                                    em{
                                                        display:inline-block;
                                                        width:90%;
                                                        height:86%;
                                                        background:url("../../assets/module/picmoren.png");
                                                        background-size:contain;
                                                        background-repeat:no-repeat;
                                                        background-position:center center;
                                                    }
                                                }

                                                .s1{
                                                        transform: rotate(-15deg);
                                                        position: relative;
                                                        top: 1.5em;
                                                        left: -2em;
                                                }
                                                .s2{
                                                    position:relative;
                                                    top:-3em;
                                                    left:0em;
                                                }
                                                .s3{
                                                    transform:rotate(15deg);
                                                    position:relative;
                                                    top:-7em;
                                                    left:2em;
                                                }
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