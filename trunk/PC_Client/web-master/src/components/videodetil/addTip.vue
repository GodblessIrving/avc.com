<template>
<div v-if="isAdd" class="masklayer">
	<div class="add-tip" >
		<div class="move-title">
			<p class="title-name">{{title}}标注</p>
			<p class="title-close" @click="closeMove()" style="font-size:2.2em; font-weight:400">×</p>
		</div>
		<div class="add-content">
			<p style="margin-bottom:1em;" v-show="isVideo">
				<span style="position:relative; top:-1.5em;">抽帧：</span>
				<span class="img" v-bind:style = " { 'background-image' : 'url('+picPath+')'} ">
				</span>
				<!-- <em @click='resetMark'>重抽</em> -->

			</p>
			<p>
				<span>时间戳：</span>
				<span>{{timestamp}}</span>
			<p>
				<span style="float:left;">描述：</span>
				<textarea cols="70" rows="6" placeholder="请输入标注描述（最多输入200字）" maxlength="200" style="float:left;" v-model='description'></textarea>
			</p>
		</div>
		<div class="bottom-btn">
			<a href="javascript:void(0)" class="blueSave" @click="addtip()">保存</a>
			<a href="javascript:void(0)" class="blue-none cancel-btn" @click="closeMove()">取消</a>
		</div>

		<alert-tip :message='message' :isShowtip='showTip' @closeTipEvent = 'closeTip'>
      		</alert-tip>
	</div>
</div>
</template>
<script  type="text/ecmascript-6">
import alertTip from '../alertTip'
	export default {
		name:"move-to",	 	
		data(){
			return{
				title:'新增',
				description:'',
				message:'',
				showTip:false,
				flag:false
			}
		},
		props:["isAdd","isVideo","picPath","timestamp","content",'optype'],
		watch:{
			isAdd:function(val,oldval){
				if(this.isAdd){
					this.flag = false;
					if(this.content){
						this.description = this.content;
					}else{
						this.description = null;
					}					
				}
			},
			optype:function(val,oldVal){
				if(val==1){
				     this.title='编辑';
				}else{
				     this.title='新增';
				}
			}
		},
		components: { alertTip},	
 		methods: {
 		closeTip(){
 			this.showTip=false;
 		},
 		  closeMove(){
 		  	this.description = '';
 		  	 this.$emit('closeNewEvent');
 		  },
 		  addtip(){
 		  	if(this.flag){
 		  		return
 		  	}
 		  	//如果是视频,保存时需要将帧图上传至文件服务器,获取其地址;
 		  	if (this.isVideo&&this.optype==0) {
				var blob=this.getBlobBydataURI(this.picPath,'image/png');
				var _this=this;
				this.readImageMD5(blob,function(addr){
	 		  	_this.$emit('addNewEvent',_this.description,addr,_this.timestamp);
				_this.description = '';
				_this.flag = true;
				});	
 		  	}else{
	 		  	this.$emit('addNewEvent',this.description,this.picPath,this.timestamp);
 		  		this.description = '';
 		  		this.flag = true;
 		  	}
 		  },
 		  //将dataUrl数据转成blob数据;
 		  getBlobBydataURI(dataURI,type) {  
		    var binary = atob(dataURI.split(',')[1]);  
		    var array = [];  
		    for(var i = 0; i < binary.length; i++) {  
		        array.push(binary.charCodeAt(i));  
		    }  
		    return new Blob([new Uint8Array(array)], {type:type });  
		} ,
		//获取帧图的md5,并上传至存储服务器,且获取其存放的地址;
		readImageMD5(blob,callback){
		      var fileReader=new FileReader();
		      var _this=this;

		      fileReader.onload=function(e){
		          var spark=new SparkMD5();
		          spark.appendBinary(e.target.result);
		          var md5=spark.end();
		          this.frameMD5=md5;
		          console.log(md5,blob.size);

		          _this.$http.get('/storage/getuploadpath',{
		              params:{
		                  fileid:md5,
		                  filesize:blob.size,
		                  ntimeout:2,
		                  t:(new Date()).getTime()
		              }
		          }).then(res=>{
		          	console.log(res);
		                  var d=$.parseJSON(res.data);
		                  if (d) {
		                      if (d.msgid==200) { 
		                      	console.log(d.data);                                              
		                          var json=JSON.parse(d.data);
		                          var file_addr=json.file_addr;
		                          var addr=json.upload_addr;

		                          if(file_addr&&addr===null){
		                             console.log('帧图秒传');
				    _this.$emit('addNewEvent',_this.description,file_addr,_this.timestamp);
			                 _this.description = '';
		                              return false;	
		                          }

		                          var path;
		                          for(var i=0;i<addr.length;i++){
		                                var ad=addr[i];
		                                if (ad.indexOf('ws:')==0) {
		                                  path=ad;
		                                  break;
		                                }
		                          }
		                          var filename="frame_"+Date.parse(new Date())+".png";
		                          var uri=path+'file_id='+md5+'&file_size='+blob.size+'&file_name='+Base64.encode(filename);
		                          console.log(uri);
		                          var ws=_this.createSocket(uri,function(){
		                                ws.send(blob);
		                                var timer= setInterval(function(){
		                                        if (ws.bufferedAmount===0) {
		                                            ws.close();
		                                            clearInterval(timer);
		                                            _this.getFilePath(md5,callback);
		                                        }
		                                    }, 100);
		                          });
		                        }else{
		                        	console.log(d.msg);
		                        }
		                  }
		          }).catch(err=>{
		          	console.log(err);
		          });
		       }

		       fileReader.readAsBinaryString(blob);
		},
		createSocket(uri,callback){
		    var ws = new WebSocket(uri);
		    ws.onopen = function () {
		        console.log('connected成功');
		        if (callback)
		            callback();
		    }
		    ws.onmessage = function (e) {
		        var data = e.data;
		        console.info(data);
		    }
		    ws.onclose = function (e) {
		        console.info(e);
		        console.log('链接断开');
		    }
		    ws.onerror = function (e) {
		        console.info(e);
		        console.log('传输中发生异常');
		    }
		    return ws;
		},
		getFilePath(md5,callback){
		          var _this=this;
		          
		          var code=setInterval(function(){
			          $.ajax({
			          	url: _this.ajaxBaseUrl+'/storage/getuploadstatus',
			          	type: 'GET',
			          	xhrFields:{withCredentials:true},
			          	dataType: 'json',
			          	async : false,
			          	cache:false,
			          	data: {fileid: md5},
			          })
			          .done(function(res) {
			          	var d=$.parseJSON(res);
				if (d.msgid==200) {
				  var json=JSON.parse(d.data); 
				  if (json.status==16) {
				       _this.$http.get('/storage/getfilepath',{
				            params:{
				                fileid:md5
				            }
				        }).then(res=>{
				                var d=$.parseJSON(res.data);
				                if (d.msgid==200) {
				                    var json=JSON.parse(d.data); 
				                    var addr=json.file_addr;
				                    if (callback) {
				                    	callback(addr);
				                    }
				                } 
				        });

				        clearInterval(code);
				  }
				} 
			          })
			          .fail(function() {
			          	console.log("error");
			          });
		          
		          }, 10);
		},
 		}
	}
