<template>
        <div class="synthesis-r">
                <div class="title">
                        <a data-num="cutlist" @click="toggleTabs($event);" class="cur">{{cutlist}}</a>
    　　　         <a data-num="compostask" @click="toggleTabs($event);" >{{compostask}}</a>
    　　     </div>
                <cutlist :is="currentView" keep-alive></cutlist>
                <alert-tip :isShowtip="isShowtip" :message="message" @closeTipEvent="closeTip"></alert-tip>
        </div>
</template>
<script  type="text/ecmascript-6">
        import cutlist from "./cutlist"
        import compostask from "./compostask"
        import alertTip from "../alertTip"
        export default {
                name:"synthesis",
                data () {
                    return {
                       cutlist: "我的剪辑列表", //导航栏文本1
                       compostask: "合成任务", //导航栏文本2
                       currentView: 'cutlist', //默认选中first子组件
                       isShowtip:false,
                       message:'',
                    };
                },
                components: {
                    cutlist,
                    compostask,
                    alertTip
                },
                mounted:function(){
                    this.isShowtip = true;
                    this.message = "该页面功能正在开发中"
                },
                methods: {
                    toggleTabs (e) {
                        this.currentView = e.target.getAttribute('data-num');
                       var dom = e.currentTarget;
                       $(dom).addClass("cur").siblings().removeClass("cur");
                    },
                    closeTip(){
                            this.isShowtip = false;
                     },
                }
        }
</script>
<style lang="scss">
        .synthesis-r{
                height:73em;
                width:80%;
                float:left;
                background:url("../../assets/module/u10.png") no-repeat;
                background-size:100% 100%;
                position:absolute;
                left:20%;
                top:0;
                padding:2em;
                .title{
                         height:3em;
                         line-height:2.3em;
                         padding-left:3em;
                         font-size:1.4em;
                
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