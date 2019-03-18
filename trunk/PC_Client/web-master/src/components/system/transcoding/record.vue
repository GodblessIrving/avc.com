<template>
    <div class="record">
        <div class="operation">
            <a :href="path">导出</a>
            <a href="javascript:void(0)" @click="delLog(1)">删除</a>
            <select name="" id="" v-model="status">
                <option value="10">请选择转码状态</option>
                <option value="1">已完成</option>
                <option value="5">失败</option>
                <option value="5">转码成功</option>
            </select>
            <div class="time">
            		<el-date-picker
     			v-model="starttime"
      			type="date"
                                     value-format="yyyy-MM-dd"
      			placeholder="开始时间">
    		</el-date-picker>
    		<span>至</span>
		<el-date-picker
     			v-model="endtime"
      			type="date"
                                      value-format="yyyy-MM-dd"
      			placeholder="结束时间">
    		</el-date-picker>
            </div>
            <p class="sear">
                <input type="text" placeholder="搜索视频名称" v-model="keyword">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="15">转码视频名称</th>
                        <th width="8">分类</th>
                        <th width="10">来源</th>
                        <th width="15">开始时间</th>
                        <th width="15">完成时间</th>
                        <th width="8">耗时</th>
                        <th width="8">速率</th>
                        <th width="8">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="l in logList">
                        <td><input type="checkbox" :value="l.id" v-model="ids"></td>
                        <td :title="l.title">{{l.title}}</td>
                        <td :title="l.classification">{{l.classification}}</td>
                        <td :title="l.source">{{l.source}}</td>
                        <td :title="l.starttime">{{l.starttime}}</td>
                        <td :title="l.endtime">{{l.status==5?'--':l.endtime}}</td>
                        <td>{{l.status==5?'--':getCurrent(l.timeconsuming)}}</td>
                        <td>{{l.status==5?'--':l.rate}}</td>
                        <td v-if="l.status==1" class="green">已完成</td>
                        <td v-if="l.status==5" class="red">失败</td>
                        <td v-if="l.status==6" class="orange">转码成功</td>
                        <td>
                            <a  v-if="l.status!=1" href="javascript:void(0)" @click="repeatTranscoding(l.id);">重新转码</a>
                            <a href="javascript:void(0)" @click="delLog(2,l.id);">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="18"
                layout="prev, pager, next"
                :total="count"
                v-show="page">
            </el-pagination>
        <common-tip 
            :isShow="isDel" 
            :message="message"
            @closeTipEvent="closeDel"
            @delObjEvent="sureOpration">
        </common-tip>
        <alert-tip :message="mess" :isShowtip="isShowtip" @closeTipEvent="closeTip"></alert-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip";
    import alertTip from "../../alertTip"
    export default{
        data () {
             return {
                boolean:false,
                isDel:false,
                isNew:false,
                starttime:'',
                endtime:'',
                status:10,
                keyword:'',
                count:1000,
                pageindex:1,
                page:true,
                logList:[],
                currentPage:1,
                ids:[],
                message:"",
                mess:'',
                isShowtip:false,
                path:"",
             };
         },
        name:"record",
        components:{CommonTip,alertTip},
        mounted:function(){
            this.path = this.ajaxBaseUrl+'/transcoding/ExportTaskLog?ids=';
            this.GetTaskLog();
        },
        watch:{
            status:function(){
              this.GetTaskLog();
            },
            ids:function(){
              if(this.ids.length < this.logList.length){
                $("#checkAll").prop("checked",false);
              }else if(this.ids.length>0&&this.ids.length==this.logList.length){
                $("#checkAll").prop("checked",true);
              }
              this.path = this.ajaxBaseUrl+'/Transcoding/ExportTaskLog?ids='+this.ids.join(',');
            },
            starttime:function(){
                 this.GetTaskLog();
            },
            endtime:function(){
                 this.GetTaskLog();
            }
        },
        methods: {
            GetTaskLog(){
                if(this.endtime){
                    var time = this.endtime+' 23:59:59'
                }else{
                    var time = null;
                }
                this.$http.get('/transcoding/GetTaskLog',{
                    params:{
                        pagesize:18,
                        pageindex:this.pageindex,
                        status:this.status,
                        keyword:this.keyword,
                        starttime:this.starttime,
                        endtime:time
                    }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    this.ids = [];
                    $("#checkAll").prop("checked",false);
                    if(d){
                        if(d.msgid == 200){
                            this.logList = d.data;
                            this.count = d.count;
                            if(this.count <= 18){
                                this.page = false;
                            }else{
                                this.page = true;
                            }
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 重新转码
            repeatTranscoding(id){
                this.ids = [];
                this.ids.push(id);
                this.$http.post('/transcoding/StartTranscoding',{
                    ids:this.ids,
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.ids = [];
                        if(d.msgid == 200){                           
                            this.GetTaskLog();
                        }else{
                            console.log(d.msg);
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 全选
            checkAll(){
                if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.logList.length; i++){
                        this.ids.push(this.logList[i].id);
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            // 搜索
            search(){
                this.pageindex = 1;
                this.GetTaskLog();
             },
             // 批量和单个删除操作
             delLog(type,id) {
                if(type == 1){
                    if(this.ids.length < 1){
                        this.isShowtip = true;
                        this.mess = '请选择需要删除的任务';
                    }else{
                        this.isDel = true;
                        this.message = '您确定删除您所选择转码记录？'
                    }
                }else{
                    this.ids = [];
                    this.ids.push(id);
                    this.isDel = true;
                    this.message = '您确定删除该转码记录？'
                }
             },
             sureOpration(){
                this.$http.post('/transcoding/DeleteTask',{
                    ids:this.ids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.ids = [];
                        this.isDel = false;
                        this.isShowtip = true;
                        if(d.msgid == 200){
                            if(d.data){
                                this.mess = '删除成功';
                                this.pageindex = 1;
                                this.currentPage = 1;
                                this.GetTaskLog();
                            }else{
                                this.mess = '删除失败'
                            }
                        }else{
                            console.log(d.msg);
                             this.mess = '删除失败'
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
             closeDel(){
                this.isDel = false;
                this.ids = [];
             },
             closeTip(){
                this.isShowtip = false;
             },
             // 计算耗时
            getCurrent(time){
              var i=0 , s = parseInt(time);
              var timer;
              if(s>60){
                  i=parseInt(s/60);
                  s=parseInt(s%60);
                }
                if(parseInt(i) < 10){
                  i = "0"+i
                }
                if(parseInt(s) < 10){
                  s = "0"+s
                }
                timer = i+'`'+s+'``';
                return timer;
            },
             handleCurrentChange(val){
                this.pageindex = parseInt(val);
                this.GetTaskLog();
             },
         }
    }
</script>
<style lang="scss">
#app .el-pagination .btn-next, #app .el-pagination .btn-prev{
    padding:0 5px;
}
.el-pagination{
    position:absolute;
    bottom:5em;
    width:100%;
    text-align:center;
}
.orange{
    color:orange;
}
.record{
        .operation{
            width:100%;
            padding:1em;
            overflow:hidden;

            a{
                float:left;
                width:5em;
                height:2em;
                line-height:2em;
                background-color:#0099ff;
                text-align:center;
                color:#fff;
                margin-top:1em;
                margin-left:1em;
                text-decoration: none;
            }

            select{
                height:2em;
                margin-top:1em;
                color:#999;
                margin-left:1em;
                float:left;
            }
	.time{
		float:left;
		margin-left:1em;
		margin-top:1em;

		div{
			width:10em;
			height:2em;

			input{
				height:2.3em;
			}
                                     .el-input__inner{
                                        width:10em;
                                     }
			.el-input__icon{
				line-height:2.3em !important;
			}
		}
	}
        }
       
    }
    .system-info .excel table tr td a{
        width:auto;
        padding:0 0.3em;
    }
</style>