  <template>
    <div class="login-view" @keydown.enter="loginUser">
        <div class="bg">
            <img src="../assets/login/u32.png" alt="" width="25%">
            <div class="content">
                <h1>媒体资源管理系统V2.0</h1>
                <div class="loginForm">
                  <p class="title">登&nbsp;&nbsp;录</p>
                  <form action="">
                    <input type="text" placeholder="请输入用户名" class="userName" v-model="username" name="用户名"  v-validate="'required||min:5||max:18||acc'">
                    <p class="is-danger" v-show="errors.has('用户名')" >{{errors.first('用户名')}}</p>
                    <input type="password" placeholder="请输入用户密码" class="userPass" v-model="password" name="密码"  v-validate="'required||min:6||max:18||alpha_num'">
                    <p class="is-danger" v-show="errors.has('密码')" >{{errors.first('密码')}}</p>

                    <p class="remPass">
                      <label><input type="checkbox" v-model="checked" value="1">记住密码</label>
                      <a href="javascript:void(0)" class="forget" >忘记密码？</a>
                    </p>
                      <a href="javascript:void(0)" class="login" @click="loginUser"></a>
                  </form>
                </div>
                <p class="copy">Copyright© 2010-{{year}} THTF.AVCC.All Rights Reserved. 同方艾威康 版权所有
</p>
                <forget-pass @closeTipEvent="close" :isShow="showPass"></forget-pass>
                <tip :message="message" :isShowtip="isError" @closeTipEvent="closeMsgTip"></tip>
            </div>
        </div>
        
    </div>
  </template>

  <script>
  import forgetPass from "../components/login/forgetPass.vue"
  import Tip from "../components/alertTip"
  import {resolveRoutes} from  '../scripts/routes.config.js' 

  export default {
    name: 'login-view',
    data() {
        return {
          message:"",
          username:"",
          password:"",
          checked:false,
          isError:false,
          year:0,
          showPass:false,
        }
    },
    watch:{
      'username':{
          handler:function(val,oldVal){
            if(!val){
              this.password ='';
            }
          }
      },
    },
    mounted:function(){
      localStorage.removeItem('avc_info');
      sessionStorage.removeItem('avc_info');
      sessionStorage.removeItem('avc_reset');
      var  _psw=localStorage.avc_psw;
      if (_psw) {
        var arr=_psw.split('&');
        var t1=parseInt(arr[2]);
        var t2=new Date().getTime();
        if (t1>t2) {
         this.username=arr[0];
         var cmd=this.$route.query.cmd;
         var  name=cmd==undefined?'':cmd.name;
         if (name=='reset') {
             this.password='';
             this.checked=false;
         }else{
             this.password=arr[1];
             this.checked=true;
         }
        }
      };
      var year = new Date();
      this.year = year.getFullYear();
    },
    components: { forgetPass,Tip},
    methods:{
      //关闭消息提示框
      closeMsgTip(data){
        this.isError=false;
        this.message='';
        //点击关闭或者确定时清空输入；
        this.username='';
        this.password='';
        this.checked=false;
      },
      close(){
        this.showPass = false;
      },
      loginUser(){
        this.$validator.validateAll().then((result)=>{
          if (result) {
            
             this.$http.post('/user/loginuser',{
                  username:this.username,
                  pwd:this.password,
                  mac:'',
                  type:0,
                  ip:''
              }).then(res=>{
                var d=$.parseJSON(res.data);
                if (d.msgid!=200) {
                  this.message=d.msg;
                  this.isError=true;
                  return false;
                }
                //记住密码
                if (this.checked) {
                  var t=new Date();
                  var tt=t.getTime()+7*24*3600*1000;
                  var u=this.username+"&"+this.password+"&"+tt;
                  localStorage.setItem('avc_psw',u);
                }else{
                  localStorage.removeItem('avc_psw');
                }
                //store状态更新
                sessionStorage.setItem('avc_info',JSON.stringify(d.data));
                localStorage.setItem('avc_info',JSON.stringify(d.data))
                this.$store.commit('login',d.data);
                console.log(d.data)
                const routes=resolveRoutes(d.data.features);
                this.$router.addRoutes(routes);
                this.$store.commit('updateAuth',routes);                          
                this.$router.push(routes[0].path);
           }).catch(err=>{
              console.log(err);
          });
          }
        });
      },

    }
  }

   
  </script>

  <style lang="scss" scoped>
  .login-view {
    overflow:hidden;
    .bg{
      position:absolute;
      width:100%;
      height:100%;
      background:url("../assets/login/u0.jpg");
      background-size:100% 100%;
      overflow:hidden;
      min-width:1366px;
      .is-danger{
        text-align:left;
        padding-left:9em;
        margin-top:-1em;
      }
      img {
      margin: 4rem 0 1rem 4rem;
      }

      .content{
        width:100%;
        position:absolute;
        top:50%;
        margin-top:-18%;
        text-align:center;
        
        h1{
          color:#fff;
          font-size:5em;
        }

        .loginForm{
          width:35%;
          overflow:hidden;
          background:#fff;
          padding-bottom:3em;
          position:absolute;
          left:50%;
          margin-left:-17.5%;
          background:rgba(#182b3f, 0.8);
          border:1px solid #5582b1;
          border-radius:10px;
          padding:1rem;
          box-sizing:border-box;

          .title{
            color:#fff;
            font-size:2.5em;
          }
          input{
            width:60%;
            height:2.5em;
            border:1px solid #8d97a1;
            border-radius:20px;
            background-color:rgba(#27384a, 0.8);
            margin-bottom:1.5em;
            box-sizing:border-box;
            padding-left:8%;
            color:#fff;
          }
          .userName{
            background-image:url("../assets/login/u22.png");
            background-repeat:no-repeat;
            background-position:5px center;
            background-size:7%;
          }

          .userPass{
            background-image:url("../assets/login/u24.png");
            background-repeat:no-repeat;
            background-position:6px center;
            background-size:5%;
          }
          .remPass{
            width:60%;
            margin-left:20%;
          }
          .remPass input{
            width:auto;
            height:auto;
            position:absolute;
            left:-15px;
          }
          label{
              color:#fff;
              float:left;
              position:relative;
              left:18px;
              font-weight:normal;
          }
          .forget{
            float:right;
            color:#0099ff;
            text-decoration: underline;
          }
        }
        .login{
          background:none;
          border:none;
          outline:none;
          display:block;
          width:35%;
          height:6em;
          background:url("../assets/login/u6.png");
          background-size:100% 100%;
          color:#fff;
          position:relative;
          margin-top:2em;
          left:50%;
          margin-left:-17.5%;
         text-decoration: none;
         line-height:6em;
        }
      }
      .copy{
        text-align:center;
        position:fixed;
        bottom:15px;
        width:100%;
        color:#fff;
        font-size:16px;
      }
    }
  }
  </style>
