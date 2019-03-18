<template>
        <div class="my-clips">
                <div class="clips-top">
                        <div class="top-left">
                                <!-- <play :isShow="isShow" :isCut="isCut" class="cut-play"></play> -->
                                <div class="cut-info">
                                        <div class="info-left">
                                                <p>
                                                        <span>起始时间：</span>
                                                        <input type="text"><em>时</em>
                                                        <input type="text"><em>分</em>
                                                        <input type="text"><em>秒</em>
                                                </p>
                                                <p>
                                                        <span>结束时间：</span>
                                                        <input type="text"><em>时</em>
                                                        <input type="text"><em>分</em>
                                                        <input type="text"><em>秒</em>
                                                </p>
                                                <p>
                                                        <span>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长：</span>
                                                        <em>7'33''</em>
                                                </p>
                                        </div>
                                        <div class="info-middle">
                                                <p>
                                                        <span>位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置：</span>
                                                        <input type="text" class="position">
                                                </p>
                                                <p class="video-name">
                                                        <span>视频名称：</span>
                                                        <em style=" -webkit-box-orient: vertical;">跟谁学-职称英语简单看，李春化老师为您解析跟谁学-职称英语简单看，李春化老师为您解析</em>
                                                </p>
                                                <p>
                                                        <span>片段名称：</span>
                                                        <input type="text" class="clip-name">
                                                </p>
                                        </div>
                                        <div class="info-right">
                                                <a href="javascript:void(0)" v-bind:class='{ "blue" : isblue,"blue-none":!isblue}'>添加剪辑</a>
                                        </div>
                                </div>
                                <div class="cut-operation">
                                        <span>剪辑列表</span>
                                        <a href="javascript:void(0)" class="blue" @click="togglePre()">播放预览</a>
                                        <a href="javascript:void(0)" class="blue">提交合成</a>
                                </div>
                        </div>
                        <div class="top-right">
                                <p class="title">我的收藏</p>
                                <my-collect class="right-info"></my-collect>
                        </div>
                </div>
                <div class="cut-bottom">
                       <mark-pic :isText="isText"></mark-pic>
                </div>
                <preview :isPreview="isPreview" :isView="isView" @closeNewEvent="closeView()" class="view-play"></preview>
                <alert-tip @closeTipEvent="closeTip" :isShowtip="isShowtip" :message="message"></alert-tip>
        </div>
</template>
<script  type="text/ecmascript-6">
        import MyCollect from "./MyCollect"
        import MarkPic from "./../videodetil/MarkPic";
        import preview from "../task/preview"
        import alertTip from "../alertTip"
        export default {
                name:"my-clips",
                data(){
                        return{
                                isCut:true,
                                isShow:false,
                                isblue:false,
                                isText:false,
                                isPreview:false,
                                isView:false,
                                isShowtip:false,
                                message:'',
                        }
                },
                components:{MyCollect,MarkPic,preview,alertTip},
                mounted:function(){
                    this.isShowtip = true;
                    this.message="该页面功能正在开发中"
                },
                methods:{
                        togglePre(){
                                this.isPreview = true;
                        },
                        closeView(){
                                this.isPreview = false;
                        },
                        closeTip(){
                            this.isShowtip = false;
                        },
                }       
        }
</script>
<style lang="scss">
        .my-clips{
                height:73em;
                width:80%;
                float:left;
                background:url("../../assets/module/u10.png") no-repeat;
                background-size:100% 100%;
                position:absolute;
                left:20%;
                top:0;
                padding:2em;

                .view-play{
                        top:10px;
                        width:57em;
                        background:none;

                        .close-btn{
                                top:1em;
                                right:2em;
                        }
                }

                em{
                        font-style:normal;
                }
                input[type="text"]{
                        border:1px solid #0099ff;
                        background-color:#fff;
                        border-radius:3px;
                        color:#0099ff;
                        width:2em;
                        margin-right:5px;
                }

                .clips-top{
                        width:100%;
                        overflow:hidden;

                        .top-left{
                                width:60%;
                                float:left;
                                overflow:hidden;

                                .cut-play{
                                        width:100%;
                                        height:37em;

                                        video{
                                                height:30.5em;
                                        }
                                }
                                .cut-info{
                                        width:100%;
                                        height:11em;
                                        background:url("../../assets/module/u10.png") no-repeat;
                                        background-size:100% 100%;
                                        padding:1em;

                                        p{
                                                margin-bottom:2em;
                                        }

                                        .info-left,.info-middle{
                                                width:40%;
                                                float:left;

                                                .video-name{
                                                        width:100%;
                                                        height:3em;

                                                        span{
                                                                float:left;
                                                                width:28%;
                                                        }
                                                        em{
                                                                float:left;
                                                                width:70%;
                                                                display: -webkit-box;
                                                                -webkit-line-clamp: 2;
                                                                overflow: hidden;
                                                                height:2.8em;
                                                        }               
                                                }
                                        }
                                        .info-middle{
                                                p{
                                                        margin-bottom:1em;
                                                }
                                                .position{
                                                        width:5em;
                                                }
                                                .clip-name{
                                                        width:8em;
                                                }
                                        }
                                }
                                .info-right{
                                        float:left;
                                        width:20%;
                                        line-height:8em;

                                        a{
                                                color:#fff;
                                                padding:0.5em 1em;
                                                border-radius:3px;
                                                text-decoration: none;
                                                margin-left:2em;
                                        }
                                }

                                .cut-operation{
                                        color:#0099ff;
                                        padding:1em;

                                        span{
                                                font-size:1.4em;
                                        }
                                        a{
                                                color:#fff;
                                                padding:0.5em;
                                                border-radius:3px;
                                                text-decoration: none;
                                                margin-left:2em;
                                        }
                                }
                        }
                        .top-right{
                                width:39%;
                                float:left;
                                margin-left:1%;

                                .title{
                                        width:100%;
                                        font-size:1.4em;
                                        height:1.8em;
                                        line-height:1.8em;
                                        padding-left:1em;
                                        border-left:3px solid #0099ff;
                                        color:#0099ff;
                                }

                                .right-info{
                                        width:100%;
                                }
                        }
                }
                .cut-bottom{
                        width:100%;
                        clear:both;
                        height:16em;
                        position:relative;

                        ul{
                                height:16em !important;
                        }
                               
                }
                
        }
</style>