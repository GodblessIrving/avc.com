<template>
    <div class="personmess">
        <div class="edit-form">
            <p>
                <span>用户名：</span>
                <img src="../../assets/system/red.png" height="30" width="30" alt="" >
                <input type="text" v-model="username" disabled="true" style="color:#999">
            </p>
            <p>
                <span>真实姓名：</span>
                <img src="../../assets/system/red.png" height="30" width="30" alt="" >
                <input type="text" v-model="realname" v-validate="{'required':true,'realname':true,'max':40}" name="真实姓名">
                <p class="is-danger" v-show="errors.has('真实姓名')">{{errors.first('真实姓名')}}</p>
            </p>
            <p>
                <span>邮箱地址：</span>
                <input type="text" placeholder="请输入邮箱地址" v-model="Email" v-validate="{'mail':true}" name="email">
                <p style="margin:0; padding-left:11em;">忘记密码，可通过邮箱找回</p>
                <p class="is-danger" v-show="errors.has('email')" >{{errors.first('email')}}</p>
            </p>
            <p>
                <span>用户角色：</span>
                <img src="../../assets/system/red.png" height="30" width="30" alt="" >
                <select name="用户角色" id="" v-model="rid" disabled="true" style="color:#999">
                    <option value="0">请选择</option>
                    <option v-for="r in roles" :value="r.id">{{r.name}}</option>
                </select>
            </p>
            <p v-if="rolename">
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
                <select name="" id="" v-model="did" disabled="true" style="color:#999">
                    <option value="0">请选择</option>
                    <option v-for="d in depts" :value="d.id">{{d.name}}</option>
                </select>
            </p>
            <p>
                <span style="float:left">备注：</span>
                <textarea name="" id="" cols="100" rows="8" placeholder="输入用户信息备注，最多400字" v-model="remarks" v-validate="{'max':400}" name="备注"></textarea>
                <p class="is-danger" v-show="errors.has('备注')" >{{errors.first('备注')}}</p>
            </p>
            <p style="margin-top:3em; margin-left:8em;">
                注：用户名、角色和所属部门由于系统自动设置，如有修改请与管理员联系
            </p>
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @mousedown="saveUser">保存</a>
            <a href="javascript:void(0)" @click="closeNew">取消</a>
        </div>
        <div class="edit-pic">
            <p v-if="avatar" class="img" v-bind:style = " { 'background-image' : 'url('+avatar+')'} ">
                <!-- <img v-if="avatar" :src="avatar" alt="" width="100%">
                <img v-else src="../../assets/setUser/u404.png" width="100%" alt=""> -->
            </p>
            <p v-else class="img"></p>
           <a href="javascript:void(0)" style="text-decoration: none;cursor:pointer">上传头像</a>
           <input type="file" accept="image/*" @change="uploadPhoto" id="myfile" style="opacity:0; position:relative;top:-1.5em;left:2.5em;cursor:pointer">
        </div>
        <alert-tip :isShowtip="isShowtip" :message="message" @closeTipEvent="close"></alert-tip>
       </div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../alertTip"
export default {
        name:"personmess",
        data(){
        return{
            username:"",
            realname:"",
            avatar:"",
            Email:"",
            rid:0,
            jid:0,
            pid:0,
            did:0,
            remarks:"",
            roles:[],
            jobtitles:[],
            positions:[],
            depts:[],
            isShowtip:false,
            message:'',
            userInfo:{},
            rolename:true,
            uid:0,
        }
    },
  components:{alertTip},
  mounted:function(){
      let user=this.$store.state.user;
      this.uid = this.$store.state.user.uid;
      this.getUserInfo();
      this.getRolelist();
      this.getPostitle();
      this.getPostionList();
      this.getDepartList();
  },
  methods: {
      getUserInfo(){
        this.$http.get('/User/GetUserInfo',{
          params:{
            uid:this.uid
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              var data = d.data;
              this.username = data.username;
              this.realname = data.realname;
              this.Email = data.email;
              this.rid = data.rid;
              this.jid = data.jid;
              this.pid = data.pid;
              this.did = data.did;
              this.remarks = data.remarks;
              this.avatar = data.avatar;
            }
          }
        })
      },
      //获取角色数组
      getRolelist(){
        this.$http.get('/systemManage/getRoles',{
                params:{
                    pagesize:9999,
                    pageindex:1,
                    name:''
                }
           }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid==200){
                  this.roles=d.data;
                  for(var i = 0; i < this.roles.length; i++){
                    if(this.roles[i].id == this.rid){
                        if(this.roles[i].name == '学生'){
                          this.rolename = false;
                        }else{
                          this.rolename = true;
                        }
                    }
                  }
                }else{
                  console.log(d.msg)
                }
              }               
           }).catch(err=>{
                console.log(err);
          });
      },     
      //获取职称数组
      getPostitle(){
        this.$http.get('/systemManage/getAllJobTitles'
           ).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                   this.jobtitles=d.data;
                }else{
                  console.log(d.msg)
                }
              }
           }).catch(err=>{
                    console.log(err);
          });
      },     
      //获取职位数组
      getPostionList(){
        this.$http.get('/systemManage/getAllPositions'
           ).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  this.positions=d.data;
                }else{
                  console.log(d.msg)
                }
              }
           }).catch(err=>{
                    console.log(err);
          });
      },    
      //获取部门数据
      getDepartList(){
        this.$http.get('/systemManage/getAllDepts'
           ).then(res=>{             
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                   this.depts=d.data;
                }else{
                  console.log(d.msg);
                }
              }  
           }).catch(err=>{
                    console.log(err);
          }); 
      },   
      closeNew (){
        this.getUserInfo();
      },
      close(){
        this.isShowtip = false;
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
                                var d=$.parseJSON(res.data);
                                if (d) {
                                    if (d.msgid==200) { 
                                      console.log(d.data);                                              
                                        var json=JSON.parse(d.data);
                                        var file_addr=json.file_addr;
                                        var addr=json.upload_addr;
                                        if(file_addr&&addr===null){
                                           console.log('头像秒传');
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
      saveUser(){
        this.$validator.validateAll().then((result)=>{
            if(result){
              this.$http.post('User/UpdateUserInfo',{
              uid:this.uid,
              realname:this.realname,
              email:this.Email,
              jid:this.jid,
              pid:this.pid,
              remarks:this.remarks,
              avatar:this.avatar
            }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                this.isShowtip = true;
                if(d.msgid==200){
                  if(d.data){
                      this.message="提交成功";
                      var d=sessionStorage.avc_info;
                      if(d){
                        var info = JSON.parse(d);
                         info.avatar = this.avatar;
                         info.realname = this.realname;
                         sessionStorage.setItem("avc_info",JSON.stringify(info));
                         localStorage.setItem("avc_info",JSON.stringify(info));
                         this.$store.commit('updateInfo',info);
                      }                 
                  }else{
                      this.message="提交失败"
                  }
                }else{
                  this.message=d.msg;
                }
              }
            }).catch(err=>{
              console.log(err)
            })
            }
        })
      }
   }
}
</script>
<style lang="scss">
.personmess{
        width:100%;
        height:75em;
        padding:2em;
        padding-left:10em;
        color:#fff;
        .is-danger{
          margin-top:0 !important;
          padding-left:11em !important;
        }
        .edit-form{
            width:100%; 
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
            top:10em;
            right:15em;
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
              background-image:url("../../assets/setUser/u404.png")
            }
        }
    }
</style>