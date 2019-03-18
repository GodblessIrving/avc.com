<template>
<div v-if="show" class="masklayer">
    <div class="new-courses">
        <div class="edit-top">
            <p>创建课程直播</p>
            <span @click="close" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>课程ID：</span>
                <input type="text" placeholder="请输入课程ID" v-model='courseid'>
            </p> 
            <p>
                <span>课程名称：</span>
                <input type="text" placeholder="请输入课程名称" v-model='coursename'>
            </p>  
            <p>
                <span>开课学院：</span>
                <input type="text" placeholder="请输入开课学院" v-model='college'>
            </p> 
             <p>
                <span>授课教师：</span>
                <input type="text" placeholder="请输入授课老师姓名" v-model='teacher'>
            </p> 
            <p>
                <span>职称：</span>
                <select  v-model='jid'>
                    <option value="0">请选择</option>
                    <option v-for="j in jobtitles" v-if="jobtitles" :value="j.id">{{j.name}}</option>
                </select>
            </p> 
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
  name: 'new-courses',
  data(){
    return{
        courseid:'',
        coursename:'',
        college:'',
        teacher:'',
        jid:0,
        jobtitles:[]
    }
  },
  props:["show",'editmodel'],
  watch:{
    editmodel(val,oldVal){
        if (val) {
            this.courseid=val.courseid||'';
            this.coursename=val.coursename||'';
            this.college=val.college||'';
            this.teacher=val.teacher||'';
            this.jid=val.jid||0;
        }else{
            this.courseid='';
            this.coursename='';
            this.college='';
            this.teacher='';
            this.jid=0;
        }
    }
  },
  mounted:function(){
        this.getJobTitles();
  },
  methods: {
      close (){
            this.$emit('closeEvent');
        },
      save (){
            this.$emit('saveEvent',this.courseid,this.coursename,this.college,this.teacher,this.jid);
        },
        getJobTitles(){
            this.$http.get('/SystemManage/GetAllJobTitles'
            ).then(res=>{
                var d=$.parseJSON(res.data);
                //console.log(d);
                if (d) {
                    if (d.msgid==200) {
                        this.jobtitles=d.data;
                    }else{
                        console.log(d.msg);
                    }
                }
            }).catch(err=>{
                console.log(err);
            });
        }
    }
}
</script>

<style lang="scss">
    .new-courses{
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
            padding:0 2em;
            background-color:#0099ff;
            line-height:3em;

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