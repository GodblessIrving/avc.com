<template>
<div v-if="boolean" class="masklayer">
    <div class="migration">
        <div class="edit-top">
            <p>{{title}}迁移</p>
            <span @click="close();" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <div>
                <span class="left">已选择{{title}}：</span>
                <div class="right" style="max-height:10em; overflow-y:auto">
                    <p v-for="c in contents" v-if="c.enabled&&ids.contain(c.id)">
                        <span :title="c.name?c.name:c.class" style="font-weight:normal;">{{c.name?c.name:c.class}}</span>
                        <span @click="remove(c)" style="width:1em;">×</span>
                    </p>
                </div>
            </div>  
            <div>
                <span class="left">迁移至：</span>
                <div class="right" style="height:27em; overflow-y:auto">
                      <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                            <thead>
                                <tr>
                                    <th width="30">选择</th>
                                    <th width="70">{{title}}名称</th>
                                </tr>           
                            </thead>
                            <tbody>
                                <tr v-for="c in contents" v-if="c.enabled&&!ids.contain(c.id)">
                                    <td><input type="radio" :value="c.id" v-model="target" name="options"></td>
                                    <td>{{c.name?c.name:c.class}}</td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>         
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @click="save()">保存</a>
            <a href="javascript:void(0)" @click="close()">取消</a>
        </div>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return{
        target:0
    }
  },
  name: 'migration',
  props:["boolean","title","contents","ids"],
  methods: {
             close(){
                  this.$emit('closeMigreEvent');
                  this.target=0;
            },
             save(){
                  this.$emit('saveMigreEvent',this.target);
                  this.target=0;
            },
            remove(e){
                this.$parent.ids.removevalue(e.id);
            }
         }
}
</script>

<style lang="scss">
    .migration{
        width:50em;
        overflow:hidden;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:10em;
        left:50%;
        margin-left:-25em;
        padding:0 0.5em 2em;
        .edit-top{
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
                font-size:2em;
                cursor:pointer;
            }
        }
        .edit-form{
            width:100%; 
            div{
                padding:2em 0 1em;
                .left{
                    width:15%;
                    float:left;
                    text-align:right;
                }
                .right{
                    float:left;
                    width:80%;
                    padding:0;
                    margin-bottom:2em;
                     table{
                    width:100%;
                    text-align:center;
                    tr{
                        height:3em;
                        line-height:3em;
                        border-top:1px solid #313030;
                        th{
                            color:#0099ff;
                            font-size:1.3em;
                            font-weight:normal;
                            text-align:center;
                            background-color:#242424;
                            }
                            th:first-child,td:first-child{
                                text-align:left;
                                padding-left:10px;
                                box-sizing:border-box;
                             } 

                            td{
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;                         
                    }

                }
                  tr:nth-child(2n){
                        background-color:#242424;
                    }
                    tr:nth-child(2n+1){
                        background-color:#1c1b1b;
                    }
             }

                    p{
                        float:left;
                        width:6em;
                        height:2.5em;
                        line-height:2.5em;
                        text-align:center;
                        margin-right:1em;
                        background-color:#0099ff;

                        span{
                            cursor:pointer;
                            margin-left:0.5em;
                            font-weight:bolder;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            float:left;
                            width:3.5em;
                        }
                    }
                }
            }
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