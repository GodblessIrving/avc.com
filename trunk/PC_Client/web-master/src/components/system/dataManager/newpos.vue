<template>
<div v-if="isPos" class="masklayer">
    <div class="newpos-tip">
        <div class="common-top">
            <p>{{type}}</p>
            <span @click="closeDel" style="font-size:2.2em">×</span>
        </div>
        <div class="common-form">
           <p v-if="isedit">
               <span class="left">{{mestitle}}ID：</span>
               <span>{{plist.id}}</span>
           </p>
           <p>
               <span class="left">{{mestitle}}名称：</span>
               <input type="text" :placeholder="'请输入'+mestitle+'名称'" v-validate="{'required':true}" :name="mestitle+'名称'" v-model="posName" maxlength="40">
               <p class="is-danger" v-show="errors.has(mestitle+'名称')">{{errors.first(mestitle+'名称')}}</p> 
           </p>
        </div>
        
        <div class="common-btn">
            <a href="javascript:void(0)" @click="save()">保存</a>
            <a href="javascript:void(0)" @mousedown="closeDel">取消</a>
        </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'newpos-tip',
  data(){
    return{
        posName:'',
    }
  },
  watch:{
    isPos(val,oldVal){
        $(".is-danger").css("display","none");
        if(!val){
            this.posName = '';
        }else{
            if(this.plist){
                this.posName = this.plist.name;
            }
        }
    },
  },
  props:["isPos","isedit","type","plist","mestitle"],
  methods: {
             closeDel(){
                this.posName = '';
                this.$emit('closeTipEvent');
             },
             save(){
                var _this=this;
                this.$validator.validateAll().then((result)=>{
                      if (result) {
                            _this.$emit('saveTipEvent',_this.posName);
                        }
                    });
                
             }
         }
}
</script>

<style lang="scss">
    .newpos-tip{
        width:40em;
        height:20em;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:fixed;
        z-index:10;
        top:50%;
        left:50%;
        margin-top:-10em;
        margin-left:-20em;
        padding:0 0.4em 2em;
        .is-danger{
            padding-left:9.5em;
        }
        .common-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding:0 2em;

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
            padding:4em 0em 0em 5em;

            p{
                margin-bottom:1em;
                overflow:hidden;
                .hot{
                    padding-left:2em;
                    background:url("../../../assets/system/red.png") no-repeat left center;
                }
                .left{
                    display:inline-block;
                    width:8em;
                    text-align:right;
                    margin-right:1em;
                }
                input{
                    border:1px solid #eee;
                    width:15em;
                    height:1.8em;
                    border-radius:3px;
                }
            }
        }
       
        .common-btn{
            width:100%;
            text-align:center;
            margin-top:3em;
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