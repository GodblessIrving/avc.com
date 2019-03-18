<template>
    <div class="transcoding-r">
            <div class="title">
                <a data-num="queue" @click="toggleTabs($event);" class="cur">{{queue}}</a>
    　　　 <a data-num="record" @click="toggleTabs($event);" >{{record}}</a>
                <a data-num="formwork" @click="toggleTabs($event);" >{{formwork}}</a>
                <a data-num="resour" @click="toggleTabs($event);" >{{resour}}</a>
    　　  </div>
            <live :is="currentView" keep-alive></live>
    </div>
</template>
<script type="text/ecmascript-6">
import queue from "./queue"
import record from './record'
import formwork from './formwork'
import resour from './resour'
export default {
        name:"transcoding",
        data () {
             return {
                queue: "转码队列", //导航栏文本1
                record: "转码记录", //导航栏文本2
                formwork:'转码模板',
                resour:'转码资源',
                currentView: 'queue', //默认选中first子组件
             };
         },
         components: {
             queue,
             record,
             formwork,
             resour
         },
         methods: {
             toggleTabs (e) {
                var dom = e.currentTarget;
                 this.currentView = e.target.getAttribute('data-num');
                 $(dom).addClass('cur').siblings().removeClass('cur')
             }
         }
    }
</script>
<style lang="scss">
.transcoding-r{
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
                width:5em;
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