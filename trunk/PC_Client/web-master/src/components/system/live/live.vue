<template>
    <div class="live">
            <div class="title">
                <a data-num="channel" @click="toggleTabs($event);" class="cur">{{channel}}</a>
    　　　 <a data-num="courses" @click="toggleTabs($event);" >{{courses}}</a>
    　　  </div>
            <live :is="currentView" keep-alive></live>
    </div>
</template>
<script type="text/ecmascript-6">
import channel from "./channel"
import courses from "./courses"
export default {
        name:"live",
        data () {
             return {
                channel: "直播频道管理", //导航栏文本1
                courses: "直播课程管理", //导航栏文本2
                currentView: 'channel', //默认选中first子组件
             };
         },
         components: {
             channel,
             courses
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
.live{
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
    }
</style>