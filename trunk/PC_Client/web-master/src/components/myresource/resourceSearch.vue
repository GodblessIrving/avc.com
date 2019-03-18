<template>
        <div class="resource-search">
                    <div class="res-top">
                        <p class="searchOpration">
                            <a v-if="_move" href="javascript:void(0)" class="blue-none move" data-num="move" @click="toggleBlock">移动到</a>
                            <a v-if="_delete" href="javascript:void(0)" class="blue-none del" @click="showTip()">删除</a>
                        </p>
                        <p style="font-size:1.2em;">
                            <span>全部资源</span>
                        </p>
                        <div class="last">
                            <label for="checkAll" style="cursor:pointer" ><input type="checkbox" id="checkAll" @change="checkAll">全选</label>
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
                        <ol class="show-li">
                            <li v-for="f in files">
                                <div style='width:100%; overflow:hidden;' v-if="f.rtid==1">
                                    <input type="checkbox" :value="f.resid" v-model="ids">
                                    <div class='left'>
                                        <div class="resource-pic" @click="goTodetail(f.rtid,f.resid,f.foid)">
                                            <p class="img" v-if="f.thumbnail" v-bind:style="{ 'background-image' : 'url('+f.thumbnail+')'}"></p>
                                            <p class="img" v-else></p>
                                        </div>
                                    </div>
                                    <div class="midle">
                                        <p :title="f.restitle" v-html="f.newtitle" style="cursor:pointer;" @click="goTodetail(f.rtid,f.resid,f.foid)"></p>
                                        <p class="road">{{f.path}}</p>
                                        <p class="sub" :class="[f.type == 2?'compositing':(f.type==1?'up-s':'collect-video')]">{{f.type ==2?'合成视频':(f.type==1?'上传视频':'收藏视频')}}</p>
                                    </div>
                                    <div class="right">
                                        <p class="indety blue-video">视频</p>
                                    </div>
                                </div>
                                <div style='width:100%; overflow:hidden;' v-if="f.rtid==2">
                                    <input type="checkbox" :value="f.resid" v-model="ids">
                                    <div class='left'>
                                        <div class="resource-pic" @click="goTodetail(f.rtid,f.resid,f.foid)">
                                            <p style="text-align:center; line-height:5em">
                                                <img src="../../assets/module/u35.png" alt="" width="50%">
                                            </p>
                                        </div>
                                    </div>
                                    <div class="midle">
                                        <p :title="f.restitle" v-html="f.newtitle" style="cursor:pointer;" @click="goTodetail(f.rtid,f.resid,f.foid)"></p>
                                        <p class="road">{{f.path}}</p>
                                        <p class="sub" :class="[f.type == 2?'compositing':(f.type==1?'up-s':'collect-video')]">{{f.type ==2?'合成音频':(f.type ==1?'上传音频':'收藏音频')}}</p>
                                    </div>
                                    <div class="right">
                                        <p class="indety blue-audio">音频</p>
                                    </div>
                                </div>
                                <div style='width:100%; overflow:hidden;' v-if="f.rtid==3">
                                    <input type="checkbox" :value="f.resid" v-model="ids">
                                    <div class='left'>
                                        <div class="resource-pic" @click="goTodetail(f.rtid,f.resid,f.foid)">
                                            <p class="img-pic" v-if="f.picpath" v-bind:style="{ 'background-image' : 'url('+f.picpath+')'}"></p>
                                            <p class="img-pic" v-else></p>
                                        </div>
                                    </div>
                                    <div class="midle">
                                        <p :title="f.restitle" v-html="f.newtitle" style="cursor:pointer;" @click="goTodetail(f.rtid,f.resid,f.foid)"></p>
                                        <p class="road">{{f.path}}</p>
                                        <p v-if="f.diff == 1" class="sub" :class="[f.type==0?'collect-video':'up-sone']">{{f.type==0?'收藏图片':'上传图片'}}</p>
                                        <p v-if="f.diff == 2" class="sub" :class="[f.type===0?'collect-video':'up-smore']">{{f.type==0?'收藏图册':'上传图册'}}</p>
                                    </div>
                                    <div class="right">
                                        <p class="indety blue-pic">图片</p>
                                    </div>
                                </div>
                                <div style='width:100%; overflow:hidden;' v-if="f.rtid == 4">
                                    <input type="checkbox" :value="f.resid" v-model="ids">
                                    <div class='left'>
                                        <div class="resource-pic" @click="goTodetail(f.rtid,f.resid,f.foid)">
                                            <p :class="flieTypeName(f.format)"></p>
                                        </div>
                                    </div>
                                    <div class="midle">
                                        <p :title="f.restitle" v-html="f.newtitle" style="cursor:pointer;" @click="goTodetail(f.rtid,f.resid,f.foid)"></p>
                                        <p class="road">{{f.path}}</p>
                                        <p class="sub" :class="[f.type===0?'collect-video':'doc-copy']">{{f.type==0?'收藏文稿':'上传文稿'}}</p>
                                    </div>
                                    <div class="right">
                                        <p class="indety blue-word">文稿</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div> 
                    <move-to :isBlock="isBlock" 
                                    :message="message"  
                                    @closeNewEvent="closeBlock"
                                    v-on:child-say="listenTomove">
                    </move-to>
                    <common-tip :isShow="isShow"
                                         :message="mess" 
                                         @closeTipEvent="closeTip" 
                                         @delObjEvent="deleteResource()">
                    </common-tip>
                    <alert-tip :isShowtip="isShowtip" 
                                   :message="messa" 
                                   @closeTipEvent="closeAlertTip()">
                    </alert-tip>                   
            </div>
