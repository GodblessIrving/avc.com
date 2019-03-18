<template>
    <div class="config" v-if="isConfig">
        <div class="edit-top">
            <p>配置计算机通讯原理与应用直播</p>
            <span @click="close">X</span>
        </div>
        <div class="edit-form">
            <p>
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use" value="1" v-model="enable">&nbsp;&nbsp;启用</label>
                <label for=""><input type="radio" name="use" value="0" v-model="enable">&nbsp;&nbsp;禁用</label>
                <a href="javescript:void(0)" @click="addRow">新增</a>

            </p>
             <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10">序号</th>
                        <th width="25">开始时间</th>
                        <th width="25">结束时间</th>
                        <th width="30">播出URL</th>
                        <th width="10">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(s,index)  in settings" v-if="settings">
                        <td>{{index+1}}</td>
                        <td>
                            <el-date-picker
                                v-model="s.starttime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                placeholder="选择开始时间">
                            </el-date-picker>
                        </td>
                        <td>
                            <el-date-picker
                                v-model="s.endtime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                :picker-options="{minTime: s.starttime}"
                                placeholder="选择结束时间">
                            </el-date-picker>
                        </td>
                        <td>
                            <input type="text" placeholder="请输入播出地址" class="adress" v-model="s.url">
                        </td>
                        <td><a href="javascript:void(0)" @click="remove(s)">删除</a></td>
                    </tr>
                </tbody>
             </table>
        </div>
        <div class="edit-btn">
            <a href="javescript:void(0)" @save="save">保存</a>
            <a href="javescript:void(0)" @click="close">取消</a>
        </div>
  </div>
</template>
<script>
export default {
  name: 'config',
  data(){
        return{
            enable:1,
            settings:[
                    {
                    starttime:'',
                    endtime:'',
                    url:''
                }
            ]
        }
  },
  props:["isConfig",'config'],
  watch:{
        'config':{
            handler:function(val,oldVal){
                if (val) {
                    this.settings=val;
                }else {
                   this.settings= [{
                                            starttime:'',
                                            endtime:'',
                                            url:''
                                        }];
                }
            },
            deep:true
        }
  },
  methods: {
      close (){
            this.$emit('closeEvent');
        },
     save (){
            this.$emit('saveEvent',this.settings);
        },
        addRow(){
            var s={
                starttime:'',
                endtime:'',
                url:''
            }
            this.settings.push(s);
            console.log(s);
        },
        remove(e){
            this.settings.removevalue(e);
        }
    }
}
</script>

<style lang="scss">
    .config{
        width:90em;
        overflow:hidden;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:15em;
        left:50%;
        margin-left:-60em;
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
            padding:0 2em;
            p{
                padding:2em 0;
                position:relative;
                height:auto;
                clear:both; 
                border-bottom:1px solid #000;               
                label{
                    position:relative;
                    margin-right:3em;
                }
                a{
                    display:inline-block;
                    color:#fff;
                    text-decoration: none;
                    width:4em;
                    height:2em;
                    float:right;
                    line-height:2em;
                    text-align:center;
                    background-color:#0099ff;
                    border-radius:3px;
                }
            }
            table{
                width:100%;

                th{
                    font-weight:normal;
                    font-size:1.1em;
                    text-align:center;
                    color:#0099ff;
                }

                td{
                    text-align:center;
                    padding:8px 0;

                    .adress{
                            width:80%;
                            height:3em;
                            border:1px solid #666;
                            border-radius:3px;
                    }
                    div{

                        .el-input__inner{
                            background:none !important;
                            height:3em !important;
                        }
                    }

                    a{
                        color:#f00;
                        text-decoration: none;
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