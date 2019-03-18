<template>
    <div class="resour">
        <div class="top">
            <span class="left" v-show="left" @click="forward"></span>
        	<p class="top-title">
        		<span>当前转码任务数：<em class="green">{{task}}</em></span>
        		<span>队列等待任务数：<em class="orange">{{wait}}</em></span>
                         <span>当前服务器{{index+1}}：<em :class="[now.online==1?'green':'red']">{{now.online==1?'在线':'离线'}}</em></span>
        	</p>
        	<div>
        		<p>
        			cpu占有率：<em class="orange">{{now.cpu_usage}}%</em>
        		</p>
        		<p class="nei">
        			内存占用率：<em class="green">{{now.mem}}%</em>
        		</p>
        		<p class="cun">
        			存储使用：<em class="green">{{now.disk}}G</em>
        		</p>
        	</div>
            <span class="right" v-show="right" @click="next"></span>
        </div>
        <div class="set">
        	<p>
        		<span>设置转码线程：</span>
        		<select name="" id="" v-model="thread">
        			<option value="1">1</option>
        			<option value="2">2</option>
        			<option value="3">3</option>
        			<option value="4">4</option>
        			<option value="5">5</option>
        			<option value="6">6</option>
        			<option value="7">7</option>
        			<option value="8">8</option>
        			<option value="9">9</option>
        			<option value="10">10</option>
        		</select>
        		<em>线程</em>
        	</p>
        	<a href="javascript:void(0)" @click="setThread" style="text-decoration: none">保存</a>
        </div>
        <div class="chart">
        	<p>
        		<span>转码任务周期：</span>
        		<select name="" id=""  v-model="timer">
        			<option value="0">今天</option>
        			<option value="1">本周</option>
        			<option value="2">本月</option>
        			<option value="3">三个月</option>
        		</select>
        	</p>
        	<p class="chart-title">转码应用监控</p>
        	<div id="myChart" :style="{width: '100%', height: '40em'}"></div>
        </div>
        <alert-tip :isShowtip="isShowtip" :message="mess" @closeTipEvent="closeTip"></alert-tip>
    </div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../../alertTip"
