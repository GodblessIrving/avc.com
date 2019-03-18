<template>
        <div class="storages">
                    <div class="res-top">
                        <div class="opra">
                            <a v-if="_upload" href="javascript:void(0)" class="blue-none up" @click="upload">上传</a>
                            <a v-if="_copy" href="javascript:void(0)" class="blue-none res-copy" style="padding-left:2.5em;" @click="copy">复制到</a>
                            <a v-if="_download" href="javascript:void(0)" class="blue-none down" @click="download" style="padding-left:2.8em;">下载</a>
                            <a v-if="_new" href="javascript:void(0)" @click="newFolder" class="blue new">新建文件夹</a>
                            <a v-if="_edit" href="javascript:void(0)" @click="edit" class="blue-none edit">编辑</a>
                            <a v-if="_delete"  href="javascript:void(0)" @click="delCommonFolder" class="blue-none del">删除</a>
                        </div>
                        <p style="font-size:1.2em;" class="street">
                            <span @click="openContent(1)" style="cursor:pointer;">公共存储</span>
                            <span style="cursor:pointer;" v-for="c in content" @click="openContent(c.id)" :title="c.name"> --> {{c.title}}</span>
                        </p>
                        <div class="last">
                            <label for=""><input type="checkbox" id="checkAll" @click="checkAll">全选</label>
                            <a href="javascript:void(0)"  :class="[isA?'type-table':'type']" @click="toggle"></a>
                            <div class="order">
                                <span class="order-inner" @click="toogleOrder()"></span>
                                <div class="order-div">
                                    <ol class="order-li">
                                        <li @click="changeOrder(1)">按文件名</li>
                                        <li @click="changeOrder(2)">按大小</li>
                                        <li @click="changeOrder(3)">按修改时间</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="res-bottom">
                        <ol class="content-li" v-show=" isA">
                            <li v-for="f in folder">
                                <div v-if="f.owner">
                                    <input type="checkbox" class="cover-box" :value="f.id" v-model="ids"/>
                                    <div class="cover" @click="openFolder($event,f)">
                                        <span class="common-green"></span>
                                    </div>
                                    <p v-show="!f.isEdit">{{f.name}}</p>
                                    <p v-show="f.isEdit"><input type="text" v-model="f.name"></p>
                                </div>
                                <div v-if="!f.owner">
                                    <input type="checkbox" class="cover-box" :value="f.id" v-model="ids"/>
                                    <div class="cover" @click="openFolder($event,f)">
                                        <span class="other-green"></span>
                                    </div>
                                    <p v-show="!f.isEdit">{{f.name}}</p>
                                    <p v-show="f.isEdit"><input type="text" v-model="f.name"></p>
                                </div>
                            </li>
                            <li v-for="f in file">
                                    <div v-if="f.owner">
                                        <div class="bg" v-if="f.rtid == 1">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img" v-if="f.pic" v-bind:style = "{ 'background-image' : 'url('+f.pic+')'}"></p>
                                        <p v-else class="top-bg img"></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                    <div class="bg" v-if="f.rtid == 2">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img voice"></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                    <div class="bg" v-if="f.rtid == 3">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img" v-if="f.path" v-bind:style = "{ 'background-image' : 'url('+f.path+')'}"></p>
                                        <p v-else class="top-bg img-pic" ></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                    <div class="bg" v-if="f.rtid == 4">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img" :class="getClassName(f.suffix,0)" style="background-size:35%;"></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                </div>
                                <div v-if="!f.owner" class="share-file">
                                    <p class="share-icom"></p>
                                    <div class="bg" v-if="f.rtid == 1">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img" v-if="f.pic" v-bind:style = "{ 'background-image' : 'url('+f.pic+')'}"></p>
                                        <p v-else class="top-bg img"></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                    <div class="bg" v-if="f.rtid == 2">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img voice"></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                    <div class="bg" v-if="f.rtid == 3">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img" v-if="f.path" v-bind:style = "{ 'background-image' : 'url('+f.path+')'}"></p>
                                        <p v-else class="top-bg img-pic" ></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                    <div class="bg" v-if="f.rtid == 4">
                                        <input type="checkbox" class="cover-box" :value="f.id" v-model="ids2"/>
                                        <p class="top-bg img" :class="getClassName(f.suffix,0)" style="background-size:35%;"></p>
                                        <p :title="f.title+f.suffix">{{f.title+f.suffix}}</p>
                                    </div>
                                </div>
                            </li>
                            <li v-for="u in uploadings" v-show="u.status!=4&&u.status!=5">
                                <div class="bg">
                                    <p class="top-bg img" :class="$parent.getUploadingStatus(u.rtid,u.status)"  style="background-size:contain;"></p>
                                    <p class="file-op" v-if="u.status==2" style="bottom:2.5em;right:2.5em;">
                                         <span style="width:4em;height:2em;" @click="$parent.continue1(u.inx)">继续上传</span>
                                         <span class="icon-start" style="width:2em;height:2em;"></span>
                                    </p>
                                    <p :title="u.filename">{{u.filename}}</p>
                                </div>
                            </li>
                        </ol>
                         <div class="excel" v-show="!isA">
                                <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                                    <thead>
                                        <tr>
                                            <th>文件（夹）名称</th>
                                            <th>大小</th>
                                            <th>修改时间</th>
                                            <th>类型</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="f in folder">
                                            <td>
                                                <label for="input1">
                                                    <input type="checkbox" :value="f.id" v-model="ids"/>
                                                    <span class="img-s common-s" @click="openFolder($event,f)" style="cursor: pointer;"></span>
                                                    <span class="text" :title="f.name">{{f.name}}</span>
                                                </label>
                                            </td>
                                            <td>-</td>
                                            <td>{{f.createtime}}</td>
                                            <td>{{f.owner?'创建':'共享'}}</td>
                                        </tr>
                                        <tr v-for="f in file">
                                            <td>
                                                <label for="input1">
                                                    <input type="checkbox" :value="f.id" v-model="ids2"/>
                                                    <span v-if="f.rtid==1" class="img-s photo-s" ></span>
                                                    <span v-if="f.rtid==2" class="img-s voice-s"></span>
                                                    <span v-if="f.rtid==3" class="img-s photo-s" ></span>
                                                    <span v-if="f.rtid==4" class="img-s word-s"></span>
                                                    <span class="text"  :title="f.title+f.suffix">{{f.title+f.suffix}}</span>
                                                </label>
                                            </td>
                                            <td>{{getSize(f.size)}}MB</td>
                                            <td>{{f.createtime}}</td>
                                            <td>{{f.owner?'创建':'共享'}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div>
                <move-to :isBlock="showCopy" 
                                 message="复制到" 
                                 :ids="ids"
                                 :resType="6"
                                 @closeNewEvent="closeCopy" 
                                 @child-say="CopyFiles" >
                </move-to>
                <new-common :isNew="isNew" :foid="cid"
                @closeEvent="closeNew"
                @saveEvent="saveFolder">
                </new-common>
                <common-tip :isShow="showDel" :message="message" @delObjEvent="delFolder" 
                @closeTipEvent="closeDel"></common-tip>
                <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
                </alert-tip>  
            </div>
</template>
<script  type="text/ecmascript-6">
        import moveTo from "./moveTo"
        import newCommon from "./newCommonFolder"
        import CommonTip from "../CommonTip"
        import alertTip from '../alertTip'
        import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js'
        import {oDownLoad} from '../../scripts/download.js' 
        export default {
                name:"storage",
                        data(){
                            return{
                                isOrder:false,
                                isA:true,
                                hasPower:false,
                                showCopy:false,
                                isNew:false,
                                showDel:false,
                                //数据
                                cfoid:1,
                                order:1,//1按照文件名排序，2按大小，3按修改时间；
                                folder:[],
                                file:[],
                                ids:[],
                                ids2:[],
                                continued:false,//true表示当前有操作正在进行
                                allChecked:false,
                                cid:0,//新增或编辑操作时用到的文件夹id;
                                message:'',
                                content:[],
                                //提示
                                emsg:'',
                                isError:false,
                                //上传中
                                uploadings:[],
                                datalist:[],
                            }
                        },
                        components:{moveTo,newCommon,CommonTip,alertTip},
                        computed: {
                            myIds:function(){
                                const {ids,ids2,content,continued}=this;
                                return{
                                    ids,
                                    ids2,
                                    content,
                                    continued,
                                }
                            },
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/storage');
                            },
                            _new:function(){
                                return handleAuth(117,this.handles);
                            },
                            _upload:function(){
                                return handleAuth(118,this.handles);
                            },
                            _copy:function(){
                                return handleAuth(119,this.handles);
                            },
                            _download:function(){
                                return handleAuth(120,this.handles);
                            },
                            _edit:function(){
                                return handleAuth(121,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(122,this.handles);
                            },
                            paths:function(){
                                var paths='公共存储';
                                this.content.forEach(function(c){
                                    paths=paths+'\\'+c.name;
                                });
                                return paths;
                            }
                        },
                        watch:{
                            'myIds':{
                                        handler:function(val){
                                            //按钮规则;
                                            if(val.continued){
                                                $('.res-top p:eq(0)').children('a').addClass('blue-none').removeClass('blue');
                                                return false;
                                            }else{
                                                $("a.others").addClass('blue').removeClass('blue-none');
                                            }
                                            if((this.folder.length>0||this.file.length>0)&&(this.folder.length+this.file.length) == (val.ids.length + val.ids2.length)){
                                                $("#checkAll").prop("checked",true);
                                            }else{
                                                $("#checkAll").prop("checked",false);
                                            }
                                            //上传
                                            if(val.content.length < 1){
                                                if(val.ids.length == 1){
                                                    $("a.up").addClass('blue').removeClass('blue-none');
                                                }else{
                                                    $("a.up").addClass('blue-none').removeClass('blue');
                                                }
                                                // 新建文件夹
                                                if(val.ids2.length > 0||val.ids.length>1){
                                                    $("a.new").addClass('blue-none').removeClass('blue');
                                                 }else if(val.ids.length == 1){
                                                     for(var i = 0; i<this.folder.length; i++){
                                                        if(this.folder[i].id == val.ids[0]){
                                                            if(this.folder[i].owner){
                                                                $("a.new").addClass('blue').removeClass('blue-none');
                                                            }else{
                                                                $("a.new").addClass('blue-none').removeClass('blue');
                                                            }
                                                        }
                                                     }
                                                 }else{
                                                    $("a.new").addClass('blue').removeClass('blue-none');
                                                 }
                                                 //编辑
                                                 if ((val.ids.length==0&&val.ids2.length==1)||(val.ids.length==1&&val.ids2.length==0)) {
                                                    if(val.ids2.length == 1&&val.ids.length==0){
                                                        for(var i = 0; i<this.file.length; i++){
                                                            if(this.file[i].id == val.ids2[0]){
                                                                if(this.file[i].owner){
                                                                    $("a.edit").addClass('blue').removeClass('blue-none');
                                                                }else{
                                                                    $("a.edit").addClass('blue-none').removeClass('blue');
                                                                }
                                                            }
                                                        }
                                                    }else if(val.ids.length == 1&&val.ids2.length==0){
                                                        for(var i = 0; i<this.folder.length; i++){
                                                            if(this.folder[i].id == val.ids[0]){
                                                                if(this.folder[i].owner){
                                                                    $("a.edit").addClass('blue').removeClass('blue-none');
                                                                }else{
                                                                    $("a.edit").addClass('blue-none').removeClass('blue');
                                                                }
                                                            }
                                                        }
                                                    }                                                     
                                                 }else{
                                                     $("a.edit").addClass('blue-none').removeClass('blue');
                                                 }
                                            }else{
                                                if ((val.ids.length==0||val.ids.length==1)&&val.ids2.length==0) {
                                                    $("a.up").addClass('blue').removeClass('blue-none');
                                                }else{
                                                    $("a.up").addClass('blue-none').removeClass('blue');
                                                }
                                                if(val.content[0].owner){
                                                    if(val.ids2.length > 0||val.ids.length>1){
                                                        $("a.new").addClass('blue-none').removeClass('blue');
                                                     }else{
                                                         $("a.new").addClass('blue').removeClass('blue-none');
                                                     }
                                                     if ((val.ids.length==0&&val.ids2.length==1)||(val.ids.length==1&&val.ids2.length==0)) {
                                                         $("a.edit").addClass('blue').removeClass('blue-none');
                                                     }else{
                                                         $("a.edit").addClass('blue-none').removeClass('blue');
                                                     }
                                                }else{
                                                    $("a.new").addClass('blue-none').removeClass('blue');
                                                    if ((val.ids.length==0&&val.ids2.length==1)||(val.ids.length==1&&val.ids2.length==0)) {
                                                            if(val.ids2.length == 1&&val.ids.length==0){
                                                                for(var i = 0; i<this.file.length; i++){
                                                                    if(this.file[i].id == val.ids2[0]){
                                                                        if(this.file[i].owner){
                                                                            $("a.edit").addClass('blue').removeClass('blue-none');
                                                                        }else{
                                                                            $("a.edit").addClass('blue-none').removeClass('blue');
                                                                        }
                                                                    }
                                                                }
                                                            }else if(val.ids.length == 1&&val.ids2.length==0){
                                                                for(var i = 0; i<this.folder.length; i++){
                                                                    if(this.folder[i].id == val.ids[0]){
                                                                        if(this.folder[i].owner){
                                                                            $("a.edit").addClass('blue').removeClass('blue-none');
                                                                        }else{
                                                                            $("a.edit").addClass('blue-none').removeClass('blue');
                                                                        }
                                                                    }
                                                                }
                                                            }                                                     
                                                    }else{
                                                        $("a.edit").addClass('blue-none').removeClass('blue');
                                                    }
                                                }
                                            }
                                            //复制到
                                            if (val.ids.length>0||val.ids2.length>0) {
                                                $("a.res-copy").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.res-copy").addClass('blue-none').removeClass('blue');
                                            }
                                            //下载
                                            if (val.ids.length==0&&val.ids2.length===1) {
                                                $("a.down").addClass('blue').removeClass('blue-none');
                                            }else{
                                                $("a.down").addClass('blue-none').removeClass('blue');
                                            }
                                            // 新建文件夹
                                            
                                            // 编辑
                                            
                                            //删除
                                            if(val.ids.length > 0||val.ids2.length > 0){
                                                 $("a.del").addClass('blue').removeClass('blue-none');
                                            }else {
                                                $("a.del").addClass('blue-none').removeClass('blue');
                                            }
                                        },deep:true
                                    }
                        },
                        mounted:function(){
                            this.getCommonFiles();
                        },
                        methods:{
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
                            toggle(){
                                this.isA = !this.isA;
                            },
                            getCommonFiles(){
                                this.$http.get('/myResources/GetCommunalStorageFile',{
                                        params:{
                                            uid:this.uid,
                                            cfoid:this.cfoid,
                                            order:this.order
                                        }
                                    }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            if (d.msgid==200) {
                                                this.datalist=d.data;
                                                this.folder=this.datalist.folder;
                                                this.file=this.datalist.file;
                                                this.getUploading();
                                                this.$emit('changeSize');
                                                this.ids=[];
                                                this.ids2=[];
                                                for(let i=0;i<this.file.length;i++){
                                                        let info=this.file[i];
                                                        if(info.rtid==1){
                                                                // info.pic=require('../../assets/module/shipinmoren.png');
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
                                                        }else if(info.rtid==3){
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
                                                                                      info.path=pic;
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
                            getSize(size){
                                var num = Math.pow(1024,2);
                                var a = size/num;
                                return a.toFixed(2);
                            },
                            checkAll(){
                                    var _this=this;
                                    if($("#checkAll").prop("checked")){
                                        _this.ids=[];
                                        _this.folder.forEach(function(item){
                                            _this.ids.push(item.id);
                                        });
                                        _this.ids2=[];
                                        _this.file.forEach(function(item){
                                            _this.ids2.push(item.id);
                                        });                                       
                                    }else{
                                        _this.ids=[];
                                        _this.ids2=[];
                                    }
                          },
                          getClassName(suffix,little){
                                var myclass='';
                                switch(suffix){
                                    case '.docx':
                                    case '.doc':
                                        myclass= 'DOC';
                                        break;
                                    case '.pptx':
                                    case '.ppt':
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
                                        myclass='EXC';
                                        break;
                                    default:
                                        myclass='other';
                                    }
                                    if (little) {
                                        myclass='img-s '+myclass+'-s';
                                    }
                                    return myclass;
                          },
                          changeOrder(order){
                                this.order=order;
                                this.getCommonFiles();
                          },
                          //region 上传
                          upload(){
                                    if ($('a.up').hasClass('blue')) {
                                        this.continued=true;
                                        this.$parent.createUpload(0,this.cfoid,this.paths,6);
                                    }
                          },
                        closeUp(){
                            this.ids=[];
                            this.ids2=[];
                            $("#checkAll").prop("checked",false);
                            this.continued=false;
                        },
                          //endregion 上传
                        copy(){
                           if (!$('a.res-copy').hasClass('blue')) {
                                return false;
                            }
                            this.showCopy=true;
                            this.continued=true;
                        },
                        closeCopy(){
                            this.showCopy=false;
                            this.continued = false;
                            this.ids = [];
                            this.ids2 = [];
                            $("#checkAll").prop("checked",false);
                        },
                        CopyFiles(foid,type){
                                    this.showCopy=false;
                                    var parms={
                                        uid:this.uid,
                                        resid:this.ids2,
                                        fid:this.ids,
                                    };
                                    if(type){
                                        parms.cfoid=foid;
                                    }else{
                                        parms.foid=foid;
                                    }
                                    this.$http.post('/myResources/CommunalCopy',parms
                                    ).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        this.ids=[];
                                         this.ids2=[];
                                         $("#checkAll").prop("checked",false);
                                        if (d) {
                                            if (d.msgid==200) {
                                                this.files=d.data;
                                                this.emsg='操作成功';
                                            }else{
                                                this.emsg='操作失败';
                                            }
                                            this.isError=true;
                                            this.continued=false;
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                        this.continued=false;
                                    });
                          }, 
                          download(){
                                   if (!$('a.down').hasClass('blue')) {
                                        return false;
                                    }
                                    var id=this.ids2[0];
                                    var md5='';
                                    for(var i=0;i<this.file.length;i++){
                                        var file=this.file[i];
                                        if(file.id==id){
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
                          newFolder(){
                                if($(".opra .new").hasClass('blue-none')){
                                    return
                                }
                                this.hasPower=false;
                                this.isNew=true;
                                this.cid=0;
                                this.continued=true;
                          },
                          closeNew(){
                                this.ids=[];
                                this.ids2=[];
                                $("#checkAll").prop("checked",false);
                                this.isNew=false;
                                this.continued=false;
                          },
                          edit(){
                                if(!$(".opra .edit").hasClass('blue')){
                                    return
                                }
                                var len=this.ids.length;
                                var length=this.ids2.length;
                                if (len==0&&length==0) {
                                    this.emsg='请选择要编辑的文件夹或文件';
                                    this.isError=true;
                                    return false;
                                }
                                if ((len>1&&length==0)||(len==0&&length>1)) {
                                    this.emsg='不支持多行编辑';
                                    this.isError=true;
                                    return false;
                                }
                                if(len==1&&length==0){
                                    this.isNew=true;
                                    this.cid=this.ids[0];
                                    this.continued=true;
                                }
                                // 需要编辑文件功能是放开注释;
                                if (len==0&&length==1) {
                                    this.$parent.createUpload(this.ids2[0],0,'全部资源\\公共存储',6);
                                    this.continued=true;
                                }
                          },
                          delCommonFolder(){
                            if($(".opra .del").hasClass('blue-none')){
                                    return
                            }
                            var len=this.ids.length;
                            var length=this.ids2.length;
                            if (len==0&&length == 0) {
                                this.emsg='请选择要删除的文件夹或文件';
                                this.isError=true;
                                return false;
                            }
                            this.showDel=true;
                            this.continued=true;
                            if(length > 0&&len == 0){
                                this.message='你确定要删除选中的文件?';
                            }else if(length == 0&&len>0){
                                this.message='你确定要删除选中的文件夹?';
                            }else if(length>0&&len>0){
                                this.message='你确定要删除选中的文件夹/文件?';
                            }
                          },
                          closeDel(){
                            this.showDel=false;
                            this.continued=false;
                            this.ids = [];
                            this.ids2 = [];
                            $("#checkAll").prop("checked",false);
                          },
                          delFolder(){
                               this.$http.post('/myResources/CommunalDeleteFolder',{
                                    ids:this.ids,
                                    resIds:this.ids2
                                }).then(res=>{
                                    var d=$.parseJSON(res.data);
                                    if (d) {
                                        if (d.msgid==200) {
                                            this.getCommonFiles();
                                            this.showDel=false;
                                            this.emsg='删除成功';
                                        }else{
                                            this.emsg=d.msg;
                                        }
                                        this.isError=true;
                                        this.continued=false;
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                });
                          },
                          saveFolder(name,uids){
                            var val = name.trim();
                            if(!name || !val){
                                this.isError=true;
                                this.emsg='请输入文件夹名称';
                                return
                            }
                            if(uids.length < 1){
                                var str = '';
                            }else{
                                 var str=uids.join(',');
                            }                          
                            this.$http.post('/myResources/CommunalSaveFolder',{
                                            id:this.cid,
                                            name:name,
                                            fid:this.cfoid,
                                            uids:str,
                                        }).then(res=>{
                                            var d=$.parseJSON(res.data);
                                            this.isNew =false;
                                            if (d) {
                                                if (d.msgid==200) {
                                                    if(this.cid==0){
                                                        this.emsg='新建成功';
                                                    }else{
                                                        this.emsg='编辑成功';
                                                    }
                                                    this.getCommonFiles();
                                                }else{
                                                    this.emsg=d.msg;
                                                }
                                                this.isError=true;
                                                this.continued=false;
                                            }
                                        }).catch(err=>{
                                            console.log(err);
                                            this.continued=false;
                                        });
                          },
                          openContent(foid){
                                    this.cfoid=foid;
                                    this.getCommonFiles();
                                    $("#checkAll").prop("checked",false);
                                    //从content中清除掉后面的目录
                                    if (foid==1) {
                                        this.content=[];
                                    }else{
                                       for(var i=0;i<this.content.length;i++){
                                            var folder=this.content[i];
                                            if (folder.id==foid) {
                                                var inx=i+1;
                                                this.content.splice(inx, this.content.length-inx)
                                            }
                                        }
                                    }
                          },
                          openFolder(e,folder){
                                    if ($(e.currentTarget).is('input[type]')) {
                                        return false;
                                    }
                                    $("#checkAll").prop("checked",false);
                                    this.cfoid=folder.id;
                                    this.getCommonFiles();
                                    var exist=false;
                                    for(var i=0;i<this.content.length;i++){
                                        var c=this.content[i];
                                        if (c.foid==folder.id) {
                                            exist=true;
                                        }
                                    }
                                    if (!exist) {
                                        this.content.push(folder);
                                    }
                          },
                           getUploading(){
                                this.uploadings=[];
                                var _this=this;
                                this.$parent.tasklist.forEach(function(task){
                                    if(task.resType==6&&task.data.cfoid==_this.cfoid){
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
                                this.getCommonFiles();
                             }
            }
        }
</script>
<style lang="scss">
        .storages{
                height:73em;
                        width:80%;
                        float:left;
                        background:url("../../assets/module/u10.png") no-repeat;
                        background-size:100% 100%;
                        position:absolute;
                        left:20%;
                        top:0;
                        padding:2em;
                        
                       .cover{
                            width:100%; 
                            height:6em;
                        }
                        .res-top{
                            overflow:hidden;
                            border-bottom:1px dashed #ffffff;
                            a{
                                    color:#fff;
                                     text-decoration: none;
                                     margin-right:1em;
                                     border-radius:3px;
                                     padding:0.6em 2em;
                                     background-repeat:no-repeat;
                                     background-position:5px center;
                             }
                             .edit{
                                    background-size: 28%;
                                    padding-left: 2.8em;
                             }

                            .opra{
                                width:100%;
                                height:auto;
                                margin-top:1em;
                                margin-bottom:2em;                              
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
                                    margin-right:0.5%;
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
                                    background-size:50%;
                                }
                                .type-table{
                                    width:3em;
                                    height:3em;
                                    float:right;
                                    background:url("../../assets/resouce/u250.png") no-repeat center;
                                    background-size:50%;
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
                                        background-size:70%;
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
                                overflow:hidden;
                                padding:0;
                                 li{
                                    width:14%;
                                    height:8em;
                                    float:left;
                                    margin-right:2em;
                                    position:relative;
                                    text-align:center;
                                    //overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    cursor:pointer;
                                     .share-file{
                                            position:relative;
                                            .share-icom{
                                                position:absolute;
                                                bottom:2.5em;
                                                width:2em;
                                                height:2em;
                                                background:url("../../assets/artdetail/share.png") no-repeat center;
                                                background-size:100%;
                                                left:1em;
                                                z-index:10;
                                            }
                                      }
                                    .cover-box{
                                        position:absolute;
                                        width:1em;
                                        height:1em;
                                        top:35%;
                                        left:45%;
                                    }
                                    .bg{
                                        height:8em;
                                        background:url("../../assets/module/u176.png");
                                        background-size:100% 100%;
                                        padding:4%;
                                        box-sizing:border-box;
                                        position:relative; 
                                        .top-bg{
                                            width:100%;
                                            height:4em;
                                        }
                                        .img-pic{
                                            background-image:url("../../assets/module/picmoren.png");
                                            background-repeat: no-repeat;
                                            background-position: center center;
                                            background-size: contain;                                            
                                        }
                                        .cover-box{
                                            top:23%;
                                        }
                                    }
                                    .common-green{
                                        background-size:60%;
                                    }
                                    .other-green{
                                        background:url("../../assets/artdetail/floder2.png") no-repeat center;
                                        background-size:60%;
                                    }
                                    span{
                                        display:inline-block;
                                        width:100%;
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
        }
</style>