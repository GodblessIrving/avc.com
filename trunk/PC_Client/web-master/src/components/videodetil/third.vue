<template>
    <div class="third">
    	<div class="third-top">
    		<ul>
    		<li v-for="c in comments">
    			<div class="pic" v-if="c.avatar" v-bind:style = " { 'background-image' : 'url('+c.avatar+')'} "></div>
                                      <div class="pic" v-else></div>
    			<span class="name">{{c.uname?c.uname:'未命名'}}</span>
    			<span class="time">{{getTime(c.createtime)}}</span>
    			<p><span :id="c.id" :title="c.content">{{c.content}}</span></p>
                                       <img v-if="c.pic" :src="c.pic" width="70%" style="margin-left:5em;">
    		</li>
    	</ul>
    	</div>
    	<div class="third-bottom">
    		<div class="third-content">
              <textarea placeholder="请发表您的评论（最多2000字）！" maxlength="2000" v-model="content" @change="contentChange"></textarea>
              <p class="pictrue">
                <span v-show="close" @click="changePic"></span>
                <img :src="pic" alt="" width="100%" style="margin-left:1em;">
              </p>
              <!-- <p class="picture" v-if="pic" v-bind:style = " { 'background-image' : 'url('+pic+')'} "></p> -->
            </div>
    		<div class="third-Userinfo">
    			<p class="tou" v-if="curUser.avatar" v-bind:style = " { 'background-image' : 'url('+curUser.avatar+')'} "></p>
                                      <p class="tou" v-else></p>
    			<span class="third-name">{{curUser.realname?curUser.realname:'未命名'}}</span>
    			<p class="third-pic">图片</p>
    			<span class="third-btn" @click="makeComment">发表评论</span>
    			<p class="pic-tip" v-show="picError">{{mess}}</p>
    			<p class="cont-tip" v-show="contentEmpty">内容为空不能发表，请在输入框中输入内容</p>
                                      <input type="file" accept="image/*" @change="uploadImg" id="myfile" style="opacity:0; position:relative;top:1.8em;left:-5em;cursor:pointer;width:2.5em;"/>
    		</div>
                          <!-- <img v-if="pic" :src="pic" width="70%"> -->
    	</div>

              <alert-tip :message='message' :isShowtip='showTip' @closeTipEvent = 'showTip=false;'></alert-tip>
    </div>
