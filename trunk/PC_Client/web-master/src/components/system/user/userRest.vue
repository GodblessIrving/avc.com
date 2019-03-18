<template>
<div class="masklayer" v-if="isOpen">
    <div class="reset">
             <div class="move-title">
               <p class="title-name">重置密码</p>
               <p class="title-close" @click="close" style="font-size:2.2em; font-weight:400">×</p>
             </div>
            <div class="modal-body" style="padding:5% 10% 1%; box-sizing:border-box;">
              <p>
                <span>邮箱地址：</span>
                <input type="text" placeholder="请输入找回密码邮箱地址" v-model="mail" v-validate="{'mail':true}" name="邮箱地址">
              </p>
              <p class="is-danger" v-show="errors.has('邮箱地址')" >{{errors.first('邮箱地址')}}</p>
            </div>
            <div class="common-btn">
                <a href="javascript:void(0)" @click="save()">确定</a>
                <a href="javascript:void(0)" @mousedown="close()">取消</a>
            </div>
      </div>
</div>
</template>

<script>
export default {
  name: 'reset',
  data(){
    return{
        mail:'',
    }
  },
  props:["isOpen","rtype","userId"],
  watch:{
    isOpen(val){
        if(!val){
            this.mail='';
            $(".is-danger").css("display","none");
        }
    }
  },
  methods:{
    close(){
      this.$emit('closeEvent');
    },
    save(){
      this.$validator.validateAll().then((result)=>{
        if(result){
          this.$emit('saveEvent',this.userId,this.mail);
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
    background:url("../../../assets/module/u10.png") no-repeat;
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
      .is-danger{
        padding-left:7em;
        margin-top:0.3em !important;
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
