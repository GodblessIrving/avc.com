<template>
    <div class="logbook">
            <div class="title">
                <a data-num="LoginBook" @click="toggleTabs($event);" class="cur">{{LoginBook}}</a>
    　　　 <a data-num="operation" @click="toggleTabs($event);" >{{operation}}</a>
    　　  </div>
            <live :is="currentView" keep-alive></live>
    </div>
</template>
<script type="text/ecmascript-6">
import LoginBook from "./LoginBook"
import operation from "./operation"
export default {
        name:"logbook",
        data () {
             return {
                LoginBook: "登录日志", //导航栏文本1 
                operation: "操作日志", //导航栏文本2
                currentView: 'LoginBook', //默认选中first子组件
             };
         },
         components: {
             LoginBook,
             operation
         },
         methods: {
             toggleTabs (e) {
                 this.currentView = e.target.getAttribute('data-num');
                 var  dom=e.target;
                 $(dom).addClass('cur').siblings().removeClass('cur');
             }
         }
    }
</script>
<style lang="scss">
.logbook{
        height:83em;
        width:76%;
        float:left;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        left:18%;
        top:0;
        padding:2em;

        .title{
            height:3em;
            line-height:2.3em;
            padding-left:3em;
            font-size:1.4em;
            border-bottom:1px dashed #fff;

            a{
                color:#fff;
                display:inline-block;
                margin-right:5em;
                text-decoration: none;
                width:8em;
                height:2.5em;
                text-align:center;
                cursor:pointer;
            }
             .cur{
                border-bottom:2px solid #0099ff;
                color:#0099ff;
             }
        }
        .excel{
            margin-top:1.5em;
        }
    }
</style>