</template>
<script type="text/ecmascript-6">
import alertTip from '../alertTip'
export default{
	name:"third",
             data(){
                return{
                    comments:[],
                    pic:'',
                    content:'',
                    //提示
                    message:'',
                    showTip:false,
                    contentEmpty:false,
                    picError:false,
                    mess:'',
                    close:false,
                    md5:null,
                };
             },
             props:{
                resid:{
                    required:true
                },
             },
             computed:{
                curUser:function(){
                    return this.$store.state.user;
                },
             },
             components:{alertTip},
             mounted(){
                this.getUserComments();
             },
             methods:{
                getUserComments(){
                    this.$http.get('/Resource/GetCommentByRid',{
                        params:{
                            rid:this.resid
                        }
                    }).then(res=>{
                        if(res.data){
                            var d=JSON.parse(res.data);
                            if(d.msgid==200){
                                this.comments=d.data;
                                this.$parent.cnum='('+d.count+')';
                            }else{
                                console.log(d.msg);
                            }
                        }
                    });
                },
                changePic(){
                  this.close = false;
                  this.pic = "";
                },
                getTime(time){
                    var str='';
                    var time1=new Date(time);
                    var now=new Date();
                    var ts=now.getTime()-time1.getTime();
                    var min=Math.floor(ts/(1000*60));
                    if(min<30){
                        str='刚刚';
                    }else if(min>=30&&min<60){
                        str='30分钟前'
                    }else if(60<=min&&time1.Format('yyyy-MM-dd')==now.Format('yyyy-MM-dd')){
                        str=Math.floor(min/60)+'小时前';
                     }else{
                        str = time
                     }
                    return str;
                },
                makeComment(){
                    if(!this.content&&!this.pic){
                        this.contentEmpty=true;
                        return false;
                    }
                    this.$http.post('/Resource/MakeComment',{
                            rid:this.resid,
                            uid:this.curUser.uid,
                            content:this.content,
                            pic:this.md5
                    }).then(res=>{
                        if(res.data){
                            this.pic='';
                            this.content='';
                            $("#myfile").val('');
                            var d=JSON.parse(res.data);
                            if(d.msgid==200){
                                this.getUserComments();
                                this.pic='';
                                this.content='';
                                this.close = false;
                                $("#myfile").val('');
                            }else{
                                this.message=d.msg;
                                this.showTip=true;
                            }
                        }
                    });
                },
                contentChange(){
                    if(this.content){
                        this.contentEmpty=false;
                    }
                },
                 uploadImg(){
                        var myfile=document.getElementById('myfile');
                         var blob=myfile.files[0];
                         var filename=blob.name;
                         var nameList = filename.split(".");
                         if(nameList[1]!="jpg"&&nameList[1]!="png"&&nameList[1]!="jpeg"){
                            this.picError=true;
                            this.mess = "请上传图片格式的文件"
                            return false;
                         }
                         if(blob.size>2*1024*1024){
                            this.picError=true;
                            this.mess = "您所选的图片已超过2MB"
                            return false;
                         }
                        this.picError=false;            
                        this.readImageMD5(blob,filename); 
                  },
                  readImageMD5(blob,filename){
                              var fileReader=new FileReader();
                              var _this=this;

                              fileReader.onload=function(e){
                                    var spark=new SparkMD5.ArrayBuffer();
                                    spark.append(e.target.result);
                                    _this.md5=spark.end();;
                                    _this.$http.get('/storage/getuploadpath',{
                                        params:{
                                            fileid:_this.md5,
                                            filesize:blob.size,
                                            ntimeout:2,
                                            t:(new Date()).getTime()
                                        }
                                    }).then(res=>{
                                      console.log(res);
                                            var d=$.parseJSON(res.data);
                                            if (d) {
                                                if (d.msgid==200) {                                             
                                                    var json=JSON.parse(d.data);
                                                    var file_addr=json.file_addr;
                                                    var addr=json.upload_addr;
                                                    if(file_addr&&addr===null){
                                                       _this.pic=file_addr;
                                                       _this.close = true;
                                                       console.log('头像秒传',_this.pic);
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
                                                    var uri=path+'file_id='+_this.md5+'&file_size='+blob.size+'&file_name='+Base64.encode(filename);
                                                    var ws=_this.createSocket(uri,function(){
                                                          ws.send(blob);
                                                          var timer= setInterval(function(){
                                                                  if (ws.bufferedAmount===0) {
                                                                      ws.close();
                                                                      clearInterval(timer);
                                                                      _this.getFilePath(_this.md5);
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
                                };

                               fileReader.readAsArrayBuffer(blob);
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
                        getFilePath(md5){
                                  var _this=this;
                                  
                                  var code=setInterval(function(){
                                    $.ajax({
                                      url: _this.ajaxBaseUrl+'/storage/getuploadstatus',
                                      type: 'GET',
                                      dataType: 'json',
                                      xhrFields:{withCredentials:true},
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
                                                          _this.pic=json.file_addr;
                                                          _this.close = true;
                                                      } 
                                              });
                                              clearInterval(code);
                                        }
                                      } 
                                    })
                                    .fail(function() {
                                      console.log("error");
                                    });
                                  
                                  }, 30);
                        },
             }
}
</script>
<style lang="scss">
.third{
        width:100%;
        height:60em;
        background-color:#303030;
        border:1px solid #282828;
        padding:2em 0.2em;
        border-radius:0 0 5px 5px;
        box-sizing:border-box;

        .third-top{
        	width:100%;
        	height:40em;
        	overflow-y:auto;
        	ul{
        	width:100%;
        	padding:0 1em;
        	height:auto;
        	li{
        		overflow:hidden;
        		border-bottom:1px dashed #454545;
        		padding:1em 0;

        		.pic{
        		    float:left;
        		    width:4em;
        		    height:4em;
        		    border-radius:50%;
                      background-size:cover;
                      background-repeat:no-repeat;
                      background-position:center center;
                      background-image:url('../../assets/setUser/u404.png');
        		}
        		.name{
        			float:left;
        			margin-left:1em;
        			line-height:4em;
        		}
        		.time{
        			float:left;
        			color:#5f5f5f;
        			margin-left:2em;
        			line-height:4em;
        		}
        		p{
        			clear:both;
        			padding-left:5em;
        			box-sizing:border-box;

        			span{
        				display:block;
        				margin-bottom:0.5em;
        			}
        		}
        	}
        }
        }
        .third-bottom{
        	width:100%;
        	height:18em;
        	padding:2em 1em;
           .third-content{
            width:100%;
            height:9em;
            border:1px solid #454545;
            border-radius:3px 3px 0 0;
            background-color:#303030;
            overflow-y:auto;
           }
           .pictrue{
            width:80%;
            position:relative;    

            span{
              position:absolute;
              width:3em;
              height:3em;
              top:-1em; 
              right:-1.5em;
              cursor:pointer;
              background:url("../../assets/resouce/u1153.png") no-repeat center;
              background-size:100%;
            }      
           }
        	textarea{
		width:100%;
		height:9em;
           border:none;
		background-color:#303030;
		resize:none;
        	}
        	.third-Userinfo{
            width:100%;
            height:5em;
            border:1px solid #454545;
		border-top:none;
		margin-top:-5px;
		position:relative;

		.tou{
			width:3.5em;
			height:3.5em;
			float:left;
			margin-top:0.85em;
			margin-left:2em;
                border-radius:50%;
                background-size:cover;
                background-repeat:no-repeat;
                background-position:center center;
                background-image:url('../../assets/setUser/u404.png');
		}
		.third-name{
			float:left;
			line-height:5em;
			margin-left:0.5em;
		}
		.third-pic{
			float:left;
			background:url("../../assets/videoPlay/pic.png") no-repeat left center;
			height:5em;
			line-height:5em;
			padding-left:3.3em;
			margin-left:3em;
			cursor:pointer;
        		}
        		.third-btn{
        			background-color:#0099ff;
        			padding:0.2em 0.3em;
        			float:right;
        			margin-right:0.5em;
        			margin-top:1.5em;
        			cursor:pointer;
        		}
        		.pic-tip{
        			width:12em;
        			height:4em;
        			background:url("../../assets/videoPlay/u413.png") no-repeat left center;
        			background-size:100% 100%;
        			color:#757570;
        			position:absolute;
        			bottom:3em;
        			left:7em;
                          text-align:center;
        			line-height:3em;
        		}
        		.cont-tip{
        			width:13em;
        			height:4em;
        			background:url("../../assets/videoPlay/u417.png") no-repeat left center;
        			background-size:100% 100%;
        			color:#757570;
        			position:absolute;
        			bottom:3em;
        			right:1em;
        		}		
	}
        }
    }
</style>