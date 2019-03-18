<template>
    <div class="data-manager">
            <div class="title">
               <a data-num="classification" @click="toggleTabs($event);" class="cur">{{classification}}</a>
    　　　<a data-num="sources" @click="toggleTabs($event);" >{{sources}}</a>
               <a data-num="position" @click="toggleTabs($event);" >{{position}}</a>
               <a data-num="postitle" @click="toggleTabs($event);" >{{postitle}}</a>
               <a data-num="department" @click="toggleTabs($event);" >{{department}}</a>
               <a data-num="release" @click="toggleTabs($event);" >{{release}}</a>
               <a data-num="creation" @click="toggleTabs($event);" >{{creation}}</a>
               <a data-num="copyright" @click="toggleTabs($event);" >{{copyright}}</a>
    　　  </div>
            <live :is="currentView" keep-alive></live>
    </div>
</template>
<script type="text/ecmascript-6">
import sources from "./sources"
import classification from "./classification"
import position from "./position"
import postitle from "./postitle"
import department from "./department"
import release from "./release"
import creation from "./creation"
import copyright from "./copyright"
export default {
        name:"data-manager",
        data () {
             return {
                 sources: "来源", //导航栏文本1
                 classification: "分类", //导航栏文本2
                 position:"职务",
                 postitle:"职称",
                 department:"部门/班级",
                 release:"首次发布方式",
                 creation:"创作性质",
                 copyright:"版权归属方式",
                currentView: 'classification', //默认选中first子组件
             };
         },
         components: {
             sources,
             classification,
             position,
             postitle,
             department,
             release,
             creation,
             copyright
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
.data-manager{
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
            line-height:3em;
            padding-left:3em;
            font-size:1.4em;
            border-bottom:1px dashed #fff;

            a{
                color:#fff;
                display:inline-block;
                margin-right:0.5em;
                text-decoration: none;
                width:6em;
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