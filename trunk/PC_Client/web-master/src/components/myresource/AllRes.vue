<template>
	<div class="all-res">
                    <div class="res-top">
                        <p class="res-ops">
                            <a v-if="_upload" href="javascript:void(0)" class="blue up" @click="upload">上传</a>
                            <a v-if="_new" href="javascript:void(0)" class="blue new" @click="newFolder">新建文件夹</a>
                            <a v-if="_move" href="javascript:void(0)" class="blue-none move" @click="move">移动到</a>
                            <a v-if="_download" href="javascript:void(0)" class="blue-none down" @click="download">下载</a>
                            <a v-if="_share" href="javascript:void(0)" class="blue-none share" @click="share">分享</a>
                            <a v-if="_delete" href="javascript:void(0)" class="blue-none del" @click="del">删除</a>
                            <a v-if="_edit" href="javascript:void(0)" class="blue-none edit" @click="edit">编辑</a>
                            <a v-if="_save" href="javascript:void(0)" class="blue-none save" @click="save">保存</a>
                        </p>
                        <p style="font-size:1.2em;" class="street">
                            <span @click="openContent(0)" style="cursor:pointer;" >全部资源</span>
                            <span style="cursor:pointer;" v-for="c in content" @click="openContent(c.foid)" :title="c.name"> --> {{c.title}}</span>
                        </p>
                        <div class="last">
                            <label for="checkAll"><input type="checkbox" id="checkAll" @click="checkAll">全选</label>
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
                        </div>
                    </div>

                    <div class="res-bottom">
                        <ol class="content-li" v-show=" isA">
                               <!-- 文件夹 -->
                            <li v-for="f in folders">
                                <div v-if="f.photoalbum==0">
                                    <input type="checkbox" class="cover-box" :value="f.foid" v-model="ids" v-show="f.default"/>
                                    <div class="cover" @click="openFolder($event,f)">
                                        <span :class="[f.default===0?'collect':'common']"></span>
                                    </div>
                                    <p v-show='!f.isEdit' :title="f.name">{{f.name}}</p>
                                    <p v-show="f.isEdit"><input type="text" v-model="f.name" style="border:1px solid #eee; border-radius:3px; width:8em;"></p>
                                </div>
                                <div v-if="f.photoalbum&&f.photoalbuminfo" class="cover-div">
                                    <input type="checkbox" class="cover-box" :value="f.foid" v-model="ids3"/> 
                                    <span class="tuceSpan s1">
                                        <em v-if="f.photoalbuminfo.pic[2]" v-bind:style = "{ 'background-image' : 'url('+f.photoalbuminfo.pic[2]+')'}"></em>
                                        <em v-else></em>
                                    </span>
                                    <span class="tuceSpan s2">
                                        <em v-if="f.photoalbuminfo.pic[1]" v-bind:style = "{ 'background-image' : 'url('+f.photoalbuminfo.pic[1]+')'}"></em>
                                        <em v-else></em>
                                    </span>
                                    <span class="tuceSpan s3">
                                        <em v-if="f.photoalbuminfo.pic[0]" v-bind:style = "{ 'background-image' : 'url('+f.photoalbuminfo.pic[0]+')'}"></em>
                                        <em v-else></em>
                                    </span>
                                </div>
                                <p>{{f.name}}</p>
                            </li>
                            <li v-for="f in files">
                                <div class="cover-box" style="top:20%">
                                    <input type="checkbox" :value="f.resid" v-model="ids2"/>
                                </div>
                                <div class="cover-div">
                                    <template v-if="f.status">
                                        <span class="img" :class="$parent.getTransCodingStatus(f.rtid,f.status)"></span>
                                        <p class="file-op" style="bottom:2.5em;" v-if="f.status==2">
                                        <span style="width:4em !important;height:2em !important;" @click="$parent.retranscoding(f.resid)">重新转码</span>
                                        <span class="icon-start" style="width:2em !important;height:2em !important;"></span></p>
                                    </template>
                                    <template v-else>
                                        <template v-if="f.rtid==1">
                                            <span class="img" v-if="f.thumbnail.length>1" v-bind:style = "{ 'background-image' : 'url('+f.thumbnail[1]+')'}"></span>
                                            <span class="img" v-else-if="f.thumbnail.length==1" ></span>
                                        </template>

                                        <span class="voice" v-if="f.rtid==2"></span>
                                        <span class="picMoren" v-if="f.rtid==3"  v-bind:style = "{ 'background-image' : 'url('+f.thumbnail[0]+')'}"></span>
                                        <span v-if="f.rtid==4" :class="fclass(f.format,0)" ></span>
                                    </template>
                                </div>
                                <p v-show="!f.isEdit" :title="f.restitle+f.format">{{f.restitle+f.format}}</p>
                                <p v-show="f.isEdit"><input type="text" v-model="f.name" style="border:1px solid #eee; border-radius:3px; width:8em;"></p>
                            </li>
                            <li v-for="u in uploadings" v-show="u.status!=4&&u.status!=5">
                                <div class="cover-div">
                                    <span :class="$parent.getUploadingStatus(u.rtid,u.status)" ></span>
                                </div>
                                 <p class="file-op" v-if="u.status==2" style="bottom:2.5em;">
                                     <span style="width:4em;height:2em;" @click="$parent.continue1(u.inx)">重新上传</span>
                                     <span class="icon-start" style="width:2em;height:2em;"></span></p>
                                <p :title="u.filename">{{u.filename}}</p>
                            </li>
                        </ol>
                        <!-- 列表显示 -->
                         <div class="excel" v-show="!isA">
                                <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                                    <thead>
                                        <tr>
                                            <th>文件（夹）名称</th>
                                            <th>大小</th>
                                            <th>修改时间</th>
                                            <th>状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="f in folders">
                                            <td>
                                                    <input type="checkbox" :disabled="f.default===0" :value="f.foid" v-model="ids"/>
                                                    <span :class="foclass(f.default,1)" @click="openFolder($event,f)" style="cursor: pointer;"></span>
                                                    <span v-show='!f.isEdit' class="text" :title="f.name">{{f.name}}</span>
                                                    <input type="text"  v-show="f.isEdit" v-model="f.name" style="border:1px solid #eee; border-radius:3px; width:8em;"></p>
                                            </td>
                                            <td>--</td>
                                            <td>{{f.default===0?'--':f.createtime}}</td>
                                            <td>--</td>
                                        </tr>
                                        <tr v-for="f in files">
                                            <td>
                                                <label >
                                                    <input type="checkbox"  :value="f.resid" v-model="ids2"/>
                                                    <span v-if="f.rtid==1" class="img-s blue-s" ></span>
                                                    <span v-if="f.rtid==2" class="img-s voice-s"></span>
                                                    <span v-if="f.rtid==3" class="img-s photo-s"></span>
                                                    <span v-if="f.rtid==4" :class="fclass(f.format,1)"></span>
                                                    <span class="text" :title="f.restitle+f.format">{{f.restitle+f.format}}</span>
                                                </label>
                                            </td>
                                            <td>{{getSize(f.size)}}MB</td>
                                            <td>{{f.createtime}}</td>
                                            <td>{{$parent.getTransCodingTitle(f.status)}}</td>
                                         </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div>
                <new-photoalbum
                    :isNewatlas="isNewatlas"
                    :resourcetitle="resourcetitle"
                    :infoList="infoList"
                    @closeTipEvent="closeatlas"
                    @saveEvent="saveAlbun">
                </new-photoalbum>
                 <move-to :isBlock="showMove" 
                                 message="移动到" 
                                 :ids="ids"
                                 @closeNewEvent="closeMove" 
                                 @child-say="MoveFiles" >
                </move-to>
                <alert-tip :message='message'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
                </alert-tip>
                <common-tip :isShow="ShowDelTip" :message="comMsg" @delObjEvent="confirmDel" @closeTipEvent="closeDel">
                </common-tip>            
            </div>
