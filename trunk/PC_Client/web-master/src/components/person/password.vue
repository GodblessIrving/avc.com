<template>
    <div class="password">
          <div class="password-inner">
          	<p>
                <span>用户原密码：</span>
                <img src="../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text"  placeholder="请输入用户密码" v-model="pass" @blur="beCome"/>
            </p>
            <p>
                <span>用户新密码：</span>
                <img src="../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text" placeholder="请输入设置的新密码" v-model="newpass" @blur="change"/>
                <p style="margin:0; text-align:left; padding-left:16.5em;">密码设置范围为6-18位字母、数字，区分大小写。</p>
            </p>
             <p>
                <span>确认用户密码：</span>
                <img src="../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text"  placeholder="请再次输入用户新密码" v-model="againPass" @blur='changePass'/>             
            </p>
            <a href="javascript:void(0)" @click="subPassWord">确认</a>
          </div>
          <alert-tip :isShowtip="isShowtip" :message="message" @closeTipEvent="closeTip"></alert-tip>
    </div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../alertTip"
export default {
      name:"password",
      data(){
          return{
            pass:'',
            newpass:'',
            againPass:'',
            isShowtip:false,
            message:'',
            password:'',
            oldpass:'',
            oldagainpass:'',
          }
        },
        components:{alertTip},
        computed:{
                uid:function(){
                    return this.$store.state.user.uid;
                }
        },
        methods:{
          beCome(){
            this.password = this.pass;
            var _this = this;
            setTimeout(function(){
                var length = _this.pass.length;
                _this.pass = '';
                for(var i = 0; i < length; i++){
                  _this.pass = _this.pass + '*';
                }
            }, 1000);
          },
          change(){
            this.oldpass = this.newpass;
            var _this = this;
            setTimeout(function(){
                var length = _this.newpass.length;
                _this.newpass = '';
                for(var i = 0; i < length; i++){
                  _this.newpass = _this.newpass + '*';
                }
            }, 1000);
          },
          changePass(){
            this.oldagainpass = this.againPass;
            var _this = this;
            setTimeout(function(){
                var length = _this.againPass.length;
                _this.againPass = '';
                for(var i = 0; i < length; i++){
                  _this.againPass = _this.againPass + '*';
                }
            }, 1000);
          },
          subPassWord(){
            if(!this.password){
              this.isShowtip = true;
              this.message = '请输入原密码！';
              return;
            }
            var blooem = /[a-zA-Z0-9]/.test(this.oldpass);
            if(!blooem || this.oldpass.length > 18 || this.oldpass.length < 6){
              this.isShowtip = true;
              this.message = '您密码设置不符合设置规范，请重新设置！';
              return;
            }
            if(this.oldpass != this.oldagainpass){
              this.isShowtip = true;
              this.message = '您两次输入密码不一致，请重新输入！';
              return;
            }
            this.$http.post('/User/ResetUserPassword',{
              uid:this.uid,
              oldpwd:this.password,
              newpwd:this.oldpass
            }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  this.isShowtip = true;
                  this.message = '重置密码成功！即将跳转至登录页面';
                  var  _this = this;
                  setTimeout(function(){
                      _this.$router.push({path: '/login'});
                  }, 2000);
                }else{
                  this.isShowtip = true;
                  this.message = d.msg;                  
                  if(d.data==5){
                    var  _this = this;
                    setTimeout(function(){
                        _this.$router.push({path: '/login'});
                    }, 2000);
                  }
                }
              }
            }).catch(err=>{
              console.log(err);
            })
          },
          closeTip(){
            this.isShowtip = false;
            this.pass = '';
            this.newpass = '';
            this.againPass = '';
          }
        }
      }
</script>
<style lang="scss">
.password{
	width:100%;
	position:relative;
	color:#fff;
      input{
        padding-left:0.3em;
      }
      .alert-tip .common-form{
        padding-top:3em;
      }
	.password-inner{
		width:40%;
		height:auto;
		position:absolute;
		left:50%;
		margin-left:-20%;
		top:4em;
		text-align:center;
		p{
          		   margin-top:2em;
          		   position:relative;
          		   height:auto;
          		   clear:both;

          		   span{
          		       width:7em;
          		       height:2.5em;
          		       line-height:2.5em;
          		       text-align:right;
          		       display:inline-block;
          		       margin-right:1em;

          		   }
          		   input[type="text"]{
          		       height:2.5em;
          		       width:20em;
          		       border-radius:3px;
          		       border:1px solid #4e4e4e;
          		       left:11em;
          		   }
          		   input[type="password"]{
          		       height:2.5em;
          		       width:20em;
          		       border-radius:3px;
          		       border:1px solid #4e4e4e;
          		       left:11em;
          		   }          		
          		}
          		a{
          		      display:inline-block;
          		      color:#fff;
          		      text-decoration: none;
          		      width:5em;
          		      margin-top:4em;
          		      height:2.5em;
          		      line-height:2.5em;
          		      margin-left:5em;
          		      text-align:center;
          		      background-color:#0099ff;
          		      border-radius:3px;
          		  }
	}
}
</style>