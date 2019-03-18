<template>
<div v-show="show" class="masklayer">
    <div class="upload">
        <div class="edit-top">
            <p>
                <em>正在上传</em>
                <em>({{success}}/{{tasklist.length}})</em>
            </p>
            <span @click="close()" style="font-size:2.4em;">×</span>
        </div>
        <div class="content white">
             <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th>文件名</th>
                        <th>大小</th>
                        <th>上传目录</th>
                        <th>进度/状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(t,i) in tasklist">
                    <td :title="t.filename">{{t.filename}}</td>
                    <td>{{(t.size/(1024*1024)).toFixed(2)}}MB</td>
                    <td>{{t.content}}</td>
                    <td :class="getClassName(t.status)" >{{getStatusTitle(t.status,t.percent)}}</td>
                    <td>      
                        <a v-if="t.status==1" href="javascript:void(0)" class="onstop" @click="pause()"></a>
                        <a v-if="t.status==2" href="javascript:void(0)" class="onstart" @click="continue1()"></a>
                        <a v-if="t.status==3" href="javascript:void(0)" class="restart" @click="restart(i,t.inx)"></a>
                        <a v-if="t.status in [0,1,2,3]" href="javascript:void(0)" class="del-s" @click="delete1(i)"></a>
                   </td>
                </tr>
                </tbody>
             </table>
        </div>
  </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'upload',
  props:{
    show:{
        type:Boolean,
        default:false
    },
    tasklist:{
        type:Array,
        required:true
    },
    success:{
        type:Number,
        required:true
    }
  },
  methods: {
    // #endregion
      close(){
            this.$emit('closeEvent');
        },
        getClassName(status){
            var className;//0排队,1上传中,2暂停,3上传失败,4上传成功
            switch(status){
                case -1:
                case 0:
                    className='gray' ;
                    break;
                case 1:
                case 2:
                    className='orange' ;
                    break;
                case 3:
                    className='red' ;
                    break;
                case 4:
                    className='green' ;
                    break;
                case 5:
                    className='green' ;
                    break;
                default:
                    className='gray';
                    break;
            }
            return className;
        },
        getStatusTitle(status,percent){
            var title='';
            switch(status){
                case -1:
                    title='识别文件中...';
                    break;
                case 0:
                    title='排队中...' ;
                    break;
                case 1:
                case 2:
                    title=percent+'%';
                    break;
                case 3:
                    title='失败';
                    break;
                case 4:
                    title='成功' ;
                    break;
                case 5:
                    title='秒传' ;
                    break;
                default:
                    title='排队中...';
                    break;
            }
            return title;
        },
        //操作
        pause(){
            this.$parent.pause();
        },
        continue1(){
            this.$parent.continue1();
        },
        restart(inx,_inx){
            this.$parent.restart(inx,_inx);
        },
        delete1(inx){
            this.$parent.delete1(inx);
        },
     }
}
</script>

<style lang="scss">
    .upload{
        width:60em;
        overflow:hidden;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:15em;
        left:50%;
        margin-left:-30em;
        padding:0.1em 0.5em 2em;

        em{
            font-style:normal;
        }
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding: 0 2em;
            box-sizing:border-box;
            color:#fff;

            p{
                float:left;
            }
            span{
                float:right;
                font-size:2em;
                cursor:pointer;
            }
        }
        .content{
            width:100%;
            padding:1em 2em;
            height:30em;
            overflow-y:auto;

            table{
                width:100%;
                 text-align:center;
                            tr{
                                height:3em;
                                line-height:3em;
                                th{
                                    color:#0099ff;
                                    font-size:1.3em;
                                    font-weight:normal;
                                    text-align:center;
                                    }

                                    td{
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;

                                        a{
                                            display:inline-block;
                                            width:2em;
                                            height:2em;
                                            margin-top:1em;
                                        }

                                        .onstart{
                                                background:url("../../assets/resouce/u402.png") no-repeat center;
                                                background-size:50%;  
                                        }
                                        .onstop{
                                                background:url("../../assets/resouce/u4021.png") no-repeat center;
                                                background-size:60%; 
                                        }
                                        .del-s{
                                            background:url("../../assets/videoPlay/u148.png") no-repeat center;
                                            background-size:50%;
                                            margin-right:1em;
                                        }
                                        .restart{
                                                background:url("../../assets/resouce/restart.png") no-repeat center;
                                                background-size:60%; 
                                        }
                                    }
                                    td:last-child{
                                        text-align:right;
                                        padding-right:2em;
                                        box-sizing:border-box;
                                    }
                            }                   
            }
        }
    }
</style>