</template>
<script  type="text/ecmascript-6">
import moveTo from "./moveTo"
import alertTip from "../alertTip"
import CommonTip from "../CommonTip"
import newPhotoalbum from "./newPhotoAlbum"
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js' 
import {oDownLoad} from '../../scripts/download.js'
$(document).click(function(){  
   $(".order-div").css("display","none");
   $(".order-div").removeClass('linav');
   $(".admin-div").css("display","none");
  $(".admin-div").removeClass('linav');
});
	export default {
		name:"all-res",
                          data(){
                                return{
                                    page:true,
                                    count:400,
                                    currentPage:1,
                                    //基础数据
                                    uploadings:[],
                                    folders:[],
                                    files:[],
                                    ids:[],//文件夹选中
                                    ids2:[],//文件选中
                                    allChecked:false,
                                    orderby:0,//0文件名，1大小,2修改时间
                                    foid:0,//当前目录的文件夹id;
                                    unsaved:false,//true表示有新建或者编辑操作未完成
                                    continued:false,//true表示当前有操作正在进行
                                    optype:0,//0新建,1编辑
                                    editInx:0,
                                    operate:'上传',
                                    //上传
                                    isOrder:false,
                                    isA:true,
                                    showMove:false,
                                    audioName:'',
                                    addfile:true,
                                    isAdd:false,
                                    profile:'',
                                    tip:'',//标签
                                    tipExist:false,//标识tipArr中是否已包含即将添加的tip
                                    content:[],
                                    showTasks:false,
                                    //提示；
                                    message:'',
                                    isError:false,
                                    //确认
                                    ShowDelTip:false,
                                    comMsg:'',
                                    isNewatlas:false,
                                    resourcetitle:'编辑图册',
                                    infoList:null,
                                    ids3:[],
                                }
                          },
                          components:{moveTo,alertTip,CommonTip,newPhotoalbum},
                        watch:{
                                    'myIds':{
                                        handler:function(val){
                                            //按钮规则;
                                            if(val.unsaved){
                                                $('.res-ops').children('a').addClass('blue-none').removeClass('blue');
                                                $("a.save").addClass('blue').removeClass('blue-none');
                                                return false;
                                            }else{
                                                $("a.save").addClass('blue-none').removeClass('blue');
                                            }

                                            if(val.continued){
                                                $('.res-ops').children('a').addClass('blue-none').removeClass('blue');
                                                return false;
                                            }

                                            //上传
                                            if (((val.ids.length==0||val.ids.length==1)&&val.ids2.length==0&&val.ids3.length ==0)||(val.ids3.length ==1&&val.ids.length==0&&val.ids2.length == 0)) {
                                                $("a.up").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.up").addClass('blue-none').removeClass('blue');
                                            }
                                            //新建
                                            if(val.ids.length>0||val.ids2.length>0||(val.content.length>0&&val.content[0].name == "我的收藏")){
                                                $("a.new").addClass('blue-none').removeClass('blue');
                                            }else{
                                                $("a.new").addClass('blue').removeClass('blue-none');
                                            }
                                            
                                            //移动到
                                            if (val.ids.length>0||val.ids2.length>0||val.ids3.length > 0) {
                                                $("a.move").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.move").addClass('blue-none').removeClass('blue');
                                            }
                                            //下载/分享
                                            if (val.ids.length==0&&val.ids3.length == 0&&val.ids2.length===1) {
                                                $("a.down").addClass('blue').removeClass('blue-none');
                                                $("a.share").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.down").addClass('blue-none').removeClass('blue');
                                                $("a.share").addClass('blue-none').removeClass('blue');
                                            }
                                            //删除
                                            if (val.ids.length>0||val.ids2.length>0||val.ids3.length>0) {
                                                $("a.del").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.del").addClass('blue-none').removeClass('blue');
                                            }
                                            //编辑
                                            if ((val.ids.length==0&&val.ids3.length == 0&&val.ids2.length==1)||(val.ids.length==1&&val.ids2.length==0&&val.ids3.length == 0)||(val.ids3.length==1&&val.ids.length==0&&val.ids2.length==0)) {
                                                $("a.edit").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.edit").addClass('blue-none').removeClass('blue');
                                            }
                                            // if(val.ids.length+val.ids2.length < (this.folders.length+this.files.length)-1){
                                            //     $("#checkAll").prop("checked",false);
                                            // }else if(val.ids.length+val.ids2.length == (this.folders.length+this.files.length)-1){
                                            //     $("#checkAll").prop("checked",true);
                                            // }
                                        },deep:true,
                                    },
                         },
                         computed:{
                            myIds(){
                                const {ids,ids2,ids3,unsaved,continued,content}=this;
                                return{
                                    ids,
                                    ids2,
                                    ids3,
                                    unsaved,
                                    continued,
                                    content
                                }
                            },
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/allres');
                            },
                            _upload:function(){
                                return handleAuth(53,this.handles);
                            },
                            _new:function(){
                                return handleAuth(54,this.handles);
                            },
                            _move:function(){
                                return handleAuth(55,this.handles);
                            },
                            _edit:function(){
                                return handleAuth(56,this.handles);
                            },
                            _download:function(){
                                return handleAuth(57,this.handles);
                            },
                            _share:function(){
                                return handleAuth(58,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(59,this.handles);
                            },
                            _save:function(){
                                return handleAuth(60,this.handles);
                            },
                            _root:function(){
                                return this.$root.$children[0];
                            },
                            paths:function(){
                                var paths='全部资源';
                                this.content.forEach(function(c){
                                    paths=paths+'\\'+c.name;
                                });
                                return paths;
                            },
                         },
                          mounted:function(){
                            //获取我的资源顶层目录文件；
                            this.getCurrentFiles();
                            this.getClasses();
                          },
                          methods:{
                            showMsg(msg){
                                this.message=msg;
                                this.isError=true;
                            },
                            closeMsgTip(){
                                this.message='';
                                this.isError=false;
                            },
                            closeatlas(){
                                this.isNewatlas = false;
                                this.ids3 = [];
                            },
                            saveAlbun(altasName,classid,tipArr,owenr,describe,holder,ptype,ptime,nature,paddr,author,ownership,protection,statement){
                                   this.$http.post('/MyResources/SavePhotoAlbums',{
                                    id:this.ids3[0],
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
                                                this.showMsg("编辑成功");
                                                this.getCurrentFiles();
                                            }else{
                                                this.showMsg("编辑失败");
                                            }
                                            console.log(d)
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });                               
                            },
                            getSize(size){
                                var num = Math.pow(1024,2);
                                var a = size/num;
                                return a.toFixed(2);
                            },
                            changeOrder(type){
                                this.orderby=type;
                                this.getCurrentFiles();
                                $(".order-div").css("display","none");
                                $(".order-div").removeClass('linav');
                            },
                            foclass(isdefault,type){
                                var myclass;
                                myclass=isdefault===0?"collect-s":"common-s";
                                 if (type===1) {
                                     myclass='img-s '+myclass;
                                 }
                                 return myclass;
                            },
                            fclass(format,type){
                                var myclass;
                                switch(format){
                                    case '.docx':
                                    case '.doc':
                                        myclass= 'DOC';
                                        break;
                                    case '.ppt':
                                    case '.pptx':
                                        myclass= 'PPT';
                                        break;
                                    case '.pdf':
                                        myclass= 'PDF';
                                        break;
                                    case '.ai':
                                        myclass= 'AI';
                                        break;
                                    case '.txt':
                                        myclass= 'TXT';
                                        break;
                                    case '.eps':
                                        myclass= 'EPS';
                                        break;
                                    case '.xlsx':
                                    case '.xls':
                                        myclass= 'EXC';
                                        break;
                                    default:
                                        myclass='other';
                                    }
                                    if (type==1) {
                                        myclass='img-s '+myclass.toLowerCase()+'-s';
                                    }
                                    return myclass;
                                },
                                checkAll(){
                                    var _this=this;
                                    if($("#checkAll").prop("checked")){
                                         _this.ids=[];
                                         _this.ids2=[];
                                        _this.folders.forEach(function(item){
                                            if(item.default){//默认文件夹不允许删除
                                                _this.ids.push(item.foid);
                                            }
                                        });
                                        _this.files.forEach(function(item){
                                            _this.ids2.push(item.resid);
                                        });
                                    }else{
                                        _this.ids=[];
                                        _this.ids2=[];
                                    }
                                },
                                closeDel(){
                                    this.ShowDelTip=false;
                                    this.continued=false;
                                    this.ids = [];
                                    this.ids2 = [];
                                    this.ids3 = [];
                                    $("#checkAll").prop("checked",false);
                                },
                                openContent(foid){
                                    if(this.unsaved){
                                        this.showMsg('请保存文件夹');
                                        return
                                    }
                                    this.foid=foid;
                                    this.getCurrentFiles();
                                    $("#checkAll").prop("checked",false);
                                    this.allChecked = false;
                                    //从content中清除掉后面的目录
                                    if (foid==0) {
                                        this.content=[];
                                    }else{
                                       for(var i=0;i<this.content.length;i++){
                                            var folder=this.content[i];
                                            if (folder.foid==foid) {
                                                var inx=i+1;
                                                this.content.splice(inx, this.content.length-inx)
                                            }
                                        }
                                    }
                                },
                                openFolder(e,folder){
                                    if(this.unsaved){
                                        this.showMsg('请保存文件夹');
                                        return
                                    }
                                    if ($(e.currentTarget).is('input[type]')) {
                                        return false;
                                    }
                                    this.foid=folder.foid;
                                    this.getCurrentFiles();
                                    $("#checkAll").prop("checked",false);
                                    this.allChecked = false;
                                    var exist=false;
                                    for(var i=0;i<this.content.length;i++){
                                        var c=this.content[i];
                                        if (c.foid==folder.foid) {
                                            exist=true;
                                        }
                                    }
                                    if (!exist) {
                                        this.content.push(folder);
                                    }
                                },
                                //region 上传
                                upload(){
                                    if ($('a.up').hasClass('blue')) {
                                        this.continued=true;
                                        if(this.ids3.length > 0){
                                            this.$parent.createUpload(0,this.ids3[0],'全部资源\\我的收藏\\图片',5);
                                            console.log(334)
                                        }else{
                                            this.$parent.createUpload(0,this.foid,this.paths,0);
                                        }                                                                               
                                    }
                                 },
                                 share(){
                                    if ($('a.share').hasClass('blue')) {
                                         this.showMsg('功能正在开发中');
                                         this.ids2 = [];
                                         this.ids = [];
                                    }
                                 },
                                closeUp(){
                                    this.ids2 = [];
                                    this.ids = [];
                                    this.ids3 = [];
                                    $("#checkAll").prop("checked",false);
                                    this.continued=false;
                                },
                                //endregion 上传

                                //新建文件夹
                                newFolder(){
                                    if ($('a.new').hasClass('blue-none')) {
                                        return false;
                                    }
                                    this.unsaved=true;
                                    this.optype=0;

                                    //如果用户不重名文件夹，编号默认最大到20；
                                    var code=[];
                                    for(var i=1;i<100;i++){
                                        code.push(i);
                                    }
                                    var num=[];
                                    this.folders.forEach(function(item){
                                        var filename=item.name;
                                        if (filename.indexOf('新建文件夹')==0) {
                                            if (filename.length==5) {
                                                num.push(1);
                                            }
                                            var inx=filename.indexOf(')');
                                            if (filename.length>=8&&inx===filename.length-1) {
                                                var str=filename.substring(6,inx);
                                                var val=parseInt(str);
                                                if (val) {
                                                    num.push(val);
                                                }
                                            }
                                        }
                                    })

                                    num.sort();
                                    var target=code.filter(el=>!num.includes(el));
                                    var name='新建文件夹'; 
                                    if (target[0]>1) {
                                        name+='('+target[0]+')';
                                    } 

                                    var folder={
                                        foid:this.foid,
                                        name:name,
                                        isEdit:1,
                                        default:1,
                                        photoalbum:0
                                    };
                                    this.folders.push(folder);
                                    
                                    $('.new-folder').last().focus().select();
                                }, 
                                //移动到
                                move(){
                                   if (!$('a.move').hasClass('blue')) {
                                        return false;
                                    }
                                    this.showMove=true;
                                    this.continued=true;
                                },
                                closeMove(){
                                    this.showMove=false;
                                    this.continued=false;
                                    this.ids = [];
                                    this.ids2 = [];
                                    this.ids3 = [];
                                    $("#checkAll").prop("checked",false);
                                },
                                MoveFiles(tid){
                                    this.showMove=false;
                                    if(this.ids3.length > 0){
                                        for(var i = 0; i<this.ids3.length; i++){
                                            this.ids.push(this.ids3[i])
                                        }
                                    }
                                    this.$http.post('/myResources/MoveFoldersOrResources',{
                                        uid:this.uid,
                                        foid:this.ids,
                                        resid:this.ids2,
                                        tid:tid
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            this.ids2 = [];
                                            this.ids = [];
                                            this.ids3 = [];
                                            if (d.msgid==200) {
                                                this.files=d.data;
                                                this.showMsg('移动资源成功');
                                                this.getCurrentFiles();
                                            }else{
                                                this.showMsg(d.msg);
                                            }
                                            this.continued=false;
                                        }
                                    }).catch(err=>{
                                        //this.showMsg(err);
                                    });
                                 }, 
                                 //下载
                                 download(){
                                   if (!$('a.down').hasClass('blue')) {
                                        return false;
                                    }
                                    var id=this.ids2[0];
                                    var md5='';
                                    for(var i=0;i<this.files.length;i++){
                                        var file=this.files[i];
                                        if(file.resid==id){
                                            md5=file.md5
                                        }
                                    }
                                    
                                    this.$http.get('/storage/getfilepath',{
                                        params:{
                                            fileid:md5,
                                            t:(new Date()).getTime()
                                        }
                                    }).then(res=>{
                                            var d=$.parseJSON(res.data);
                                            if (d.msgid==200&&d.data) {
                                                var _d=JSON.parse(d.data); 
                                                var addr=_d.file_addr;
                                                if (addr) {
                                                    oDownLoad(addr);
                                                }else{
                                                    this.showMsg('文件下载失败');
                                                }
                                            } 
                                    });
                                 }, 
                                //删除
                                del(){
                                    if (!$('a.del').hasClass('blue')) {
                                        return false;
                                    }
                                    this.comMsg='您确定删除所选的文件?';
                                    this.ShowDelTip=true;
                                    this.continued=true;
                                },
                                confirmDel(){
                                        if(this.ids3.length > 0){
                                            for(var i = 0; i<this.ids3.length; i++){
                                                this.ids.push(this.ids3[i])
                                            }
                                        }
                                        this.ShowDelTip=false;
                                        this.$http.post('/myResources/DeleteFoldersOrResources',{
                                                uid:this.uid,
                                                foid:this.ids,
                                                resid:this.ids2,
                                        }).then(res=>{
                                            var d=$.parseJSON(res.data);
                                            if (d) {
                                                if (d.msgid==200) {
                                                    this.showMsg('删除成功');
                                                    this.getCurrentFiles();
                                                }else{
                                                    this.showMsg(d.msg);
                                                }
                                                this.continued=false;
                                            }
                                        }).catch(err=>{
                                            console.log(err);
                                        });
                                },
                                //编辑
                                edit(){
                                    if (!$('a.edit').hasClass('blue')) {
                                        return false;
                                    }
                                    this.optype=1;
                                    if (this.ids.length>0) {//选中的是文件夹
                                        this.unsaved=true;
                                        var id=this.ids[0];
                                        var fo;
                                        var inx;
                                        this.folders.forEach(function(item,i){
                                            if (item.foid==id) {
                                                fo=item;
                                                inx=parseInt(i);
                                            }
                                        });
                                        fo.isEdit=1;
                                        this.folders.splice(inx,1,fo);
                                        this.editInx=inx;
                                    }else if(this.ids3.length > 0){
                                        this.getAtlasCopyright();
                                    }else{
                                        this.continued=true;
                                        this.$parent.createUpload(this.ids2[0],this.foid,this.paths,0);
                                    }
                                },
                                getAtlasCopyright(){
                                    this.$http.get('/MyResources/GetPhotoAlbumInfo',{
                                        params:{
                                            id:this.ids3[0]
                                        }
                                    }).then(res=>{
                                        var d = $.parseJSON(res.data);
                                        if(d){
                                            if(d.msgid == 200){
                                                this.infoList = d.data;
                                                this.resourcetitle = '编辑图册';
                                                this.isNewatlas = true;   
                                            }else{
                                                console.log(d.msg)
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err)
                                    })
                                },
                                //保存
                                save(){
                                    if (!$('a.save').hasClass('blue')) {
                                        return false;
                                    }

                                    if (this.optype==0) {
                                        var len=this.folders.length;
                                        var f=this.folders[len-1]; 
                                        if(f.name.getLength()>200){
                                            this.showMsg('文件夹名称的长度不能超过200个字符');
                                            return false;
                                        }

                                        this.$http.post('/myResources/NewFolder',{
                                                uid:this.uid,
                                                name:f.name,
                                                fid:f.foid,
                                        }).then(res=>{
                                            var d=$.parseJSON(res.data);
                                            this.ids = [];
                                            if (d) {
                                                if (d.msgid==200) {
                                                    this.showMsg('保存成功');
                                                    this.getCurrentFiles();
                                                    this.unsaved=false;
                                                }else{
                                                    this.showMsg(d.msg);
                                                }
                                            }
                                        }).catch(err=>{
                                            console.log(err);
                                        });
                                    }else{
                                        var inx=this.editInx;
                                        var f=this.folders[inx];
                                        if(f.name.getLength()>200){
                                            this.showMsg('文件夹名称的长度不能超过200个字符');
                                            return false;
                                        }
                                        this.$http.post('/myResources/ModifyFolderName',{
                                                id:f.foid,
                                                uid:this.uid,
                                                name:f.name
                                        }).then(res=>{
                                            var d=$.parseJSON(res.data);
                                             this.ids = [];
                                            if (d) {
                                                if (d.msgid==200) {
                                                    f.isEdit=0;
                                                    this.folders.splice(inx,1,f);

                                                    this.showMsg('保存成功');
                                                    this.unsaved=false;
                                                }else{
                                                    this.showMsg(d.msg);
                                                }
                                            }
                                        }).catch(err=>{
                                            console.log(err);
                                        });
                                    }
                                },
                                //获取当前目录的文件
                                 getCurrentFiles(){
                                    this.$http.get('/myResources/GetMyResources',{
                                        params:{
                                            uid:this.uid,
                                            foid:this.foid,
                                            orderby:this.orderby
                                        }
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            if (d.msgid==200) {
                                                 this.folders=d.data.folder;
                                                 this.files=d.data.file;
                                                 this.getUploading();
                                                 this.$emit('changeSize');
                                                 this.ids=[];
                                                 this.ids2=[];
                                                 this.ids3 = [];
                                                  for(let i=0;i<this.files.length;i++){
                                                        let info=this.files[i];
                                                        if(info.rtid==1){
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
                                                                                      info.thumbnail.push(pic);   
                                                                               };
                                                                            }
                                                                        } 
                                                                });
                                                        }
                                                  }
                                            }else{
                                               this.showMsg(d.msg);
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                 }, 
                                toogleOrder(){
                                    if(this.unsaved){
                                        this.showMsg('请保存文件夹');
                                        return
                                    }
                                    if($(".order-div").hasClass('linav')){
                                        $(".order-div").css("display","none");
                                        $(".order-div").removeClass('linav');
                                    }else{
                                        $(".order-div").css("display","block");
                                        $(".order-div").addClass('linav');
                                    };
                                    event.stopPropagation();  
                                },
                                toggle(){
                                    if(this.unsaved){
                                        this.showMsg('请保存文件夹');
                                        return
                                    }
                                    this.isA = !this.isA;
                                },
                                 getClasses(){
                                    this.$http.get('/systemManage/getClassifications',{
                                        params:{
                                            pagesize:9999,
                                            pageindex:1,
                                            name:''
                                        }
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        //console.log(d);
                                        if (d) {
                                            if (d.msgid==200) {
                                                this.classList=d.data;
                                            }else{
                                                this.showMsg(d.msg);
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                                 }, 
                                 getUploading(){
                                    this.uploadings=[];
                                    var _this=this;
                                    this.$parent.tasklist.forEach(function(task){
                                        if(task.resType==0&&task.data.foid==_this.foid){
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
                                    this.getCurrentFiles();
                                 }
                          }
	}
</script>
<style lang="scss">
	.all-res{
		height:73em;
        		width:80%;
        		float:left;
        		background:url("../../assets/module/u10.png") no-repeat;
       		background-size:100% 100%;
        		position:absolute;
        		left:20%;
        		top:0;
        		padding:2em;

                        .img{
                            background-image:url("../../assets/module/shipinmoren.png");
                            background-repeat:no-repeat;
                            background-position:center center;
                            background-size:contain;
                          }
                          .picMoren{
                                background:url("../../assets/module/picmoren.png");
                                background-repeat:no-repeat;
                                background-position:center center;
                                background-size:contain;
                          }

                        .el-cascader__label{
                                    color:#fff;
                        }
                        .el-cascader__label span{
                            color:#0099ff
                        }
                        .el-cascader{
                            width:100%;
                        }
                        .cover{
                            width:8em; 
                            height:6em;
                        }
                        .cover-div{
                            background:url("../../assets/module/u176.png");
                            background-size:100% 100%;
                            width:8em; 
                            height:6em;
                            padding-top:0.5em;

                            span{
                                width:6em !important;
                                height:4em !important;
                            }
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
                            .street{
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                height:2em;
                                span{
                                    cursor: pointer;
                                     overflow: hidden;
                                     display: inline-block;
                                     height: 1.5em;
                                     text-overflow: ellipsis;
                                     white-space: nowrap;
                                     margin-right: 0.5%;
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
                                            top:-7em;
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
                            padding-top:2em;

                            .content-li{
                                width:100%;
                                overflow-y:auto;
                                height:48em;
                                padding:0;
                                 li{
                                    width:8em;
                                    height:8em;
                                    float:left;
                                    margin-right:2em;
                                    position:relative;
                                    text-align:center;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    cursor:pointer;
                                    margin-bottom:1.5em;

                                    .cover-box{
                                        position:absolute;
                                        width:1em;
                                        height:1em;
                                        top:30%;
                                        left:45%;
                                        z-index:10;
                                    }

                                    span{
                                        display:inline-block;
                                        width:8em;
                                        height:6em;
                                    }
                                    p{
                                        width:100%;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;

                                    }
                                 }
                            }
                        }
        
        .clearFile{
            color:red;
            cursor:pointer;
        }
        .cover-div .tuceSpan{
              display:inline-block;
              overflow:hidden;
              width:50% !important;
              height:4em !important;
              text-align:center;

              em{
                  display:inline-block;
                  width:90%;
                  height:86%;
                  background-image:url("../../assets/module/picmoren.png");
                  background-size:contain;
                  background-repeat:no-repeat;
                  background-position:center center;
              }
          }

          .s1{
              transform:rotate(-15deg);
              position:relative;
              top:0.1em;
              left:1em;
          }
          .s2{
              position:relative;
              top:0.2em;
              left:-2.2em;
          }
          .s3{
              transform:rotate(15deg);
              position:relative;
              top:0.2em;
              left:-5.5em;
          }
      }
</style>