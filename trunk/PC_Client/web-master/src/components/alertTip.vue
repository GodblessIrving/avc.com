<template>
    <div class="masklayer" v-if="isShowtip">
     <div class="alert-tip">
         <div class="common-top">
             <p>提示</p>
             <span @click="closeDel" style="font-size:2.2em;">×</span>
         </div>
         <div class="common-form">
            {{message}}
         </div>
         <div class="common-btn">
             <a href="javascript:void(0)" @click="closeDel">确认</a>
         </div>
     </div>
    </div>
</template>

<script>
export default {
  name: 'common-tip',
  props:["isShowtip","message"],
  methods: {
             closeDel(){
                this.$emit('closeTipEvent');
             },
         }
}
</script>

<style lang="scss">
    .alert-tip{
        width:30em;
        height:auto;
        background:url("../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:fixed;
        top:50%;
        margin-top:-8em;
        left:50%;
        margin-left:-15em;
        padding:0 0.2em 2em;
        z-index:9999;
        .common-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding:0 1em;
            color:#fff;

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
            text-align:center;
            padding:3.5em 3em 3em;
            font-size:1.2em;
            font-weight:200;
            color:#fff;
        }
         .common-btn{
            width:100%;
            text-align:center;
            margin-top:-0.5em;
            a{
                display:inline-block;
                color:#fff;
                text-decoration: none;
                width:4em;
                height:2em;
                line-height:2em;
                text-align:center;
                background-color:#0099ff;
                border-radius:3px;
            }
         }
    }
</style>