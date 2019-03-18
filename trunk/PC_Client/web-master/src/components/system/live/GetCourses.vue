<template>
<div class="masklayer" v-if="isGet">
    <div class="get-courses">
        <div class="edit-top">
            <p>获取课程</p>
            <span @click="close" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>课程ID：</span>
                <input type="text" placeholder="请输入课程ID" v-model="courseid">
            </p> 
            <p>
                <span>课表接口地址：</span>
                <input type="text" placeholder="请输入课程名称" v-model="apiUrl">
            </p> 
            <div class="time">
                <label><input type="checkbox" value="1" v-model="settime">设置时间</label>
                <div class="time-inner" :disabled="settime==0">
                    <span class="left">开始时间：</span>
                    <el-date-picker
                        v-model="starttime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="设置获取课程开始时间">
                    </el-date-picker>
                </div>
                <div class="time-inner" :disabled="settime==0">
                    <span class="left">结束时间：</span>
                    <el-date-picker
                        v-model="endtime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="{minTime: starttime}"
                        placeholder="设置获取课程结束时间">
                    </el-date-picker>
                </div>
            </div> 
      
        </div>
        <div class="edit-btn">
            <a href="javescript:void(0)" @click="save">保存</a>
            <a href="javescript:void(0)" @click="close">取消</a>
        </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'get-courses',
  data(){
        return{
            courseid:'',
            apiUrl:'',
            starttime:'',
            endtime:'',
            settime:0
        }
  },
  props:["isGet"],
    methods: {
      close (){
            this.$emit('closeEvent');
        },
      save (){
            this.$emit('saveEvent',this.courseid,this.apiUrl,this.starttime,this.endtime,this.settime);
        }
    }
}
</script>

<style lang="scss">
    .get-courses{
        width:50em;
        overflow:hidden;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:15em;
        left:50%;
        margin-left:-25em;
        padding:0 0.4em 2em;
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
            .time{
                width:100%;
                label{
                    margin-left:11.5em;
                    input{
                        position:relative;
                        top:2px;
                    }
                }
                .time-inner{
                    color:#666;
                    margin-bottom:15px;
                    .left{
                        width:8em;
                        height:2.5em;
                        line-height:2.5em;
                        text-align:right;
                        display:inline-block;
                        margin-right:3em;
                    }
                    div{
                        width:16em;
                        margin: 5px 0;
                        height:2em;

                        .el-input__inner{
                            background:none !important;
                            color:#666 !important;
                            border-color:#666;
                        }
                    }
                }

            }
            p{
                margin-top:2em;
                position:relative;
                height:auto;
                clear:both;

                span{
                    width:8em;
                    height:2.5em;
                    line-height:2.5em;
                    text-align:right;
                    display:inline-block;
                    margin-right:3em;

                }
                em{
                    font-style:normal;
                    color:#0099ff;
                    cursor:pointer;
                }
                input[type="text"]{
                    height:2.5em;
                    width:20em;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                }
                select{
                    width:10em;
                    height:2em;
                    color:#666;
                }
                label{
                    position:relative;
                    margin-right:3em;
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