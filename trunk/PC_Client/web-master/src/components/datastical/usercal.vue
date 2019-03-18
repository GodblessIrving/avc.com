<template>
	<div class="user-stical">
		<!-- <p class="time" style="font-size:1.2em">截至日期：{{time}}</p> -->
		<p class="usercount">注册用户数量<em>{{count}}</em>人</p>
		<p class="table-title">
			<span class="text">用户登录时间分析</span>
			<select name="" id="" v-model="val" @change="getval">
				<option value="1">今天</option>
				<option value="2">一周内</option>
				<option value="3">一月内</option>
				<option value="4">三月内</option>
				<option value="5">一年内</option>
			</select>
		</p>
		<div id="myChart" :style="{width: '100%', height: '35em'}"></div>
		<div class="bottom">
			<div class="left">
				<div id="myChart1" :style="{width: '100%', height: '30em'}"></div>
			</div>
			<div class="right">
				<div id="myChart2" :style="{width: '100%', height: '30em'}"></div>
			</div>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	export default{
		data(){
			return{
				time:'',
				val:1,
				totaltimes:[],
				oneweek:0,
				onemonth:0,
				threeday:0,
				otherday:0,
				fivemin:0,
				twentymin:0,
				fourtymin:0,
				othermin:0,
				count:0,
			}
		},
		mounted:function(){
			var datatime = new Date().toLocaleDateString();
			this.time = datatime.replace("/","-");
			this.time = this.time.replace("/","-");
			this.getUserlogin();
			this.getUserActive();
			this.getUserTime();
			this.getAllusers();
		},
		methods:{
			// 登录时间分析的数据
			getUserlogin(){
				this.$http.get('/Statistics/LoginTimeStatistics',{
					params:{
						time:parseInt(this.val)
					}
				}).then(res=>{
					var d = $.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							var data = d.data;
							for(var i = 0; i < data.length; i++){
								this.totaltimes.push(data[i].value);
							}
							this.drawLine();
						}else{
							console.log(d.msg)
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 获取用户总数
			getAllusers(){
				this.$http.get('/systemManage/GetUsers',{
					params:{
						pagesize:15,
						pageindex:1,
						name:''
					}
				}).then(res=>{
					var d = $.parseJSON(res.data);
					if(d){
						if(d.msgid==200){
							this.count = d.count;
						}else{
							console.log(d.msg)
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 时间分析的周期变化
			getval(){
				this.totaltimes = [];
				this.getUserlogin();
			},
			// 日活跃的数据
			getUserActive(){
				this.$http.get('/Statistics/ActivityStatistics',{
					params:{}
				}).then(res=>{
					var d = $.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							var data = d.data;
							this.oneweek = data.week;
							this.onemonth = data.month;
							this.threeday = data.threedays;
							this.otherday = data.other;
							this.drawLine1();
						}else{
							console.log(d.msg)
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 应用时间的数据
			getUserTime(){
				this.$http.get('/Statistics/UsageTimeStatistics',{
					params:{}
				}).then(res=>{
					var d = $.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							var data = d.data;
							console.log(data)
							this.fivemin = data.fminute;
							this.twentymin = data.twminute;
							this.fourtymin = data.fominute;
							this.othermin = data.other;
							this.drawLine2();
						}else{
							console.log(d.msg)
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 登录时间分析图表
			drawLine(){
      		      let myChart = this.$echarts.init(document.getElementById('myChart'))
      		      myChart.setOption({
      		         tooltip: {
      		              trigger: 'axis'
      		          },
      		          title: {
           				    text:'单位：100人次',//标题
           				    textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           				    x:'5%',//距离x 轴的值
           				    y:40
           			    },
      		          legend: {
      		              data:['用户登录'],
      		              right:'8%',
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
      		              data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
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
      		                  name:'用户登录',
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
      		                  data:this.totaltimes
      		              },
      		          ]
      		      });
   			},
   			// 日活跃的图表
   			drawLine1(){
  			     let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
  			     myChart1.setOption({
  			     	    title: {
  				        text: '用户日活分析',
  				        left: 'center',
  				        top:'15%',
  				        textStyle:{color:"#fff",fontWeight:'normal'}
  				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: '5%',
				        top:'30%',
				        data: [ {name: '一周至少登录一次',
             					textStyle:{color:"#fff"}
               					},
               					{name: '一月至少登录一次',
             					textStyle:{color:"#fff"}
               					},
               					{name: '三天至少登录一次',
             					textStyle:{color:"#fff"}
               					},
               					{name: '其他',
             					textStyle:{color:"#fff"}
               					},],
				    },
				    series : [
				        {
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            label:{
							normal:{
								position:'inner',
								formatter: "{d}%"
							}
						},
						labelLine:{
							normal:{
								show:false
							}
						},
				            data:[
				                {value:this.oneweek, 
				                 name:'一周至少登录一次',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#4584d3'
				                 	},
				                 }},
				                {value:this.onemonth, 
				                 name:'一月至少登录一次',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#c03c38'
				                 	}
				                 }},
				                {value:this.threeday, 
				                 name:'三天至少登录一次',
				                 itemStyle:{
				                 normal:{
				                 		color:'#9ac14a'
				                 	}
				                 }},
				                {value:this.otherday, 
				                 name:'其他',
				                 itemStyle:{
				                 	  normal:{
				                 		color:'#7c5aa7'
				                 	}
				                 }}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                },
				            }
				        }
				    ]
  			     });
  			 },
  			 // 应用时间的图表
  			drawLine2(){
  			     let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
  			     myChart2.setOption({
  			     	    title: {
  				        text: '用户应用时间分析',
  				        left: 'center',
  				        top:'15%',
  				        textStyle:{color:"#fff",fontWeight:'normal'}
  				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: '5%',
				        top:'30%',
				        data: [ {name: '5分钟以内',
             					textStyle:{color:"#fff"}
               					},
               					{name: '20分钟以内',
             					textStyle:{color:"#fff"}
               					},
               					{name: '40分钟以内',
             					textStyle:{color:"#fff"}
               					},
               					{name: '其他',
             					textStyle:{color:"#fff"}
               					},],
				    },
				    series : [
				        {
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            label:{
							normal:{
								position:'inner',
								formatter: "{d}%"
							}
						},
						labelLine:{
							normal:{
								show:false
							}
						},
				            data:[
				                {value:this.fivemin, 
				                 name:'5分钟以内',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#4584d3'
				                 	},
				                 }},
				                {value:this.twentymin, 
				                 name:'20分钟以内',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#c03c38'
				                 	}
				                 }},
				                {value:this.fourtymin, 
				                 name:'40分钟以内',
				                 itemStyle:{
				                 normal:{
				                 		color:'#9ac14a'
				                 	}
				                 }},
				                {value:this.othermin, 
				                 name:'其他',
				                 itemStyle:{
				                 	  normal:{
				                 		color:'#7c5aa7'
				                 		}
				                 }}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                },
				            }
				        }
				    ]
  			     });
  			 },
		}
	}
</script>
<style lang="scss">
	.user-stical{
		color:#fff;
		padding:1em 3em;
		em{
			font-style:normal;
			color:green;
		}
		.time{
			width:25%;
			display:inline-block;
		}
		.usercount{
			width:70%;
			display:inline-block;
			font-size:1.3em;
		}
		.table-title{
			width:100%;
			margin-top:1em;
			text-align:center;
			font-size:1.2em;
			.text{
				margin-right:1em;
			}
			select{
				color:#666;
			}
		}
		.bottom{
			width:100%;
			overflow:hidden;
			.left{
				width:50%;
				float:left;
			}
			.right{
				float:left;
				width:50%;
			}
		}
	}
</style>