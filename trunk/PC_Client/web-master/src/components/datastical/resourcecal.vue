<template>
	<div class="resource-stical">
	       <!-- <p class="time" style="font-size:1.2em">截至日期：{{time}}</p> -->
	       <div class="resource-top">
	       	<div class="left">
	       		<div class="space">
	       			<span class="space-left">存储空间：</span>
	       			<div class="outer">
	       				<p class="inner">
	       					<!-- <span style="position:relative; z-index:10">{{precent}}</span> -->
	       					<span class="have-use">{{precent}}</span>
	       				</p>
	       				<p class="store"><em>{{usedsize}}GB</em>/{{totalsize}}GB</p>
	       			</div>
	       		</div>
	       		<div class="set-remind">
	       			<span class="space-left">设置提醒：</span>
	       			<p>存储占用高于<input type="text" v-model="price" @focus="changeSave">%</p>
	       		</div>
	       		<div class="email">
	       			<span class="space-left">提醒邮箱：</span>
	       			<input type="text" v-model="email"  v-validate="{'mail':true,'required':true,}" name="email" @focus="changeSave"/>
	       			<p class="is-danger" v-show="errors.has('email')" >{{errors.first('email')}}</p>
	       		</div>
	       		<span class="save-btn save-all" @click="Saveset()" style="cursor:pointer;">保存</span>
	       	</div>
	       	<div class="right">
	       		<div id="myChart1" :style="{width: '100%', height: '25em'}"></div>
	       	</div>
	       </div>
	       <div class="resource-bottom">
	       	<p class="table-title">
	       		<span class="table-text">资源来源</span>
	       		<select name="" id="" v-model="val" @change="getval">
	       			<option value="2">按大小</option>
	       			<option value="1">按内容条数</option>
	       		</select>
	       	</p>
	       	<div id="myChart2" :style="{width: '100%', height: '35em'}"></div>
	       </div>
	       <alert-tip :isShowtip="isShowtip" :message="message" @closeTipEvent="close"></alert-tip>
	</div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../alertTip"
