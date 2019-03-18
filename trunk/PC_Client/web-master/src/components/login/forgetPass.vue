<template>
    <!-- <div class="modal fade" tabindex="-1" role="dialog" id="myModal" aria-labelledby="myModalLabel" style="top:200px">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header" style="background:#40aaf4; border:none;">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" style="color:#fff">找回密码</h4>
              </div>
            <div class="modal-body" style="padding:5% 10% 1%; box-sizing:border-box; background:#2d2d2d">
                <label style="width:100%; color:#fff; font-size:16px; font-weight:normal;">邮箱地址:<input type="text" placeholder="请输入注册时邮箱" style="background:#fff; width:70%; height:2.5rem; border:1px solid #828282; border-radius:8px; margin-left:5px; padding-left:5px; color:#333;"></label>
                <p style="color:#fff; margin-top:3rem;">注：重置密码链接将发送您的邮箱，请登录设置</p>
            </div>
            <div class="modal-footer" style="background:#2d2d2d; border:none;">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary">保存</button>
            </div>
          </div>
      </div>
  </div> -->
  <div v-if="isShow" class="masklayer">
    <div class="forget-pass">
        <div class="common-top">
            <span class="dangerous" v-if="dangerous"></span>
            <p>忘记密码</p>
            <span @click="closeDel" style="font-size:2.2em;">×</span>
        </div>
        <div class="common-form">
          <p>
            <span>邮箱地址：</span>
            <input type="text" placeholder="请输入注册时邮箱">
          </p>
          <p style="color:#fff; margin-top:3rem;">注：重置密码链接将发送您的邮箱，请登录设置</p>
        </div>      
        <div class="common-btn">
            <a href="javascript:void(0)" @click="saveDel">确认</a>
            <a href="javascript:void(0)" @click="closeDel">取消</a>
        </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'forgetPass',  
  props:["isShow"],
  methods:{
    saveDel(){},
    closeDel(){
      this.$emit('closeTipEvent');
    },
  }
}
</script>

<style lang="scss">
  .forget-pass{
        width:36em;
        height:auto;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:fixed;
        z-index:99999;
        top:50%;
        margin-top:-10em;
        left:50%;
        margin-left:-18em;
        padding:0 0.4em 2em;
        .common-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding:0 2em;
            color:#fff;
            .dangerous{
                float:left;
                width:1.5em;
                height:2em;
                background:url("../../assets/system/fengxian.png") no-repeat left center;
                background-size:70%;
            }
            p{
                float:left;
            }
            span{
                float:right;
                font-size:1.4em;
                cursor:pointer;
            }
        }
        .common-form{
            width:100%; 
            text-align:left;
            padding:3em 2em 1em;
            color:#fff;
            font-size:1.2em;
            position:relative;
            input{
                width:15em;
                border:1px solid #eee;
                border-radius:3px;
                height:1.8em;
            }
        }
       
        .common-btn{
            width:100%;
            text-align:center;
            margin-top:0em;
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
