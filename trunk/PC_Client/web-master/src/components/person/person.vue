<template>
    <div class="person">
            <div class="title">
                <a data-num="mess" @click="toggleTabs($event);" class="cur mess">{{mess}}</a>
    　　　 <a data-num="personmess" @click="toggleTabs($event);" class="pers">{{personmess}}</a>
                <a data-num="password" @click="toggleTabs($event);" class="pass">{{password}}</a>
    　　  </div>
            <live :is="currentView"  keep-alive></live>
    </div>
</template>
<script type="text/ecmascript-6">
import mess from "./mess"
import personmess from "./personmess"
import password from "./password"
export default {
        name:"person",
        data () {
             return {
                mess: "消息", //导航栏文本1
                personmess: "个人信息设置", //导航栏文本2
                password:'修改密码',
                currentView: 'mess', //默认选中first子组件
                type:1,
                userinfo:{},
             };
         },
         components: {
             mess,
             personmess,
             password,
         },
         mounted:function(){
           this.getCurrentVIew();
         },
         watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": "getCurrentVIew"
         },
         methods: {
             toggleTabs (e) {
                var dom = e.currentTarget;
                 this.currentView = e.target.getAttribute('data-num');
                 $(dom).addClass('cur').siblings().removeClass('cur');
             },
             getCurrentVIew(){
                  this.type = this.$route.query.val;
                  if(this.type == 1){
                      this.currentView='mess';
                      $(".mess").addClass('cur').siblings().removeClass('cur');
                  }else if(this.type == 2){
                      this.currentView='personmess';
                      $(".pers").addClass('cur').siblings().removeClass('cur');
                  }else if(this.type == 3){
                      this.currentView='password';
                      $(".pass").addClass('cur').siblings().removeClass('cur');
                  }
             }
         }
    }
</script>
<style lang="scss">
.person{
        height:83em;
        width:93%;
        float:left;
        margin-left:1.3%;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        padding:2em;

        .title{
            height:3em;
            line-height:2.3em;
            padding-left:3em;
            font-size:1.4em;
            border-bottom:1px dashed #525252;

            a{
                color:#fff;
                display:inline-block;
                margin-right:5em;
                text-decoration: none;
                padding:0 2em;
                height:2.5em;
                text-align:center;
                cursor:pointer;
            }
             .cur{
                border-bottom:2px solid #0099ff;
                color:#0099ff;
             }
        }
    }
</style>