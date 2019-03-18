<template>
<div  v-if="isNew" class="masklayer">
    <div class="edits">
        <div class="edit-top">
            <p>{{frmtitle}}</p>
            <span @click="closeNew" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>用户名：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text" v-model="username" v-validate="{'required':true,'acc':true,'max':18,'min':5}" 
                name="用户名" :disabled="isedit">
                <p class="is-danger" v-show="errors.has('用户名')" >{{errors.first('用户名')}}</p>
            </p>
            <p>
                <span>真实姓名：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text" v-model="realname" v-validate="{'required':true,'realname':true,'max':40}" name="真实姓名">
                <p class="is-danger" v-show="errors.has('真实姓名')" >{{errors.first('真实姓名')}}</p>
            </p>
            <p>
                <span>工号/学号：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text" placeholder="请输入工号/学号" v-model="code" v-validate="{'required':true}" name="工号/学号">
                <p class="is-danger" v-show="errors.has('工号/学号')" >{{errors.first('工号/学号')}}</p>
            </p>
            <p v-if="uid==0">
                <span>用户密码：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="password" placeholder="请输入用户密码" v-model="password" v-validate="{'required':true,'alpha_num':true,'max':18,'min':6}" name="用户密码">
                <p class="is-danger" v-show="errors.has('用户密码')" >{{errors.first('用户密码')}}</p>
            </p>
            <p v-if="uid==0">
                <span>确认用户密码：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="password" placeholder="请再次输入用户密码" v-model="password2" v-validate="{'required':true,'confirmed':'用户密码'}" name="确认用户密码">
                <p class="is-danger" v-show="errors.has('确认用户密码')" >{{errors.first('确认用户密码')}}</p>
            </p>
            <p>
                <span>用户角色：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="" >
                <select name="用户角色" id="" v-model="rid" v-validate="'not_in:0'">
                    <option value="0">请选择</option>
                    <option v-for="r in roles" :value="r.id">{{r.name}}</option>
                </select>
                <p class="is-danger" v-show="errors.has('用户角色')" >{{errors.first('用户角色')}}</p>
            </p>
            <p>
                <span>职称：</span>
                <select name="" id="" v-model="jid">
                    <option value="0">请选择</option>
                    <option v-for="j in jobtitles" :value="j.id">{{j.name}}</option>
                </select>
            </p>
            <p>
                <span>职务：</span>
                <select name="" id="" v-model="pid">
                    <option value="0">请选择</option>
                    <option v-for="p in positions" :value="p.id">{{p.name}}</option>
                </select>
            </p>
             <p>
                <span>所属部门：</span>
                <select name="" id="" v-model="did">
                    <option value="0">请选择</option>
                    <option v-for="d in depts" :value="d.id">{{d.name}}</option>
                </select>
            </p>
            <p>
                <span style="float:left">备注：</span>
                <textarea name="" id="" cols="100" rows="8" placeholder="输入用户信息备注，最多400字" v-model="remarks" v-validate="{'max':400}" name="备注"></textarea>
                <p class="is-danger" v-show="errors.has('备注')" >{{errors.first('备注')}}</p>
            </p>
            <p>
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use" value="1" v-model="enable" >&nbsp;&nbsp;启用</label>
                <label for=""><input type="radio" name="use" value="0" v-model="enable" >&nbsp;&nbsp;禁用</label>
            </p>
            <div class="edit-pic">
            <p class="img" v-if="avatar" v-bind:style = " { 'background-image' : 'url('+avatar+')'} "></p>
            <p class="img" v-else></p>
           <a href="javascript:void(0)" style="text-decoration: none;cursor:pointer">上传头像
                  <input type="file" accept="image/*" @change="uploadPhoto" id="myfile" style="opacity:0; position:relative;top:-1.5em;left:2.5em;cursor:pointer">
           </a>
        </div>
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @click="saveUser">确认</a>
            <a href="javascript:void(0)" @click="closeNew">取消</a>
        </div>
  </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            username:"",
            realname:"",
            code:"",
            avatar:'',
            rid:0,
            jid:0,
            pid:0,
            did:0,
            enable:1,
            remarks:"",
            roles:[],
            jobtitles:[],
            positions:[],
            depts:[],
            password:'',
            password2:'',
            isedit:false,
        }
    },
  name: 'new-user',
  props:[ "isNew","frmtitle",'uid'],
  watch:{
    isNew(val,oldVal){
          if (!val) {
            this.username="";
            this.realname="";
            this.code="";
            this.avatar="";
            this.password="";
            this.password2="";
            this.rid=0;
            this.jid=0;
            this.pid=0;
            this.did=0;
            this.remarks="";
            this.enable=1;
            this.isedit = false;
            var myfile=document.getElementById('myfile');
            myfile.value = '';
          }else{
                     if(this.uid>0){
                        this.$http.get('/systemManage/getUserById',{
                            params:{
                                id:this.uid
                            }
                        }).then(res=>{
                          var d=$.parseJSON(res.data);
                          if (d) {
                            if (d.msgid==200) {
                              var info=d.data;
                              this.isedit = true;
                              this.username=info.username;
                              this.realname=info.realname||'';
                              this.code=info.number;
                              this.avatar=info.avatar||'';
                              this.rid=info.rid;
                              this.jid=info.jid||0;
                              this.pid=info.pid||0;
                              this.did=info.did||0;
                              this.remarks=info.remarks||'';
                              this.enable=info.enable;
                            }else{
                              console.log(d.msg);
                            }
                          }
                        })
                }
          }
    }
  },
  mounted:function(){
    //获取角色数组
           this.$http.get('/systemManage/getRolesName').then(res=>{
              var  data=res.data;
              var d;
              if (data) {
                d=$.parseJSON(data);
              }
              if (d.msgid!=200) {
                      return false;
               }
                this.roles=d.data;
           }).catch(err=>{
                console.log(err);
          });
           //获取职称数组
           this.$http.get('/systemManage/getAllJobTitles',{
            params:{
              pagesize:9999,
              pzgeindex:1
            }
           }
           ).then(res=>{
              var  data=res.data;
              var d;
              if (data) {
                d=$.parseJSON(data);
              }
              if (d.msgid!=200) {
                      return false;
               }
                this.jobtitles=d.data;
           }).catch(err=>{
                    console.log(err);
          });
           //获取职位数组
           this.$http.get('/systemManage/getAllPositions'
           ).then(res=>{
              var  data=res.data;
              var d;
              if (data) {
                d=$.parseJSON(data);
              }
              if (d.msgid!=200) {
                      console.log(d.msg);
                      return false;
               }
                this.positions=d.data;
           }).catch(err=>{
                    console.log(err);
          });
           //获取部门数据
           this.$http.get('/systemManage/getAllDepts'
           ).then(res=>{
              var  data=res.data;
              var d;
              if (data) {
                d=$.parseJSON(data);
              }
              if (d.msgid!=200) {
                      console.log(d.msg);
                      return false;
               }
                this.depts=d.data;
           }).catch(err=>{
                    console.log(err);
          });       
  },
  methods: {
             closeNew (){
                this.$emit('closeNewEvent');
            },
            saveUser(){
                var _this=this; 
                this.$validator.validateAll().then((result)=>{
                        if (result) {    
                            _this.$emit('saveUserEvent',_this.uid,_this.username,_this.realname,_this.password,_this.code,_this.avatar,_this.rid,_this.jid,_this.pid,_this.did,_this.remarks,_this.enable);
                          }
                 });
            },
            uploadPhoto(){
              var myfile=document.getElementById('myfile');
              var blob=myfile.files[0];
              if(blob.size>2*1024*1024){
                    this.$emit('invalidImgEvent');
                    myfile.value = '';
                    return false;
              }
              //读取文件的MD5
              this.readImageMD5(blob,blob.name); 
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
                                var d=$.parseJSON(res.data);
                                if (d) {
                                    if (d.msgid==200) { 
                                      console.log(d.data);                                              
                                        var json=JSON.parse(d.data);
                                        var file_addr=json.file_addr;
                                        var addr=json.upload_addr;

                                        if(file_addr&&addr===null){
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
      .edits  .edit-form{
        max-height:30em !important;
      }
   }
    .edits{
        width:80em;
        height:auto;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:5em;
        left:50%;
        margin-left:-40em;
        padding:0 0.5em 3em;
        .is-danger{
          margin-top:0 !important;
          padding-left:11em;
        }
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            padding:0 2em;
            line-height:3em;
            border:none;

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
            overflow-y:auto;
            max-height:40em;
            position:relative;
            overflow-x:hidden;
            p{
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
                input[type="password"]{
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
                    position:relative;
                    left:2.6em;
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
        .edit-pic{
            width:10em;
            height:12em;
            position:absolute;
            top:3em;
            right:13em;
            text-align:center;
            
            p{
                width:10em;
                height:10em;
                border-radius:50%;
                overflow:hidden;
                background-size:cover;
                background-repeat:no-repeat;
                background-position:center center;
            }
            .img{
               background-image:url("../../../assets/setUser/u404.png");
            }
        }
    }
</style>