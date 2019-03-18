<template>
<div v-if="show" class="masklayer">
    <div class="new-sou" >
        <div class="edit-top">
            <p>{{type}}{{title}}</p>
            <span @click="closetip" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>{{title}}名称：</span>
                <input type="text" v-model="name" v-validate="{'required':true}" :name="title+'名称'" maxlength="40" :placeholder="'请输入'+title+'名称'" />
            </p>
            <p class="is-danger" v-show="errors.has(title+'名称')" >{{errors.first(title+'名称')}}</p>          
            <p>
                <span>{{title}}描述：</span>
                <textarea :name="title+'描述'" cols="60" rows="8" 
                :placeholder="'输入'+title+'描述备注，最多400字'"
                v-model="description" maxlength="400"></textarea>
            </p>
            <p style="margin-top:8em;">
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use" v-model="enabled" value="1">&nbsp;&nbsp;启用
                </label>
                <label for=""><input type="radio" name="use" v-model="enabled" value="0">&nbsp;&nbsp;禁用
                </label>
            </p>
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @click="save">保存</a>
            <a href="javascript:void(0)" @mousedown="closetip">取消</a>

        </div>
  </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            name:"",
            description:"",
            enabled:1
        }
    },
  name: 'new-sou',
  props:["show","title","model","type"],
  watch:{
    show(val,oldVal){
        $(".is-danger").css("display","none")
        if(val){
            if(this.model){
                this.name=this.model.name;
                this.description=this.model.description;
                this.enabled=this.model.enabled;
            }
        }else{
            this.name='';
            this.description='';
            this.enabled=1; 
        }
    },
  },
  methods: {
            closetip(){
              this.$emit('closeEvent');
            },
            save(){
                var _this=this;
                this.$validator.validateAll().then((result)=>{
                      if (result) {
                            _this.$emit('saveEvent',_this.name,_this.description,_this.enabled);
                        }
                 });
            }

    }
}
</script>

<style lang="scss">
    .new-sou{
        width:50em;
        height:35em;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:15em;
        left:50%;
        margin-left:-25em;
        padding:0 0.5em 2em !important;
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em !important;
            border:none !important;
            padding:0 2em;

            p{
                float:left;
            }
            span{
                float:right;
                font-size:2em;
                cursor:pointer;
            }
        }
        .edit-form{
            width:100%; 
            padding:0 2em;
            p{
                margin-top:2em;
                position:relative;
                height:auto;
                clear:both;

                span{
                    width:9em;
                    height:2.5em;
                    line-height:2.5em;
                    text-align:right;
                    display:inline-block;

                }
                input[type="text"]{
                    height:2.5em;
                    width:20em;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    position:absolute;
                    left:11em;
                }

                select{
                    color:#000;
                    height:2.5em;
                    width:10em;
                    position:absolute;
                    left:11em;
                }
                textarea{
                    position:absolute;
                    left:11em;
                    background:none;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    resize:none;
                }

                label{
                    position:relative;
                    left:2em;
                    margin-right:3em;
                }
            }
            .is-danger{
                margin-top:0;
            }
        }
        .edit-tip{
            margin-left:2.5em;
        }
        .edit-btn{
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