</template>
<script  type="text/ecmascript-6">
        import moveTo from "./moveTo"
        import CommonTip from "../CommonTip"
        import alertTip from "../alertTip"
        import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js' 
        export default {
                name:"my-audio",
                        data(){
                            return{
                                isOrder:false,
                                isBlock:false,                                                       
                                title:'',                                
                                treeId:[],
                                rtid:2,
                                ids:[],
                                files:[],
                                message:"",
                                islock:false,
                                isShow:false,
                                isShowtip:false,
                                mess:"",
                                messa:'',                               
                                val:'',  
                                orderby:0,    
                                type:0,     
                                md5:'',                      
                            }
                        },
                        watch:{
                            num:function(){
                                this.getSearchFile();
                            },
                            ids:function(){
                                if(this.ids.length<this.files.length){
                                    $("#checkAll").prop("checked",false);
                                }else if(this.ids.length==this.files.length&&this.files.length!=0){
                                    $("#checkAll").prop("checked",true);
                                };
                                if(this.ids.length >=1){
                                    $(".searchOpration a").removeClass('blue-none').addClass('blue');
                                }else{
                                    $(".searchOpration a").removeClass('blue').addClass('blue-none');
                                }
                            },
                        },
                        props:["keywords","num"],
                        components:{moveTo,CommonTip,alertTip},
                        computed:{
                            uid:function(){
                                return this.$store.state.user.uid;
                            },
                            handles:function(){
                                return getChildrenAuth(this.$route.path+'/myaudio');
                            },
                            _move:function(){
                                return handleAuth(72,this.handles);
                            },
                            _delete:function(){
                                return handleAuth(74,this.handles);
                            },
                        },
                         mounted:function(){
                                this.getSearchFile();
                        },
                        methods:{
                            // 获取搜索的资源
                            getSearchFile(){
                                this.$http.get('/MyResources/GetMyFiles',{
                                    params:{
                                        uid:this.uid,
                                        rtid:0,
                                        orderby:this.orderby,
                                        keywords:this.keywords,
                                        pagesize:99999,
                                        pageindex:1
                                    }
                                }).then(res=>{
                                        var d=$.parseJSON(res.data);
                                        if (d) {
                                            if (d.msgid==200) {
                                                this.files = d.data;
                                                for(var i = 0; i<this.files.length; i++){
                                                    let info=this.files[i];
                                                    info.newtitle = this.getKeyStyle(info.restitle);
                                                    if(info.rtid == 1){
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
                                                                               info.thumbnail = pic;
                                                                        };                                                              
                                                                     }
                                                                 }
                                                             }
                                                         })
                                                    }else if(info.rtid == 3){
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
                                                                               info.picpath = pic;
                                                                        };                                                              
                                                                     }
                                                                 }
                                                             }
                                                         })  
                                                    }
                                                }
                                            }else{
                                                console.log(d.msg);
                                            }
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                    });
                            },
                            // 搜索的关键字红色字显示
                            getKeyStyle(oldval){
                                var html=oldval;
                                var key = this.keywords.split(' ');
                                for(var i=0;i<key.length; i++){
                                     var k= key[i];
                                     var inx=html.indexOf(k);
                                     if(inx>-1){
                                         html=html.substring(0,inx)+'<em>'+k+'</em>'+html.substr(inx+k.length,html.length-k.length-inx);
                                     }
                                }          
                                return html;
                            },
                            // 匹配文稿的文件名
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
                                    case ".xlsx":
                                    case ".xlsx":
                                        fliename = "EXC"
                                        break
                                    default:
                                        fliename='other';
                                    break;
                                }
                                return fliename;
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
                            // 全选
                            checkAll(){
                                if($("#checkAll").prop("checked")){
                                    this.ids = [];
                                    for(var i = 0; i < this.files.length; i++){
                                        this.ids.push(this.files[i].resid)
                                    }                                    
                                }else{
                                    this.ids = [];
                                }
                            },
                            // 排序
                            changeOrder(val){
                                this.orderby=val;
                                $(".order-div").css("display","none");
                                $(".order-div").removeClass('linav');
                                this.getSearchFile();
                            },
                            // 删除选中的资源文件
                            deleteResource(){
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
                                                    this.getSearchFile();
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
                            // 关闭公共提示弹窗
                            closeAlertTip(){
                                this.isShowtip = false;
                                this.ids = [];
                            },
                           // 移动弹窗的出现
                            toggleBlock(){                                       
                                this.isBlock = true;
                                this.message="移动到"
                                this.move = 0;
                                $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                $("a.move").addClass('blue').removeClass('blue-none');                             
                            },
                            // 确认移动资源
                            listenTomove(val){
                                this.floderId = val;
                                this.$http.post('/MyResources/MoveFoldersOrResources',{
                                    uid:this.uid,
                                    foid:[],
                                    resid:this.ids,
                                    tid:this.floderId
                                }).then(res=>{
                                    var d = $.parseJSON(res.data);
                                    if(d){
                                        if (d.msgid==200) {
                                            this.messa = "移动资源成功";
                                            this.isShowtip = true;
                                            this.ids=[];
                                            this.isBlock = false;
                                            this.getSearchFile();
                                        }
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                });
                            },
                            // 移动弹窗关闭
                            closeBlock(){
                                this.isBlock = false;     
                                this.ids = [];                  
                            },
                            // 删除弹窗出现
                            showTip(){
                                if($("a.del").hasClass('blue')){
                                    this.isShow = true;
                                    this.type = 3;
                                    this.mess = '您确定删除该资源吗？'
                                    $(".audio-opration a").addClass('blue-none').removeClass('blue');
                                    $("a.del").addClass('blue').removeClass('blue-none');
                                 } 
                            },
                            // 删除弹窗隐藏
                            closeTip(){
                               this.isShow = false;    
                               this.ids = [];                                
                            },
                            goTodetail(rtid,rid,foid){
                                if(rtid == 1){
                                    this.$router.push({path:'resource/video/detail',query:{id:rid} });
                                }else if(rtid == 2){
                                    this.$router.push({path:'resource/audio/detail',query:{id:rid} });
                                }else if(rtid == 3){
                                    this.$router.push({path:'resource/picture/detail',query:{id:rid,foid:foid} });
                                }else if(rtid == 4){
                                    for(var i = 0; i < this.files.length; i++){
                                        if(this.files[i].resid == rid && this.files[i].format == ".txt"){
                                            this.messa = "该格式暂不支持预览";
                                            this.isShowtip = true;
                                            return
                                        }
                                    }                                                     
                                    this.$router.push({path:'resource/draft/detail',query:{id:rid} });
                                }
                            },
                    }
        }
