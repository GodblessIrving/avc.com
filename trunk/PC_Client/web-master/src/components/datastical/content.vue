<template>
	<div class="content-stical">
		<!-- <p class="time" style="font-size:1.2em">截至日期：{{time}} </p> -->
		<div class="charts">
			<ul>
				<li>
					<p class="typename">视频</p>
					<p class="typediscripation">
						视频累计<em>{{videoTime}}</em>小时；<em>{{videoinfo.totalcount}}</em>条记录，占存储<em>{{videosize}}</em>，其中
					</p>
					<p class="type">分类</p>
					<div id="myChart" :style="{width: '90%', height: '26em'}"></div>
					<p  class="type">来源</p>
					<div id="myChart1" :style="{width: '90%', height: '26em'}"></div>
				</li>
				<li>
					<p class="typename">音频</p>
					<p class="typediscripation">
						音频累计<em>{{audioTime}}</em>小时；<em>{{audioinfo.totalcount}}</em>条记录，占存储<em>{{audiosize}}</em>，其中
					</p>
					<p class="type">分类</p>
					<div id="myChart2" :style="{width: '90%', height: '26em'}"></div>
					<p  class="type">来源</p>
					<div id="myChart3" :style="{width: '90%', height: '26em'}"></div>
				</li>
				<li>
					<p class="typename">图片</p>
					<p class="typediscripation">
						图片累计<em>{{picinfo.totalcount}}</em>张;占存储<em>{{picsize}}</em>，其中
					</p>
					<p class="type">分类</p>
					<div id="myChart4" :style="{width: '90%', height: '26em'}"></div>
					<p  class="type">来源</p>
					<div id="myChart5" :style="{width: '90%', height: '26em'}"></div>
				</li>
				<li>
					<p class="typename">文稿</p>
					<p class="typediscripation">
						文稿累计<em>{{wordinfo.totalcount}}</em>个;占存储<em>{{wordsize}}</em>，其中
					</p>
					<p class="type">分类</p>
					<div id="myChart6" :style="{width: '90%', height: '26em'}"></div>
					<p  class="type">来源</p>
					<div id="myChart7" :style="{width: '90%', height: '26em'}"></div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	export default{
		data(){
			return{
				videoinfo:[],
				audioinfo:[],
				picinfo:[],
				wordinfo:[],
				videosize:'',
				audiosize:'',
				picsize:'',
				wordsize:'',
				time:'',
				videoTime:'',
				audioTime:'',
				// 视频分类
				videotype:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        // 视频来源
				videoresource:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        	// 音频分类
                        	audiotype:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        	// 音频资源
                        	audioresource:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        // 图片分类
                        pictype:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        	// 图片资源
                        	picresource:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        // 文稿分类
                        wordtype:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
                        // 文稿资源
                        wordresource:[{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
					value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}},{
                        	value:'',
					name:'',
					itemStyle:{
                        				       normal:{
                        				           color:''
                        				       }
                        				}}],
				colors:["#f05352","#1bb934","#0faeff","#cd4ff2","#fac83f","#0078d7"],
				
			}
		},
		mounted:function(){
			this.getVideoInfo();
			this.getAudioInfo();
			this.getpicInfo();
			this.getwordInfo();
			var datatime = new Date().toLocaleDateString();
			this.time = datatime.replace("/","-");
			this.time = this.time.replace("/","-");
		},
		methods:{
			// 获取视频数据
			getVideoInfo(){
				this.$http.get('/Statistics/VideoDurationStatistics',{
					params:{}
				}).then(res=>{
					var d=$.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							this.videoinfo = d.data;
							var time = this.videoinfo.totaltime/3600;
							this.videoTime = time.toFixed(2);
							var num = Math.pow(1024,3);
							var num1 = Math.pow(1024,2);
							if(this.videoinfo.totalsize/num >= 0.1){
								var a = this.videoinfo.totalsize/num;
								this.videosize = a.toFixed(2) + 'GB';
							}else{
								var a = this.videoinfo.totalsize/num1;
								this.videosize = a.toFixed(2) + 'MB';
							}
							var videoclass = this.videoinfo.class;
							var videosource = this.videoinfo.source;
							for(var i = 0; i < videoclass.length; i++){
								this.videotype[i].itemStyle = {normal:{
                        				      						             color:this.colors[i]
                        				      						         }};
                        				     			this.videotype[i].name = videoclass[i].name;
                        				     			this.videotype[i].value = videoclass[i].percent
							}

							for(var i = 0; i < videosource.length; i++){
								 this.videoresource[i].itemStyle = {normal:{
                        				      						             color:this.colors[i]
                         				      						         }};
                        				     			this.videoresource[i].name = videosource[i].name;
                         				     			this.videoresource[i].value = videosource[i].percent
							}

							 this.drawLine();
							 this.drawLine1();
						}else{
							console.log(d.msg)
						}
					}
				})
			},
			// 获取音频数据
			getAudioInfo(){
				this.$http.get('/Statistics/AudioDurationStatistics',{
					params:{}
				}).then(res=>{
					var d=$.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							this.audioinfo = d.data;
							var time = this.audioinfo.totaltime/3600;
							this.audioTime = time.toFixed(2);
							var num = Math.pow(1024,3);
							var num1 = Math.pow(1024,2);
							if(this.audioinfo.totalsize/num >= 0.1){
								var a = this.audioinfo.totalsize/num;
								this.audiosize = a.toFixed(2) + 'GB';
							}else{
								var a = this.audioinfo.totalsize/num1;
								this.audiosize = a.toFixed(2) + 'MB';
							}
							var audioclass = this.audioinfo.class;
							var audiosource = this.audioinfo.source;
							 for(var i = 0; i < audioclass.length; i++){
								this.audiotype[i].itemStyle = {normal:{
                         				      						             color:this.colors[i]
                         				      						         }};
                        				     			this.audiotype[i].name = audioclass[i].name;
                        				     			this.audiotype[i].value = audioclass[i].percent
							}
							for(var i = 0; i < audiosource.length; i++){
								this.audioresource[i].itemStyle = {normal:{
                        				      						             color:this.colors[i]
                        				      						         }};
                        				     			this.audioresource[i].name = audiosource[i].name;
                        				     			this.audioresource[i].value = audiosource[i].percent
							 }
							this.drawLine2();
							this.drawLine3();
						}else{
							console.log(d.msg)
						}
					}
				})
			},
			// 获取图片数据
			getpicInfo(){
				this.$http.get('/Statistics/PicCountStatistics',{
					params:{}
				}).then(res=>{
					var d=$.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							this.picinfo = d.data;
							var num = Math.pow(1024,3);
							var num1 = Math.pow(1024,2);
							if(this.picinfo.totalsize/num >= 0.1){
								var a = this.picinfo.totalsize/num;
								this.picsize = a.toFixed(2) + 'GB';
							}else{
								var a = this.picinfo.totalsize/num1;
								this.picsize = a.toFixed(2) + 'MB';
							}
							var picclass = this.picinfo.class;
							var picsource = this.picinfo.source;
							 for(var i = 0; i < picclass.length; i++){
								this.pictype[i].itemStyle = {normal:{
                         				      						             color:this.colors[i]
                         				      						         }};
                        				     			this.pictype[i].name = picclass[i].name;
                        				     			this.pictype[i].value = picclass[i].percent
							}
							for(var i = 0; i < picsource.length; i++){
								this.picresource[i].itemStyle = {normal:{
                        				      						             color:this.colors[i]
                        				      						         }};
                        				     			this.picresource[i].name = picsource[i].name;
                        				     			this.picresource[i].value = picsource[i].percent
							 }
							this.drawLine4();
							this.drawLine5();
						}else{
							console.log(d.msg)
						}
					}
				})
			},
			// 获取文稿数据
			getwordInfo(){
				this.$http.get('/Statistics/DocCountStatistics',{
					params:{}
				}).then(res=>{
					var d=$.parseJSON(res.data);
					if(d){
						if(d.msgid == 200){
							this.wordinfo = d.data;
							// console.log(this.wordinfo)
							var num = Math.pow(1024,3);
							var num1 = Math.pow(1024,2);
							if(this.wordinfo.totalsize/num >= 0.1){
								var a = this.wordinfo.totalsize/num;
								this.wordsize = a.toFixed(2) + 'GB';
							}else{
								var a = this.wordinfo.totalsize/num1;
								this.wordsize = a.toFixed(2) + 'MB';
							}
							var wordclass = this.wordinfo.class;
							console.log(wordclass)
							var wordsource = this.wordinfo.source;
							 for(var i = 0; i < wordclass.length; i++){
								this.wordtype[i].itemStyle = {normal:{
                         				      						             color:this.colors[i]
                         				      						         }};
                        				     			this.wordtype[i].name = wordclass[i].name;
                        				     			this.wordtype[i].value = wordclass[i].percent
							}
							for(var i = 0; i < wordsource.length; i++){
								this.wordresource[i].itemStyle = {normal:{
                        				      						             color:this.colors[i]
                        				      						         }};
                        				     			this.wordresource[i].name = wordsource[i].name;
                        				     			this.wordresource[i].value = wordsource[i].percent
							 }
							this.drawLine6();
							this.drawLine7();
						}else{
							console.log(d.msg)
						}
					}
				})
			},
			// 视频分类图表
			drawLine(){
  			     let myChart = this.$echarts.init(document.getElementById('myChart'))
  			     myChart.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}:({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.videotype,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'分类名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.videotype
    				      }
    				  ]
  			     });
  			 },
  			// 视频来源图表
  			drawLine1(){
  			     let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
  			     myChart1.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}: ({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.videoresource,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'来源名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.videoresource
    				      }
    				  ]
  			     });
  			 },
  			// 音频分类图表
  			drawLine2(){
  			     let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
  			     myChart2.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}: ({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.audiotype,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'分类名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.audiotype
    				      }
    				  ]
  			     });
  			 },
  			// 音频来源图表
  			 drawLine3(){
  			     let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
  			     myChart3.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}:({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.audioresource,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'来源名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.audioresource
    				      }
    				  ]
  			     });
  			 },
  			// 图片分类图表
  			 drawLine4(){
  			     let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
  			     myChart4.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}:({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.pictype,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'分类名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.pictype
    				      }
    				  ]
  			     });
  			 },
  			// 图片来源图表
  			 drawLine5(){
  			     let myChart5 = this.$echarts.init(document.getElementById('myChart5'))
  			     myChart5.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}:({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.picresource,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'来源名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.picresource
    				      }
    				  ]
  			     });
  			 },
  			// 文稿分类图表
  			drawLine6(){
  			     let myChart6 = this.$echarts.init(document.getElementById('myChart6'))
  			     myChart6.setOption({
  			       tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}:({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.wordtype,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'分类名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.wordtype
    				      }
    				  ]
  			     });
  			 },
  			 // 文稿来源图表
  			drawLine7(){
  			     let myChart7 = this.$echarts.init(document.getElementById('myChart7'))
  			     myChart7.setOption({
  			        tooltip: {
    				      trigger: 'item',
    				      formatter: "{a} <br/>{b}: ({d}%)"
    				  },
    				  legend: {
    				      orient: 'horizontal',
    				      x: 'center',
    				      data:this.wordresource,
    				      textStyle:{
           				                color:"#fff",//标题颜色
           				                fontWeight:"none"
           				            },
           			formatter: function (name) {
					    return (name.length > 2 ? (name.slice(0,2)+"...") : name ); 
					}
    				  },
    				  series: [
    				      {
    				          name:'来源名称',
    				          type:'pie',
    				          radius: ['45%', '60%'],
    				          avoidLabelOverlap: false,
    				          label: {
    				              normal: {
    				                  show: false,
    				                  position: 'center'
    				              },
    				          },
    				          labelLine: {
    				              normal: {
    				                  show: false
    				              }
    				          },
    				          data:this.wordresource
    				      }
    				  ]
  			     });
  			 },
		}
	}
</script>
<style lang="scss">
	.content-stical{
		color:#fff;
		padding:1em 3em;
		.charts{
			width:100%;
			overflow:hidden;
			ul{
				width:100%;
				li{
					width:25%;
					float:left;
					padding:1em;
					.typename{
						color:#0099ff;
						width:100%;
						text-align:center;
						font-size:1.2em;
					}
					.typediscripation{
						height:3em;
						em{
							color:green;
							font-style:normal;
							font-size:1.2em;
						}
					}
					.type{
						width:100%;
						color:#fac83f;
						font-size:1.5em;
						text-align:center;
						margin-top:2em;
						margin-bottom:1em;
					}
				}
			}
		}
	}
</style>