export default {
  name: 'resour',
  data () {
    return {
      cpu:0,
      mem:0,
      disk:0,
      task:0,
      wait:null,
      thread:5,
      isShowtip:false,
      mess:'',
      timer:0,
      dataTime:[],
      dataList:[],
      left:false,
      right:false,
      index:0,
      infolist:[],
      now:{},
    }
  },
  components:{alertTip},
  mounted:function(){
     this.getSysteminfo();
     this.getAllinfo();
     this.getAllTask();
     this.getSet();
     this.getChart();
  },
  watch:{
    timer:function(){
        this.dataTime = [];
        this.dataList = [];
        this.getChart()
    },
    index:function(){
        this.now = this.infolist[this.index];
        if(this.now.online == 0){
            this.now.cpu_usage = 0;
            this.now.mem = 0;
            this.now.disk = 0;
        }else{
            var a = this.now.mem_used / this.now.mem_total * 100;
            this.now.mem = a.toFixed(2);
            var disk = this.now.disk_used/1024;
            this.now.disk = disk.toFixed(2);
        }
    },
  },
  methods: {
    // 系统信息
    getSysteminfo(){
        this.$http.get('/transcoding/GetSystemInfo',{
            params:{}
        }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
                if(d.msgid == 200){
                    var data = $.parseJSON(d.data);

                    if(data){
                        this.infolist = $.parseJSON(data);
                        console.log(this.infolist)
                        if(this.infolist.length > 1){
                            this.right = true;
                        }else{
                            this.right = false;
                        }
                        this.now = this.infolist[this.index];
                        if(this.now.online == 0){
                            this.now.cpu_usage = 0;
                            this.now.mem = 0;
                            this.now.disk = 0;
                        }else{
                            var a = this.now.mem_used / this.now.mem_total * 100;
                            this.now.mem = a.toFixed(2);
                            var disk = this.now.disk_used/1024;
                            this.now.disk = disk.toFixed(2);
                        }
                    }else{
                        this.mess = '服务器不在线';
                        this.isShowtip = true;
                    }
                }
            }
        })
    },
    forward(){
        this.index --;
        if(this.index > 0){
           this.left = true;
         }else{
           this.left = false;
         }
         if(this.index >= this.infolist.length-1){
            this.right = false;
          }else{
           this.right = true;
          }
    },
    next(){
        this.index ++;
        if(this.index > 0){
           this.left = true;
         }else{
           this.left = false;
         }
         if(this.index >= this.infolist.length-1){
            this.right = false;
          }else{
           this.right = true;
          }
    },
    // 等待任务数
    getAllinfo(){
        this.$http.get('/transcoding/GetTaskList',{
            params:{
                pagesize:999999,
                pageindex:1,
                status:2,
                keyword:''
            }
        }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){                       
                if(d.msgid== 200){
                    var data = d.data;
                    this.wait = data.length;
                }else{
                    console.log(d.msg)
                }
            }

        }).catch(err=>{
            console.log(err)
        })
    },
    // 转码任务数
    getAllTask(){
        this.$http.get('/transcoding/GetTaskList',{
            params:{
                pagesize:999999,
                pageindex:1,
                status:0,
                keyword:''
            }
        }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){                       
                if(d.msgid== 200){
                    var data = d.data;
                    this.task = data.length;
                }else{
                    console.log(d.msg)
                }
            }

        }).catch(err=>{
            console.log(err)
        })
    },
    // 获取转码线程
    getSet(){
        this.$http.get('/transcoding/GetTranscodingsettings',{
            params:{}
        }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
                if(d.msgid==200){
                    var data = d.data;
                    this.thread = data.thread;
                }
            }
        })
    },
    // 设置转码线程
    setThread(){
        this.$http.get('/transcoding/SetTranscodingsettings',{
            params:{
                thread:this.thread
            }
        }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
                this.isShowtip = true;
                if(d.msgid == 200){
                    if(d.data){                        
                        this.mess = '设置成功'
                    }else{
                        this.mess = '设置失败'
                    }
                }else{
                    this.mess = '设置失败';
                }
            }
        }).catch(err=>{
            console.log(err)
        })
    },
    // 关闭提示
    closeTip(){
        this.isShowtip = false;
    },
    // 获取折线图数据
    getChart(){
        this.$http.get('/transcoding/GetStatistics',{
            params:{
                type:this.timer
            }
        }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
                if(d.msgid == 200){
                    var data = d.data;
                    for(var i = 0; i<data.length; i++){
                        this.dataTime.push(data[i][0]);
                        this.dataList.push(data[i][1])
                    }
                    this.drawLine();
                }
            }
        })
    },
    // 折线图
    drawLine(){
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
           tooltip: {
                trigger: 'axis'
            },
            title: {
                text:'单位：任务数',//标题
                textStyle:{
                            color:"#fff",//标题颜色
                            fontWeight:"none"
                        },
                x:'5%',//距离x 轴的值
                y:40
            },
            legend: {
                data:['转码任务数'],
                right:10,
                textStyle: {
                                color: '#fff'
                            }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:this.dataTime,
                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                 axisLine:{
                                lineStyle:{
                                    color:'#FFFFFF',
                                }
                            }
            },
            yAxis: {
                type: 'value',
                axisLabel : {
                                    formatter: '{value}',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                axisLine:{
                                lineStyle:{
                                    color:'#FFFFFF',
                                }
                            },
                splitLine:{
                                              show:false  //去掉网格线
                                      } 
            },
            series: [
                {
                    name:'转码任务数',
                    type:'line',
                    stack: '总量',
                    smooth:false,
                    symbolSize: 10,
                    symbol:'circle',
                    itemStyle : {  
                                        normal : {  
                                            color:'#00ccff',
                                            borderType: 'dashed',
                                            lineStyle:{  
                                                color:'#FFFFFF',
                                                width:1,
                                		  type:'dashed'   
                                            }  
                                        }  
                                    },
                    data:this.dataList
                },
            ]
        });
    }
  }
}
</script>
<style lang="scss">
	.resour{
		width:100%;
		padding:2em;
		box-sizing:border-box;
		em{
			font-style:normal;
		}
		.green{
			color:#00cc00;
		}
		.orange{
			color:#ff9900;
		}
		.top{
			width:100%;
			height:12em;
			background:rgba(#ffffff, 0.1);
                                      position:relative;
                                      .right{
                                       right:0;
                                       background:url("../../../assets/picdetail/you.png") no-repeat right center;
                                       background-size:100%;
                                       margin:0;
                                       position:absolute;
                                       width:2em;
                                       height:5em;
                                       top:50%;
                                       margin-top:-2.5em;
                                       cursor:pointer;
                                      } 
                                      .left{
                                        left:0;
                                        background:url("../../../assets/picdetail/zuo1.png") no-repeat left center;
                                        background-size:100%;
                                        margin:0;
                                        position:absolute;
                                        width:2em;
                                        height:5em;
                                        top:50%;
                                        margin-top:-2.5em;
                                        cursor:pointer;
                                      }
			.top-title{
				width:100%;
				text-align:center;
				padding:1em 0;

				span{
					margin-left:3em;
					em{
						font-style:normal;
						font-size:1em;
					}
				}
			}
			div{
				width:100%;
				overflow:hidden;
				padding:0 1em;

				p{
					float:left;
					height:3em;
					line-height:3em;
					padding-left:3em;
					font-size:2em;
					width:33%;
					background:url("../../../assets/system/cpu.png") no-repeat left center;
					background-size:19%;
				}
				.nei{
					background:url("../../../assets/system/nei.png") no-repeat left center;
					background-size:19%;
				}
				.cun{
					background:url("../../../assets/system/cun.png") no-repeat left center;
					background-size:19%;
				}
			}
		}
		.set{
			width:100%;
			height:4em;
			padding:0 1em;
			box-sizing:border-box;
			background:rgba(#ffffff, 0.1);
			margin-top:1em;
			line-height:4em;

			p{
				float:left;
				margin-bottom:0;

				select{
					width:8em;
					color:#333;
					height:2em;
				}
			}
			a{
				float:right;
				color:#fff;
				height:2.5em;
				width:5em;
				text-align:center;
				line-height:2.5em;
				margin-top:0.75em;
				border-radius:3px;
				background-color:#0099ff;
			}
		}
		.chart{
			width:100%;
			height:auto;
			padding: 2em 0;

			p{
				display:inline-block;
				select{
					color:#333;
					width:8em;
					height:2em;
				}	
			}
			.chart-title{
				font-size:1.8em;
				margin-left:10em;
			}
		}
	}
</style>