</script>
<style lang="scss">
        .resource-search{
                height:73em;
                width:78%;
                overflow-y:auto;
                float:left;
                background:url("../../assets/module/u10.png") no-repeat;
                background-size:100% 100%;
                position:absolute;
                left:22%;
                top:0;
                padding:2em;
                em{
                    font-style:normal;
                    color:red;
                }
                .img-s{
                    margin:0 0.3em !important;
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
                            background-size:80%;
                        }
                        .type-table{
                            width:3em;
                            height:3em;
                            float:right;
                            background:url("../../assets/resouce/u250.png") no-repeat center;
                            background-size:80%;
                        }
                        .up-video{
                                width:3em;
                                height:3em;
                                float:right;
                                margin-right:2em;
                                background:url("../../assets/resouce/u797.png") no-repeat center;
                                background-size:80%;
                                cursor:pointer;
                        }
                        .order{
                            width:3em;
                            height:3em;
                            float:right;
                            margin-right:6em;
                            position:relative;
                            .order-inner{
                                display:block;
                                width:3em;
                                height:3em;
                                background:url("../../assets/resouce/u253.png") no-repeat center;
                                background-size:80%;
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
                    overflow:hidden;
                    max-height:55em;
                     .blue-video{
                        background:url("../../assets/search/u3431.png") no-repeat left center;
                        background-size:30%;
                      }
                      .blue-audio{
                        background:url("../../assets/search/u3432.png") no-repeat left center;
                        background-size:30%;
                      }
                      .blue-pic{
                        background:url("../../assets/search/u3433.png") no-repeat left center;
                        background-size:30%;
                      }
                      .blue-word{
                        background:url("../../assets/search/u3434.png") no-repeat left center;
                        background-size:30%;
                      }
                      .blue-title{
                        background:url("../../assets/search/u3435.png") no-repeat left center;
                        background-size:30%;
                      }
                      .show-li{
                                width:100%;
                                padding:0;
                                height:48em;
                                overflow-y:auto;
                                li{
                                        width:100%;
                                        height:8em;
                                        margin-right:0.7%;
                                        text-align:center;
                                        position:relative;     
                                        border-bottom:1px dashed #444;  
                                        padding:0.3em 5em;    
                                        overflow:hidden;     
                                        input{
                                            position:absolute;
                                            left:2em;
                                            top:3.5em;
                                        }                
                                  .left{
                                    width:14%;
                                    float:left;
                                    .resource-pic{
                                        width:100%;
                                        height:7em;
                                        background:url("../../assets/module/u176.png");
                                        background-size:100% 100%;
                                        padding-top:0.5em;
                                        margin-top:0.5em;
                                        cursor:pointer;
                                        p{
                                            width:80%;
                                            margin-left:10%;
                                            height:5em;
                                            // span{
                                            //         display:inline-block;
                                            //         overflow:hidden;
                                            //         width:50%;
                                            //         height:3em;
                                            //         text-align:center;

                                            //         em{
                                            //             display:inline-block;
                                            //             width:90%;
                                            //             height:86%;
                                            //             background:url("../../assets/module/picmoren.png");
                                            //             background-size:contain;
                                            //             background-repeat:no-repeat;
                                            //             background-position:center center;
                                            //         }
                                            //     }

                                            //     .s1{
                                            //         transform:rotate(-15deg);
                                            //         position:relative;
                                            //         top:1em;
                                            //         left:-1em;
                                            //     }
                                            //     .s2{
                                            //         position:relative;
                                            //         top:-2.5em;
                                            //         left:1em;
                                            //     }
                                        }
                                        .img-pic{
                                            background:url("../../assets/module/picmoren.png");
                                            background-size:contain;
                                            background-repeat:no-repeat;
                                            background-position:center center;
                                        }

                                    }
                                  }
                                  .midle{
                                    float:left;
                                    width:70%;
                                    text-align:left;
                                    padding:0.5em 1em;
                                    p{
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                    }
                                    .road{
                                        margin-top:1em;
                                    }
                                    .sub{
                                        margin-top:1em;
                                        color:#0099ff;
                                        width:16%;
                                        padding-left:2em;
                                    }
                                  }
                                  .right{
                                    width:10%;
                                    float:left;
                                    padding-top:0.5em;
                                    .indety{
                                        text-align:left;
                                        height:2em;
                                        line-height:2em;
                                        padding-left:2.5em;
                                    }
                                  }
                                }
                        }
                }

        }
</style>