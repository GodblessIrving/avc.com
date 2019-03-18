<template>
<div v-if="isNew" class="masklayer">
    <div class="new-logo" >
        <div class="edit-top">
            <p>{{ntype}}</p>
            <span @click="close()" style="position:relative; z-index:10; font-size:2.2em">×</span>
        </div>
        <div class="edit-form" style="position:relative; top:-3em;">
           <div style="height:13em; margin-top:0;">
                <span style="margin-right:2em;">LOGO图片：</span>
                <p class="logobox">
                    <span v-if="avatar" class="logopic" v-bind:style = " { 'background-image' : 'url('+avatar+')'} ">
                    </span>
                    <span v-else class="logopic"></span>
                    <a style="font-style:normal; cursor:pointer; text-decoration: none; color:#0099ff">上传
                        <input type="file" accept="image/*"  id="myfile" style="opacity:0;  position:relative;top:-1.5em;left:1.5em;cursor:pointer" @change="uploadPhoto">
                    </a>
                </p>
                <em style="font-style:normal">建议尺寸（80*80）</em>
            </div>
            <p>
                <span>LOGO名称：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text" placeholder="请输入logo名称" v-model="name" v-validate="{'required':true}" :name="title+'名称'" maxlength="40">
            </p> 
            <p class="is-danger" v-show="errors.has(title+'名称')" >{{errors.first(title+'名称')}}</p>         
            <p>
                <span>备注：</span>
                <textarea  cols="60" rows="8" 
                :placeholder="'输入备注信息，最多400字'" v-model="discription" maxlength="400"></textarea>
            </p>
            <p style="margin-top:8em;">
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use"  :value="1" v-model="enable">&nbsp;&nbsp;启用
                </label>
                <label for=""><input type="radio" name="use"  :value="0" v-model="enable">&nbsp;&nbsp;禁用
                </label>
            </p>
        </div>
        <div class="edit-btn" style="position:relative; top:-3em;">
            <a href="javascript:void(0)" @click="saveLogo">保存</a>
            <a href="javascript:void(0)" @mousedown="close()">取消</a>
        </div>
        <alert-tip :isShowtip="isShowtip" :message="message" @closeTipEvent="closeAlert"></alert-tip>
  </div>
</div>
</template>