</script>
<style lang="scss">
	.add-tip{
		width:50em;
		height:auto;
		position:absolute;
		left:50%;
		top:16%;
		margin-left:-25em;
		background:url("../../assets/module/u10.png") no-repeat;
		background-size:100% 100%;
		padding: 0 0.4em;
		color:#fff;
		z-index:9999;
		.move-title{
			width:100%;
			height:3em;
			background-color:#0099ff;
			padding:0 2em;
			line-height:3em;
			.title-name{
				float:left;
				font-size:1.2em;
			}
			.title-close{
				float:right;
				cursor:pointer;
				font-size:1.5em;
				font-weight:700;
			}
		}
		.add-content{
			clear:both;
			padding:2em 3em;
			p{
                                 width:100%;
                                 overflow:hidden;
                                 margin-bottom:2em;
                                 span{
                                     margin-right:3em;
                                 }
			.img{
				display:inline-block;
				width:5em;
				height:4em;
				margin-right:0;
				background-image:url('../../assets/module/u184.jpg');
				background-size:contain;
                  	background-repeat:no-repeat;
                  	background-position:center center;
			}
			em{
				font-style:normal;
				color:#0099ff;
				cursor:pointer;
			}
                                textarea{
                                         background:none;
                                         border-radius:3px;
                                         border:1px solid #4e4e4e;
                                         resize:none;
                                }
                             }
		}
		.bottom-btn{
			height:4em;
			width:95%;
			margin:0 auto;
			text-align:center;
			clear:both;

			a{
                                    color:#fff;
                                     text-decoration: none;
                                     margin-right:1em;
                                     border-radius:3px;
                                     padding:0.3em 1em;
                                     margin-top:0.8em;
                                     background-repeat:no-repeat;
                                     background-position:5px center;
                                }
                                .blueSave{
                                	background-color:#0099ff;
                                }
                                .cancel-btn{
                                	background-color:#666;
                                }
		}
	}
</style>