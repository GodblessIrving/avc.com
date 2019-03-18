<template>
	<div class="title-stical">
		<!-- <p class="time" style="font-size:1.2em">截至日期：{{time}} </p> -->
		<div class="top">
			<div id="myChart1" :style="{width: '100%', height: '25em'}"></div>
		</div>
		<div class="bottom">
			<div class="left">
				<div id="myChart2" :style="{width: '100%', height: '40em'}"></div>
			</div>
			<div class="right">
				<div id="myChart3" :style="{width: '100%', height: '40em'}"></div>
			</div>
		</div>
            <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
            </alert-tip>
	</div>
</template>
<script type="text/ecmascript-6">
      import alertTip from '../alertTip'
	export default{
		data(){
			return{
				time:'',
                        emsg:'该页面功能正在开发中',
                        isError:true,
			}
		},
            components:{alertTip},
		mounted:function(){
			var datatime = new Date().toLocaleDateString();
			this.time = datatime.replace("/","-");
			this.time = this.time.replace("/","-");
			this.drawLine();
			this.drawLine1();
			this.drawLine2();
		},
		methods:{
			drawLine(){
  			     let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
  			     myChart1.setOption({
  			     	    title: {
  				        text: '专题类型统计',
  				        left: 'center',
  				        top:'5%',
  				        textStyle:{color:"#fff",fontWeight:'normal'}
  				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: '0',
				        top:'30%',
				        data: [ {name: '个人专题',
             					textStyle:{color:"#fff"}
               					},
               					{name: '视频聚合专题',
             					textStyle:{color:"#fff"}
               					}],
				    },
				    series : [
				        {
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            label: {
				               normal: {
				                   formatter: '{b|{b}}{abg|}  {per|{d}%}  ',
				                   borderWidth: 1,
				                   borderRadius: 4,
				                   rich: {
				                       hr: {
				                           borderColor: '#aaa',
				                           width: '100%',
				                           borderWidth: 0.5,
				                           height: 0
				                       },
				                       b: {
				                           fontSize: 14,
				                           color: '#fff',
				                           lineHeight: 15
				                       },
				                       per: {
				                           color: '#fff',
				                           padding: [2, 0],
				                           borderRadius: 2
				                       }
				                   }
				               }
				           },
				            data:[
				                {value:600, 
				                 name:'个人专题',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#4584d3'
				                 	}
				                 }},
				                {value:200, 
				                 name:'视频聚合专题',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#c03c38'
				                 	}
				                 },
				                 selected:true
				               }],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
  			     });
  			 },
  			 drawLine1(){
  			     let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
  			     myChart2.setOption({
  			     	   title: {
  					     text: '个人专题访问量TOP１０  (访问量单位：次)',
  					     textStyle:{
           				          color:"#fff",//标题颜色
           				          fontSize:22,
           				          fontWeight:'normal'
           				      },
  					 },
  					 tooltip: {
  					     trigger: 'axis',
  					     axisPointer: {
  					         type: 'shadow'
  					     }
  					 },
  					 grid: {
  					     left: '3%',
  					     right: '4%',
  					     bottom: '3%',
  					     containLabel: true
  					 },
  					 xAxis: {
  					     show:false,
  					     type: 'value',
  					     boundaryGap: [0, 0.01],
  					     splitLine:{
      		                        show:false  //去掉网格线
      		               	},
      		               	axisLabel: {
      		                   	show: true,
      		                   	textStyle: {
      		                   	    color: '#fff'
      		                   	}
      		               	},
  					 },
  					 yAxis: {
  					     type: 'category',
  					     data: ['初中数学3班主页','初中数学3班主页','初一（3）班主页','校美术兴趣小组专题','校教务处专题主页','初中数学3班主页','李丽丽班主任专题','初二（1）班主页','初中数学3班主页','徐圆圆老师课堂专题'],
  					     splitLine:{
      		                        show:false  //去掉网格线
      		               	},
      		               	axisLabel: {
      		                   	show: true,
      		                   	textStyle: {
      		                   	    color: '#fff',
      		                   	    fontSize:16,
      		                   	}
      		               	},
                                    axisLine : {show:false},
  					 },
  					 series: [
  					     {
  					         name: '个人专题访问量',
  					         type: 'bar',
  					         barWidth:25,
  					         itemStyle: {
      			              	normal:{
      			              	    color: "#ff9900",
      			              	    label : {       //柱子上显示内容和内容样式
      			              	        show: true,
      			              	        position: 'right',
      			              	        color:'#fff',
      			              	        formatter: '{c} 次'
      			              	    }
      			              	}
      			          	   },
  					         data: [3576,5576,9576,13423,13891,15128,15576, 25576,27567,28372]
  					     }
  					 ]
  			     });
  			 },
  			 drawLine2(){
  			     let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
  			     myChart3.setOption({
  			     	   title: {
  					     text: '视频聚合专题访问量TOP１０  (访问量单位：次)',
  					     textStyle:{
           				          color:"#fff",//标题颜色
           				          fontSize:22,
           				          fontWeight:'normal'
           				      },
  					 },
  					 tooltip: {
  					     trigger: 'axis',
  					     axisPointer: {
  					         type: 'shadow'
  					     }
  					 },
  					 grid: {
  					     left: '3%',
  					     right: '4%',
  					     bottom: '3%',
  					     containLabel: true
  					 },
  					 xAxis: {
  					     show:false,
  					     type: 'value',
  					     boundaryGap: [0, 0.01],
  					     splitLine:{
      		                        show:false  //去掉网格线
      		               	},
      		               	axisLabel: {
      		                   	show: true,
      		                   	textStyle: {
      		                   	    color: '#fff'
      		                   	}
      		               	},
  					 },
  					 yAxis: {
  					     type: 'category',
  					     data: ['初中数学3班主页','初中中考状元试卷赏专题','2016年北京各区模拟考试专题','初三中考英语完型填空专题','初三中考数学23题历年汇总解析','初一世界史欧洲专题','初一英语基础语法','初三语文文言文赏析','初三数学二次函数解析专题','名师在线课堂聚合专题'],
  					     splitLine:{
      		                        show:false  //去掉网格线
      		               	},
      		               	axisLabel: {
      		                   	show: true,
      		                   	textStyle: {
      		                   	    color: '#fff',
      		                   	    fontSize:16,
      		                   	}
      		               	},
                                    axisLine : {show:false},
  					 },
  					 series: [
  					     {
  					         name: '视频聚合专题访问量',
  					         type: 'bar',
  					         barWidth:25,
  					         itemStyle: {
      			              	normal:{
      			              	    color: "#ff9900",
      			              	    label : {       //柱子上显示内容和内容样式
      			              	        show: true,
      			              	        position: 'right',
      			              	        color:'#fff',
      			              	        formatter: '{c} 次'
      			              	    }
      			              	}
      			          	   },
  					         data: [3576,5576,9576,13423,13891,15128,15576, 25576,27567,28372]
  					     }
  					 ]
  			     });
  			 },
		}
	}
</script>
<style lang="scss">
	.title-stical{
		color:#fff;
		padding:1em 3em;
		.top{
			width:50%;
			height:25em;
			position:relative;
			left:50%;
			margin-left:-25%;
		}
		.bottom{
			width:100%;
			padding:2em;
			height:40em;
			.left{
				width:50%;
				float:left;
				height:40em;
				margin-right:1%;
			}
			.right{
				width:49%;
				float:right;
				height:40em;
			}
		}
	}
</style>