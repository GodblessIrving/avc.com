<template>
<div class="masklayer" v-show="isOpen">
    <div class="reset">
             <div class="move-title">
               <p class="title-name">重置密码</p>
               <p class="title-close" @click="close" style="font-size:2.2em; font-weight:400">×</p>
             </div>
            <div class="modal-body" style="padding:5% 10% 1%; box-sizing:border-box;">
              <p>
                <span>设置新密码：</span>
                <input type="text" placeholder="请输入新密码" v-model="password" @blur="beCome">
                <img src="../../assets/system/red.png" height="30" width="30" alt="">
              </p>
              <p class="new" v-show="newerror" >{{mess}}</p>
              <p>
                <span>确认新密码：</span>
                <input type="text" placeholder="请再次输入新密码" v-model="confirmPwd" @blur="change">
                <img src="../../assets/system/red.png" height="30" width="30" alt="">
              </p>
              <p class="sure" v-show="sure" >{{suremess}}</p>

              <p>
                <span>邮箱地址：</span>
                <input type="text" placeholder="请输入找回密码邮箱地址" v-model="mail" v-validate="{'mail':true}" name="邮箱地址">
              </p>
              <p class="is-danger" v-show="errors.has('邮箱地址')" >{{errors.first('邮箱地址')}}</p>
            </div>
            <div class="common-btn">
                <a href="javascript:void(0)" @click="save()">确定</a>
                <a href="javascript:void(0)" @click="close()">取消</a>
            </div>
      </div>
</div>
</template>

<script>
export default {
  name: 'reset',
  data(){
    return{
        password:'',
        confirmPwd:'',
        mail:'',
        pass:'',
        confirmpass:'',
        newerror:false,
        mess:'',
        sure:false,
        suremess:'',
    }
  },
  props:["isOpen","rtype","userId"],
  watch:{
    isOpen(val){
        if(!val){
            this.password='';
            this.confirmPwd='';
            this.mail='';
            this.pass = '';
            this.confirmpass = '';
            this.newerror=false,
            this.sure=false,
            $(".is-danger").css("display","none")
        }
    }
  },
  methods:{
    beCome(){
      var blooem = /[a-zA-Z0-9]/.test(this.password);
      if(!this.password){
        this.newerror = true;
        this.mess = "新密码不能为空";
      }else if(this.password.length<6){
        this.newerror = true;
        this.mess = "新密码至少为6个字符"
      }
      else if(this.password.length>18){
        this.newerror = true;
        this.mess = "新密码最多为18个字符"
      }else if(!blooem){
        this.newerror = true;
        this.mess = "新密码只允许输入字母及数字"
      }else if(this.confirmpass === this.password){
        this.sure = false;
        this.suremess = '';
      }else{
        this.newerror = false;
        this.mess = ""
      }
      this.pass = this.password;
      var _this = this;
      setTimeout(function(){
          var length = _this.password.length;
          _this.password = '';
          for(var i = 0; i < length; i++){
            _this.password = _this.password + '*';
          }
      }, 1000);
    },
    change(){
      this.confirmpass = this.confirmPwd;
      if(!this.confirmPwd){
        this.sure = true;
        this.suremess = '确认新密码不能为空';
      }else if(this.confirmPwd !== this.pass){
        this.sure = true;
        this.suremess = '确认新密码和新密码不匹配';
      }else{
        this.sure = false;
        this.suremess = '';
      }
      var _this = this;
      setTimeout(function(){
          var length = _this.confirmPwd.length;
          _this.confirmPwd = '';
          for(var i = 0; i < length; i++){
            _this.confirmPwd = _this.confirmPwd + '*';
          }
      }, 1000);
    },
    close(){
      this.$emit('closeEvent');
      this.$router.push({path: '/login'});
    },
    save(){
      if(this.confirmpass !== this.pass){
        this.sure = true;
        this.suremess = '确认新密码和新密码不匹配';
        return 
      }else if(this.newerror || this.sure){
        return
      }
      if(!this.password){
        this.newerror = true;
        this.mess = "新密码不能为空";
        return
      }
      if(!this.confirmPwd){
        this.sure = true;
        this.suremess = '确认新密码不能为空';
        return
      }
      this.$validator.validateAll().then((result)=>{
        if(result){
          this.$emit('saveEvent',this.userId,this.pass,this.confirmpass,this.mail);
        }
      })     
    }
  }
}
</script>

<style lang="scss" scoped>
  .reset{
    position:absolute;
    width:36em;
    top:13em;
    left:50%;
    margin-left:-19em;
    height:auto;
    z-index:9998;
    color:#fff;
    background:url("../../assets/module/u10.png") no-repeat;
    background-size:100% 100%;
    padding:0 0.3em 2em;
    .move-title{
       width:100%;
       height:3em;
       background-color:#0099ff;
       padding:0 2em;
       line-height:3em;
       .title-name{
         float:left;
         font-size:1.2em;
       }
       .title-close{
         float:right;
         cursor:pointer;
         font-size:1.5em;
         font-weight:700;
       }
     }
      .is-danger,.sure,.new{
        padding-left:7em;
        margin-top:0.3em !important;
        color:red;
      }
    .modal-body{
      p{
       margin-top:1em;
        span{
          display:inline-block;
          width:22%;
          text-align:right;
        }
        input{
            width:60%;
            height:2em;
            background-color:#fff;
            color:#666;
            border:1px solid #eee;
            border-radius:4px;
        }
      }
    }
    .common-btn{
      width:100%;
      text-align:center;
      margin-top:2em;
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
        border:none;
      }
      a:nth-child(2){
          background-color:#666666;
      }
    }
  }
</style>