export default{
      	data(){
      		return{
      			time:'',
      			totalsize:0,
      			usedsize:0,
      			precent:0,
      			vpre:0,
      			apre:0,
      			ppre:0,
      			wpre:0,
      			val:2,
      			names:[],
      			results:[],
      			unit:'',
      			price:'',
      			email:'',
      			isShowtip:false,
      			message:'',
      		}
      	},
      	components:{alertTip},
      	mounted:function(){
      		var datatime = new Date().toLocaleDateString();
			this.time = datatime.replace("/","-");
			this.time = this.time.replace("/","-");
			this.getstorege();
			this.getResourceprecent();
			this.getResourcecal();
			
      	},
      	methods:{
      		// 获取存储空间
      		getstorege(){
      			this.$http.get('/Statistics/GetStorageSize',{
      				params:{}
      			}).then(res=>{
      				var d=$.parseJSON(res.data);
      				if(d){
      					if(d.msgid == 200){
      						var space = d.data;
      						this.price = space.criticality;
      						this.email = space.email;
      						if(this.email){
      							$(".save-all").addClass('blue-none').removeClass('save-btn');
      						}
      						this.totalsize = space.total;
      						this.usedsize = space.used;
      						var a = this.usedsize / this.totalsize * 100;
      						var precent = a.toFixed(2);
      						this.precent = precent + "%";
      						$(".have-use").css({"width":this.precent})
      					}else{
      						console.log(d.msg)
      					}
      				}
      			}).catch(err=>{
      				console.log(err)
      			})
      		},
      		changeSave(){
      			$(".save-all").addClass('save-btn').removeClass('blue-none');
      		},
      		// 保存邮箱提醒
      		Saveset(){
      			if($(".save-all").hasClass('blue-none')){
      				return
      			}
      			if(!this.price){
      				this.isShowtip = true;
      				this.message="请填写占用比例";
      				return
      			}
      			this.$validator.validateAll().then((result)=>{
      				 if(result){
      				 	this.$http.post('/Statistics/SetRemind',{
      				 			criticality:this.price,
      				 			email:this.email
      				 	}).then(res=>{
      				 		var d = $.parseJSON(res.data);
      				 		if(d){
      				 			this.isShowtip = true;
      				 			if(d.msgid == 200){
      				 				if(d.data){
      				 					this.message="设置成功";
      				 					$(".save-all").addClass('blue-none').removeClass('save-btn')
      				 				}else{
      				 					this.message="设置失败"
      				 				}
      				 			}else{
      				 				this.message="设置失败"
      				 				console.log(d.msg)
      				 			}
      				 		}
      				 	}).catch(err=>{
      				 		console.log(err);
      				 	})
      				 }
      			})
      		},
      		close(){
      			this.isShowtip = false;
      		},
      		// 获取各类资源占比
      		getResourceprecent(){
      			this.$http.get('/Statistics/GetPercentByRT',{
      				params:{}
      			}).then(res=>{
      				var d=$.parseJSON(res.data);
      				if(d){
      					if(d.msgid == 200){
      						var pre = d.data;
      						var num = Math.pow(1024,3);
      						this.vpre = (pre.vper/num).toFixed(2);
      						this.apre = (pre.aper/num).toFixed(2);
      						this.ppre = (pre.pper/num).toFixed(2);
      						this.wpre = (pre.dper/num).toFixed(2);
      						this.drawLine();
      					}else{
      						console.log(d.msg)
      					}
      				}
      			}).catch(err=>{
      				console.log(err)
      			})
      		},
      		getResourcecal(){
      			if(this.val == 2){
      				this.unit = "单位：GB"
      			}else{
      				this.unit = "单位：100条"
      			} 
      			this.$http.get('/Statistics/GetResBySource',{
      				params:{
      					type:parseInt(this.val)
      				}
      			}).then(res=>{
      				var d = $.parseJSON(res.data)
      				if(d){
      					if(d.msgid == 200){
      						var data = d.data;
      						for(var i = 0; i < data.length; i++){
      							this.names.push(data[i].name);
      							if(this.val == 2){
      								var num = data[i].result/1024;
      								var a = num.toFixed(2)
      								this.results.push(a);
      							}else{
      								this.results.push(data[i].result);
      							}
      						}
      						this.drawLine1();
      					}else{
      						console.log(d.msg)
      					}
      				}
      			}).catch(err=>{
      				console.log(err)
      			})
      		},
      		getval(){
      			this.names = [];
      			this.results = [];  			
      			this.getResourcecal();
      		},
      		// 饼状图
      		drawLine(){
  			     let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
  			     myChart1.setOption({
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} :  ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: '5%',
				        top:'30%',
				        data: [ {name: '视频',
             					textStyle:{color:"#fff"}
               					},
               					{name: '音频',
             					textStyle:{color:"#fff"}
               					},
               					{name: '图片',
             					textStyle:{color:"#fff"}
               					},
               					{name: '文稿',
             					textStyle:{color:"#fff"}
               					},],
				    },
				    series : [
				        {
				            type: 'pie',
				            radius : '40%',
				            center: ['50%', '60%'],
				            label: {
				               normal: {
				                   formatter: '{b|{b}：}  {per|{d}%}   ',
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
				                           padding: [2, -12],
				                           borderRadius: 2
				                       }
				                   }
				               }
				           },
				            data:[
				                {value:this.vpre, 
				                 name:'视频',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#4584d3'
				                 	}
				                 }},
				                {value:this.apre, 
				                 name:'音频',
				                 itemStyle:{
				                 	normal:{
				                 		color:'#c03c38'
				                 	}
				                 }},
				                {value:this.ppre, 
				                 name:'图片',
				                 itemStyle:{
				                 normal:{
				                 		color:'#9ac14a'
				                 	}
				                 }},
				                {value:this.wpre, 
				                 name:'文稿',
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
				                }
				            }
				        }
				    ]
  			     });
  			 },
  			//柱状图 
  			drawLine1(){
  			     let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
  			     myChart2.setOption({
  			     		title: {
           				    text:this.unit,//标题
           				    textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           				    x:'7%',//距离x 轴的值
           				    y:30
           				},
      			      xAxis: {
      			          data: this.names,//x轴上的值
      			          axisLabel:{
      			              textStyle:{
      			                  show: true,
      			                  color:"#fff",
      			                  fontSize:12
      			              },
      			              rotate:45//字体倾斜
      			          },
      			          axisLine:{
      			              lineStyle:{color:"#fff"},			
      			          }
      			      },
      			      yAxis : [{
      			              ttype : 'value',
      			              axisLabel:{//坐标轴上的内容样式设置
      			                  textStyle:{
      			                      show: true,
      			                      color:"#fff"
      			                  },
      			               },
      			               axisLine:{
	     			                  lineStyle:{color:"#fff"},			
      			              },
      			              splitLine:{
      			                      show:false  //去掉网格线
      			              }
      			      }],
      			      series: [{
      			          type: 'bar',
      			          data: this.results,
      			          itemStyle: {
      			              normal:{
      			                  color: "#0099ff",
      			                  label : {       //柱子上显示内容和内容样式
      			                      show: true,
      			                      position: 'top',
      			                      color:'#fff'
      			                  }
      			              }
      			          },
      			          barWidth:25
      			      }]
  			     });
  			 },
      	}
}
</script>
<style lang="scss">
	.resource-stical{
	     color:#fff;
	     padding:1em 3em;
	     .is-danger{
	     	padding-left:6em;
	     }
	    	.resource-top{
	    		width:100%;
	    		overflow:hidden;
	    		.left{
	    			width:55%;
	    			float:left;
	    			padding:3em;
	    			font-size:1.1em;
	    			.save-btn{
	    				width:4em;
	    				height:2em;
	    				display:block;
	    				text-align:center;
	    				line-height:2em;
	    				background-color:#0099ff;
	    				border-radius:3px;
	    				margin-top:2em;
	    				margin-left:30%;
	    			}
	    			.blue-none{
	    				 width:4em;
	    				height:2em;
	    				display:block;
	    				text-align:center;
	    				line-height:2em;
	    				background-color:#666666;
	    				border-radius:3px;
	    				margin-top:2em;
	    				margin-left:30%;
	    			}
	    			.space-left{
					margin-right:1em;
					float:left;
					margin-top:0.2em;
	    			}
	    			.outer{
	    				width:80%;
	    				display:inline-block;
	    				.inner{
	    					width:100%;
	    					height:2em;
	    					background-color:#666666;
	    					border-radius:5px;
	    					position:relative;
	    					text-align:center;
	    					line-height:2em;
	    					.have-use{
	    						width:20%;
	    						height:2em;
	    						display:block;
	    						border-radius:5px;
	    						background-color:#0099ff;
	    						position:absolute;
	    						top:0;
	    						left:0;
	    						text-align:right;
	    					}
	    				}
	    				.store{
	    					width:100%;
	    					text-align:center;
	    					em{
	    						font-style:normal;
	    						color:#0099ff
	    					}
	    				}
	    			}
	    			.set-remind{
	    				margin-top:2em;
	    				input{
	    					width:4em;
	    					height:1.8em;
	    					margin:0 0.3em;
	    					border:1px solid #aaa;
	    					border-radius:3px;
	    					text-align:center;
	    				}
	    			}
	    			.email{
	    				margin-top:3em;
	    				input{
	    					width:50%;
	    					height:1.8em;
	    					border:1px solid #aaa;
	    					border-radius:3px;
	    					padding-left:0.2em;
	    				}
	    			}
	    		}
	    		.right{
	    			float:left;
	    			width:45%;
	    			margin-top:-4em;
	    		}
	    	}
	    	.resource-bottom{
	    		width:100%;
	    		padding:2em 6em;
	    		.table-title{
	    			width:100%;
	    			text-align:center;
	    			font-size:1.3em;
	    			.table-text{
	    				font-weight:400;
	    				margin-right:1em;
	    			}
	    			select{
	    				color:#666;
	    			}
	    		}
	    	}
	}
</style>