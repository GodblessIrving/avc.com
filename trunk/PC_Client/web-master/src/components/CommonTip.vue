<template>
<div v-if="isShow" class="masklayer">
    <div class="common-tip">
        <div class="common-top">
            <span class="dangerous" v-if="dangerous"></span>
            <p>提示</p>
            <span @click="closeDel" style="font-size:2.2em;">×</span>
        </div>
        <div class="common-form">
            <p v-if="notDele" style="position:relative; top:-2em;">{{notMess}}</p>
           {{message}}
           <p v-if="iszhu" class="markMess">注：复制标注不会覆盖原有标注。</p>
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
  name: 'common-tip',
  data(){
    return{
        flag:false,
    }
  },
  props:["isShow","message",'iszhu','dangerous',"notDele","notMess"],
  watch:{
    isShow:function(){
        if(this.isShow){
            this.flag = false;
        }
    },
  },
  methods: {
             saveDel () {
                if(!this.flag){
                    this.$emit('delObjEvent');
                }
                this.flag = true; 
             },
             closeDel(){
                this.$emit('closeTipEvent');
             }
     }
}
</script>

<style lang="scss">
    .common-tip{
        width:40em;
        height:auto;
        background:url("../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:fixed;
        z-index:99999;
        top:50%;
        margin-top:-10em;
        left:50%;
        margin-left:-20em;
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
                background:url("../assets/system/fengxian.png") no-repeat left center;
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
            text-align:center;
            padding:5em 3em 3em;
            color:#fff;
            font-size:1.2em;
            position:relative;
            .markMess{
                font-size:0.8em; 
                position:absolute; 
                width:100%; 
                padding-left:2em; 
                text-align:left; 
                bottom:0.2em;
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