<script>
import alertTip from "../../alertTip";
export default {
  name: 'new-sou',
  data(){
    return{
        name:'',
        discription:'',
        enable:1,
        avatar:'',
        title:'logo',
        isShowtip:false,
        message:'',
    }
  },
  props:["isNew","ntype","logoinfo"],
  watch:{
    isNew:function(val){
        if(!val){
            this.name='';
            this.discription='';
            this.enable=1;
            this.avatar = '';
            var myfile=document.getElementById('myfile');
            myfile.value = '';
        }else{
            if(this.logoinfo){
                this.name=this.logoinfo.name;
                this.discription=this.logoinfo.remark;
                this.enable=this.logoinfo.enable;
                this.avatar = this.logoinfo.logo;
            }
        }
    },
  },
  components:{alertTip},
  methods: {
    close(){
            this.name = '';
            this.discription = "";
            this.$emit('closeEvent','from NewLogo');
        },
    closeAlert(){
        this.isShowtip = false;
    },
    saveLogo(){
        var _this=this;
        if(!this.avatar){
            this.isShowtip = true;
            this.message = '请上传图片'
            return;
        }
        this.$validator.validateAll().then((result)=>{
          if (result) {
                _this.$emit('saveEvent',_this.name,_this.discription,_this.enable,_this.avatar);
            }
        });
    },
   uploadPhoto(){
            var myfile=document.getElementById('myfile');
            var blob=myfile.files[0];
            var filename=blob.name;
             if(blob.size>2*1024*1024){
                   this.isShowtip = true;
                   this.message="建议尺寸为80*80的JPG或PNG图片，小于2MB";
                   myfile.value = '';
                  return false;
             }            
            this.readImageMD5(blob,filename); 
      },
      readImageMD5(blob,filename){
                  var fileReader=new FileReader();
                  var _this=this;

                  fileReader.onload=function(e){
                        var spark=new SparkMD5.ArrayBuffer();
                        spark.append(e.target.result);
                        var md5=spark.end();
                        this.frameMD5=md5;
                        console.log(md5,blob.size);
                        _this.$http.get('/storage/getuploadpath',{
                            params:{
                                fileid:md5,
                                filesize:blob.size,
                                ntimeout:2,
                                t:(new Date()).getTime()
                            }
                        }).then(res=>{
                          console.log(res);
                                var d=$.parseJSON(res.data);
                                if (d) {
                                    if (d.msgid==200) { 
                                      console.log(d.data);                                              
                                        var json=JSON.parse(d.data);
                                        var file_addr=json.file_addr;
                                        var addr=json.upload_addr;

                                        if(file_addr&&addr===null){
                                           console.log('logo秒传');
                                           _this.avatar=file_addr;
                                            return false; 
                                        }

                                        var path;
                                        for(var i=0;i<addr.length;i++){
                                              var ad=addr[i];
                                              if (ad.indexOf('ws:')==0) {
                                                path=ad;
                                                break;
                                              }
                                        }
                                        var uri=path+'file_id='+md5+'&file_size='+blob.size+'&file_name='+Base64.encode(filename);
                                        console.log(uri);
                                        var ws=_this.createSocket(uri,function(){
                                              ws.send(blob);
                                              var timer= setInterval(function(){
                                                      if (ws.bufferedAmount===0) {
                                                          ws.close();
                                                          clearInterval(timer);
                                                          _this.getFilePath(md5);
                                                      }
                                                  }, 100);
                                        });
                                      }else{
                                        console.log(d.msg);
                                      }
                                }
                        }).catch(err=>{
                          console.log(err);
                        });
                    };

                   fileReader.readAsArrayBuffer(blob);
            },
            createSocket(uri,callback){
                var ws = new WebSocket(uri);
                ws.onopen = function () {
                    console.log('connected成功');
                    if (callback)
                        callback();
                }
                ws.onmessage = function (e) {
                    var data = e.data;
                    console.info(data);
                }
                ws.onclose = function (e) {
                    console.info(e);
                    console.log('链接断开');
                }
                ws.onerror = function (e) {
                    console.info(e);
                    console.log('传输中发生异常');
                }
                return ws;
            },
            getFilePath(md5){
                      var _this=this;
                      
                      var code=setInterval(function(){
                        $.ajax({
                          url: _this.ajaxBaseUrl+'/storage/getuploadstatus',
                          type: 'GET',
                          dataType: 'json',
                          xhrFields:{withCredentials:true},
                          async : false,
                          cache:false,
                          data: {fileid: md5},
                        })
                        .done(function(res) {
                          var d=$.parseJSON(res);
                          if (d.msgid==200) {
                            var json=JSON.parse(d.data); 
                            if (json.status==16) {
                                 _this.$http.get('/storage/getfilepath',{
                                      params:{
                                          fileid:md5
                                      }
                                  }).then(res=>{
                                          var d=$.parseJSON(res.data);
                                          if (d.msgid==200) {
                                              var json=JSON.parse(d.data); 
                                              _this.avatar=json.file_addr;
                                          } 
                                  });

                                  clearInterval(code);
                            }
                          } 
                        })
                        .fail(function() {
                          console.log("error");
                        });
                      
                      }, 10);
            },
    }
}
</script>

<style lang="scss">
@media screen and (max-width: 1366px) {
      .new-logo{
        top:4em !important;
      }
   }
    .new-logo{
        width:50em;
        overflow:hidden;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:9em;
        left:50%;
        margin-left:-25em;
        padding:0 0.5em 2em !important;
        em{
            font-style:normal;
        }
        .is-danger{
            margin-top:0.5em !important;
        }
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em !important;
            border:none !important;
            padding:0 2em;

            p{
                float:left;
            }
            span{
                float:right;
                font-size:2em;
                cursor:pointer;
            }
        }
        .edit-form{
            width:100%; 
            padding:0 2em;
            .logobox{
                display:inline-block; 
                width:5em; 
                margin-right:1em; 
                height:7em; 
                overflow:hidden; 
                text-align:center;
                position:relative; 
                top:4.5em;
            }
            .logopic{
                display:block;
                width:100%;
                height:5em;
                margin-bottom:0.6em;
                background-image:url('../../../assets/module/u2160.png');
                background-size:contain;
                background-repeat:no-repeat;
                background-position:center center;
            }
            p,div{
                margin-top:2em;
                position:relative;
                height:auto;
                clear:both;

                span{
                    width:8em;
                    height:2.5em;
                    line-height:2.5em;
                    text-align:right;
                    display:inline-block;

                }
                input[type="text"]{
                    height:2.5em;
                    width:20em;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    position:absolute;
                    left:11em;
                }

                select{
                    color:#000;
                    height:2.5em;
                    width:10em;
                    position:absolute;
                    left:11em;
                }
                textarea{
                    position:absolute;
                    left:11em;
                    background:none;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    resize:none;
                }

                label{
                    position:relative;
                    left:2em;
                    margin-right:3em;
                }
            }
        }
        .edit-tip{
            margin-left:2.5em;
        }
        .edit-btn{
            width:100%;
            text-align:center;
            margin-top:3em;
            a{
                display:inline-block;
                color:#fff;
                text-decoration: none;
                width:4em;
                height:2em;
                line-height:2em;
                text-align:center;
                background-color:#0099ff;
                margin-right:3em;
                border-radius:3px;
            }
            a:nth-child(2){
                background-color:#666666;
            }
        }
    }
</style>