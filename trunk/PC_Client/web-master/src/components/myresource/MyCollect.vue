<template>
    <div class="my-collect">
    　　　　<nav>
    　　　　　　<span data-num="videocollect" @click="toggleTabs($event);" class="active">{{videocollect}}</span>
            　           <span data-num="audiocollect" @click="toggleTabs($event);">{{audiocollect}}</span>
    　　　　</nav>
　　　　　　<videocollect :is="currentView" keep-alive></videocollect>
　　    </div>
</template>

<script  type="text/ecmascript-6">
import videocollect from './videocollect'
import audiocollect from './audiocollect';

export default {
        name:"my-collect",
        data () {
             return {
                videocollect: "视频", //导航栏文本1
                audiocollect: "音频", //导航栏文本2
                currentView: 'videocollect', //默认选中first子组件
             };
         },
         components: {
             videocollect,
             audiocollect,
         },
         props:["isShow"],
         methods: {
             toggleTabs (e) {
                 this.currentView = e.target.getAttribute('data-num');
                 var dom = e.currentTarget;
                 $(dom).addClass("active").siblings().removeClass("active");
             }
         }
    }
</script>

<style lang="scss">
    .my-collect{
        width:30%;
        float:left;
        color:#fff;
        margin-top:0.5em;
        nav{
            width:100%;
            height:3em;
            position:relative;
            top:1px;

            span{
                float:left;
                width:30%;
                height:3em;
                line-height:3em;
                border-radius:3px 3px 0 0;
                text-align:center;
                cursor:pointer;
            }
            .active{
                background-color:#303030;
                border:1px solid #282828;
                color:#0099ff;
                border-bottom:none;
            }
        }
    }
</style>