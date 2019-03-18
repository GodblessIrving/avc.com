<template>
  <div class="myresource-view">
	<!-- <slide-nav></slide-nav> -->
	<div class="right">
		<div class="top">
			<p class="clod">
				<img src="../assets/resouce/u50.png" width="50%">
				<span class="name">我的云盘</span>
			</p>
			<div class="proportion">
				<el-progress :text-inside="true" :stroke-width="18" :percentage="rate"></el-progress>
				<span class="roleName" :title="rolename">{{rolename}}</span>
				<p>
					<span style="color:##0099ff;">{{usedspace}}</span>
					<span style="color:#999;">/</span>
					<span style="color:#999;">{{space}}</span>
				</p>
			</div>
			<p class="sear-in">
                		<input type="text" placeholder="模糊搜索我的资源内容" v-model="keywords">
                         <span class="searbth" @click="searchReource">搜索</span>
            	</p>
		</div>
		<div class="bottom">
			<myres-info :num="num" :keywords="keywords" ref="resinfo" @changeMemory="changeSpace"></myres-info>
		</div>
            <common-tip :isShow="ShowDelTip" :message="comMsg" @delObjEvent="confirmExist" @closeTipEvent="cancelExist">
            </common-tip> 
	</div> 
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav"
import MyresInfo from "../components/myresource/MyresInfo"
import CommonTip from "../components/CommonTip"
export default {
  name: 'myresource-view',
  data(){
    return{
        rolename:'未登录',
        space:0,
        usedspace:0,
        uid:0,
        rate:0,
        num:0,
        keywords:'',
        //
        ShowDelTip:false,
        comMsg:'还有文件正在上传,是否退出?',
        next:'',
    }
  },
  components: {MyresInfo,CommonTip},
  mounted:function(){
    let user=this.$store.state.user;
    this.rolename=user.rname;
    this.uid=user.uid;
    this.getMyCloudSpace(this.uid);
  },
  methods:{
      getMyCloudSpace(uid){
          this.$http.get('/myResources/GetMyCloudCapacity',{
              params:{
                  uid:uid,
              }
          }).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                  if (d.msgid==200) {
                      var allsize=d.data.allsize;
                      var size=d.data.size;
                      var percent=(size*100/allsize).toFixed(2);
                      this.rate=percent>100?100:percent;
                      var reg = /[a-zA-Z]/g;
                      this.space=this.convert(allsize);
                      this.usedspace=this.convert(size);           
                  }
              }
          })
      },
      searchReource(){
        this.num += 1;
      },
      confirmExist(){
        this.ShowDelTip=false;
        this.$refs.resinfo.stop();
        this.next();
      },
      cancelExist(){
        this.ShowDelTip=false;
        this.next(false);
      },
      changeSpace(){
        this.getMyCloudSpace(this.uid);
      },
      convert(size){
        if(size>1024*1024*1024*1024){
          return (size/(1024*1024*1024*1024)).toFixed(2)+'TB'; 
        }
        if(size>1024*1024*1024){
          return (size/(1024*1024*1024)).toFixed(2)+'GB'; 
        }
        if(size>1024*1024){
          return (size/(1024*1024)).toFixed(2)+'MB'; 
        }
        if(size>1024){
          return (size/1024).toFixed(2)+'KB';  
        }
        return size+'B';
      },
  },
  beforeRouteLeave (to, from , next) {
    //离开我的资源时,提示用户是否退出
    if(this.$refs.resinfo.task){
       this.ShowDelTip=true;
       this.next=next;
    }else{
      next();
    }
  },
}
//
</script>

<style lang="scss">
.myresource-view{
	width:100%;
	overflow:hidden;
	position:relative;
      top:-85em;
      left:5%;
	color:#ffffff;
      .el-tree{
      background:none;
      color:#fff;
    }
    .el-progress-bar{
      width:80%;
      float:left;
      margin-right:0.5em;
    }
    .el-tree-node__expand-icon.expanded{
      background:url("../assets/resouce/u827.png") no-repeat;
      background-size:100%;
      transform:rotate(0deg);
      display:inline-block;
      height:2em;
      width:2em;
      margin-right:1em;
      margin-top:5px;
    }
    .el-pagination{
      left:0;
      bottom:3em;
      text-align:center;
      width:100%;
      position:absolute;
    }
    .el-tree-node__expand-icon{
      background:url("../assets/resouce/u825.png") no-repeat;
      background-size:100%;
      transform:rotate(0deg);
      display:inline-block;
      height:2em;
      width:2em;
      margin-right:1em;
      margin-top:5px;
    }
    .el-icon-caret-right:before{
      content:"";
    }
    .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover{
      background-color:#31495a;
    }
    .el-progress-bar__innerText{
      display:none;
    }
	.green{
      		color:#00cc00;
      	}
      	.red{
      		color:#ff0000;
      	}
      	.orange{
      		color:#ff9900;
      	}
      	.gray{
      		color:#666;
      	}
      .file-op{
            position:absolute;
            right:1em;
            bottom:4em;
      }
      .file-op span{
            display:inline-block;
            width:2em;
            height:2em; 
            float:right;
            color:#0099ff;
      }
      .icon-start{
            background:url("../assets/resouce/u402blue.png") no-repeat center;
            background-size:50%;  
      }

	.right{
		float:left;
		width:93%;
		overflow:hidden;
		padding-top:1em;
		margin-left:1%;
            .edit{
                background:url("../assets/videoPlay/u146.png") no-repeat 0.3em center;
                background-size:30%;
                padding-left:2em;
            }
		.top{
			width:100%;
			height:10em;
			background:url("../assets/module/u10.png") no-repeat;
			background-size:100% 100%;

			.clod{
				width:10em;
				float:left;
				text-align:center;
				padding-top:1em;

				.name{
					display:block;
					margin-top:0.6em;
				}
			}
			.proportion{
				width:31em;
				float:left;
                        margin-top:4em;

				.wihte{
					width:25em;
					height:1.5em;
					margin-top:4em;
                                line-height:1.5em;
					background:url("../assets/resouce/u54.png");
					background-size:100% 100%;
					display:inline-block;

					.blue{
                                height:1.5em;
                                line-height:1.5em;
                                width:0%;
                                background-color:#0099ff;
                                border-radius:15px;
					}
				}
                         .roleName{
                              color:#999;
                              position:relative; 
                              top:-0.1em;
                              display:inline-block;
                              width:5em;
                              overflow: hidden;
                              text-overflow:ellipsis;
                              white-space: nowrap;
                         }
				p{
					width:31em;
					text-align:center;
                            clear:both;	
				}
			}
			.sear-in{
                    			width:40%;
                   			 height:4em;
                   			 float:right;
                   			 background:url("../assets/module/u2098serch.png") no-repeat;
                   			 background-size:100% 100%;
                   			 margin-top:3em;
                   			 margin-right:2em;
                                       position:relative;
			
                   			 input{
                   			   width:82%;
                   			   height:2.5em;
                   			   margin:0.5em 1em;
                   			   background-color:#1c1f1f;                			   
                   			   border-radius:5px;
                   			   
                   			}
                                     .searbth{
                                      position:absolute;
                                      right:2em;
                                      top:0.5em;
                                      height:2.5em;
                                      line-height:2.5em;
                                      width:10%;
                                      background-image:url("../assets/module/u2100.png");
                                      background-size:50%;
                                      background-repeat:no-repeat;
                                      background-position:left center;
                                      text-align:right;
                                      cursor:pointer;
                                     }
               		 }
		}
		.bottom{
			width:100%;
			overflow:hidden;
			position:relative;

			.collect{
                     background:url("../assets/resouce/u68.png") no-repeat center;
                     background-size:80%;
                	 }
                 .collect-inner{
                     background:url("../assets/resouce/u186.png") no-repeat center;
                     background-size:80%;
                 }
                 .common{
                     background:url("../assets/resouce/u72.png") no-repeat center;
                     background-size:80%;
                 	}
                 	.common-green{
                     background:url("../assets/resouce/u3852.png") no-repeat center;
                     background-size:80%;
                 	}
                 .DOC{
                     background:url("../assets/module/u1801.png") no-repeat center;
                     background-size:60%;
                 }
                 .PPT{
                     background:url("../assets/module/u1807.png") no-repeat center;
                     background-size:60%;
                 }
                 .PDF{
                     background:url("../assets/module/u1805.png") no-repeat center;
                     background-size:60%;
                 }
                 .AI{
                         background:url("../assets/module/u1813.png") no-repeat center;
                         background-size:60%;
                 }
                 .TXT{
                         background:url("../assets/module/u1815.png") no-repeat center;
                         background-size:60%;
                 }
                 .EPS{
                         background:url("../assets/module/u1825.png") no-repeat center;
                         background-size:60%;
                 }
                 .EXC{
                        background:url("../assets/module/u188.png") no-repeat center;
                        background-size:60%;
                 }
                 .audio{
                      background:url("../assets/module/u35.png") no-repeat center;
                      background-size:55%;
                 }
                 .video-cotinue{
                      background:url("../assets/resouce/a002.png") no-repeat center;
                      background-size:100%;
                 }
                 .video-suspended{
                      background:url("../assets/resouce/a005.png") no-repeat center;
                      background-size:100%;
                 }
                 .video-stop{
                      background:url("../assets/resouce/a004.png") no-repeat center;
                      background-size:100%;
                 }
                 .video-audit{
                      background:url("../assets/resouce/a003.png") no-repeat center;
                      background-size:100%;
                 }
                 .video-transcoding{
                      background:url("../assets/resouce/a006.png") no-repeat center;
                      background-size:100%;
                 }
                 .transcoding-stop{
                      background:url("../assets/resouce/a007.png") no-repeat center;
                      background-size:100%;
                 }
                 .transcoding-fail{
                      background:url("../assets/resouce/a021.png") no-repeat center;
                      background-size:100%;
                 }
                 .up-fail{
                      background:url("../assets/resouce/a025.png") no-repeat center;
                      background-size:100%;
                 }
                 .audio-cotinue{
                      background:url("../assets/resouce/a016.png") no-repeat center;
                      background-size:100%;
                 }
                 .audio-suspended{
                      background:url("../assets/resouce/a019.png") no-repeat center;
                      background-size:100%;
                 }
                 .audio-stop{
                      background:url("../assets/resouce/a018.png") no-repeat center;
                      background-size:100%;
                 }
                 .audio-audit{
                      background:url("../assets/resouce/a017.png") no-repeat center;
                      background-size:100%;
                 }
                 .audit-fail{
                      background:url("../assets/resouce/a001.png") no-repeat center;
                      background-size:100%;
                 }
                 .pic-cotinue{
                      background:url("../assets/resouce/a008.png") no-repeat center;
                      background-size:100%;
                 }
                 .pic-suspended{
                      background:url("../assets/resouce/a011.png") no-repeat center;
                      background-size:100%;
                 }
                 .pic-stop{
                      background:url("../assets/resouce/a012.png") no-repeat center;
                      background-size:100%;
                 }
                 .word-cotinue{
                      background:url("../assets/resouce/a013.png") no-repeat center;
                      background-size:100%;
                 }
                 .word-suspended{
                      background:url("../assets/resouce/a015.png") no-repeat center;
                      background-size:100%;
                 }
                 .word-stop{
                      background:url("../assets/resouce/a014.png") no-repeat center;
                      background-size:100%;
                 }
                 .other{
                    background:url("../assets/module/u189.png") no-repeat center;
                    background-size:60%;
                 }
                 .voice{
                        background:url("../assets/module/u35.png") no-repeat center;
                        background-size:50%;
                 }
                 .collect-s{
                     background:url("../assets/resouce/u68.png") no-repeat left center;
                     background-size:100%;
                 }
                 .collect-inner-s{
                     background:url("../assets/resouce/u186.png") no-repeat left center;
                     background-size:100%;
                 }
                 .common-s{
                     background:url("../assets/resouce/u72.png") no-repeat left center;
                     background-size:100%;
                 }
                 .doc-s{
                     background:url("../assets/module/u1801.png") no-repeat left center;
                     background-size:80%;
                 }
                 .ppt-s{
                     background:url("../assets/module/u1807.png") no-repeat left center;
                     background-size:80%;
                 }
                 .pdf-s{
                     background:url("../assets/module/u1805.png") no-repeat left center;
                     background-size:80%;
                 }
                 .ai-s{
                         background:url("../assets/module/u1813.png") no-repeat left center;
                         background-size:80%;
                 }
                 .txt-s{
                         background:url("../assets/module/u1815.png") no-repeat left center;
                         background-size:80%;
                 }
                 .eps-s{
                      background:url("../assets/module/u1825.png") no-repeat left center;
                      background-size:80%;
                 }
                 .exc-s{
                      background:url("../assets/module/u188.png") no-repeat left center;
                      background-size:80%;
                 }
                 .other-s{
                    background:url("../assets/module/u189.png") no-repeat left center;
                       background-size:100%;
                 }
                .blue-s{
                 	background:url("../assets/resouce/u639.png") no-repeat left center;
                       background-size:100%;
                 }
                .voice-s{
                	     background:url("../assets/resouce/u6381.png") no-repeat left center;
                      background-size:100%;
                }
                .photo-s{
                	     background:url("../assets/resouce/u63811.png") no-repeat left center;
                      background-size:100%;
                }
                .word-s{
                   	background:url("../assets/resouce/u63812.png") no-repeat left center;
                       background-size:100%;
                 }
			.blue{
                      background-color:#0099ff;
                 }
                 .blue-none{
                      background-color:#666666;
                }
                 .choseSure{
                      position:absolute;
                      top:0;
                      left:0;
                      width:100%;
                      height:100%;
                      background:url("../assets/resouce/sure.png") no-repeat center center;
                       background-size:30%;
                 }
                 .up{
                      background-image:url("../assets/resouce/u273.png");
                      background-size:30%;
                      padding-left:3em;
                 }
                .new{
                        background-image:url("../assets/resouce/u275.png");
                        background-repeat:no-repeat;
                        background-size:20%;
                        padding-left:3em;
                 }
                 .move{
                        background-image:url("../assets/resouce/u281.png");
                        background-size:23%;
                        padding-left:2em;
                  }
                .down{
                        background-image:url("../assets/resouce/u287.png");
                        background-size:30%;
                        padding-left:2em;
                  }
                  .share{
                        background-image:url("../assets/resouce/u291.png");
                        background-size:23%;
                        padding-left:2em;
                  }
                  .res-copy{
                         background-image:url("../assets/videoPlay/u508.png");
                	       background-size:20%;
                	       padding-left:2em;
                  }
                  .del{
                        background-image:url("../assets/videoPlay/u148.png");
                	       background-size:20%;
                	       padding-left:2em;
                  }
                  .onplay{
                  	background-image:url("../assets/resouce/u402.png");
                      	background-size:20%;
                      	padding-left:2em;
                  }
                  .onlook{
                  	background-image:url("../assets/resouce/u2014.png");
                      	background-size:25%;
                      	padding-left:2em;
                  }
                  .own{
                  	background-image:url("../assets/resouce/u414.png");
                      	background-size:16%;
                      	padding-left:2em;
                  }
                  .new-pic{
                  	background-image:url("../assets/resouce/u1937.png");
                      	background-size:20%;
                      	padding-left:2em;
                  }
                  .open{
                  	background-image:url("../assets/resouce/u420.png");
                      	background-size:20%;
                      	padding-left:2em;
                  }
                  .collect-video{
                      background:url("../assets/resouce/u597.png") no-repeat left center;
                      background-size:21%;
                  }
                  .compositing{
                      background:url("../assets/resouce/u620.png") no-repeat left center;
                      background-size:21%;
                  }
                  .up-sone{
                  	background:url("../assets/resouce/u1767.png") no-repeat left center;
                      background-size:21%;
                      padding-left:2em !important;
                      text-align:left;

                  }
                  .up-smore{
                  	background:url("../assets/resouce/u1771.png") no-repeat left center;
                      background-size:21%;
                      padding-left:2em !important;
                      text-align:left;

                  }
                  .doc-copy{
                 	background:url("../assets/resouce/u2208.png") no-repeat left center;
                      background-size:21%;
                      padding-left:2em !important;
                      text-align:left;
                 }
                  .open-s{
                  	background:url("../assets/resouce/u607.png") no-repeat left center;
                      background-size:35%;
                  }
                  .own-s{
                  	background:url("../assets/resouce/u603.png") no-repeat left center;
                      background-size:35%;
                  }
                  .up-s{
                  	background:url("../assets/resouce/u585.png") no-repeat left center;
                      background-size:21%;
                  }
                .submit{
                      padding-left:2em;
                      display:inline-block;
                      background:url("../assets/resouce/u100.png") no-repeat left center;
                      background-size:50%;
                      cursor:pointer;
                      margin-right:2em;
                }
                .eidt{
                       padding-left:2em;
                       display:inline-block;
                       background:url("../assets/videoPlay/u146.png") no-repeat left center;
                       background-size:42%;
                       cursor:pointer;
                       margin-right:1em;
                }   
                .compos-btn{
                      padding-left:2em;
                      display:inline-block;
                      background:url("../assets/resouce/u6201.png") no-repeat left center;
                      background-size:42%;
                      cursor:pointer;
                      margin-right:1em;
                } 
                .play-btn{
                      padding-left:2em;
                      display:inline-block;
                      background:url("../assets/videoPlay/u79.png") no-repeat left center;
                      background-size:20%;
                      cursor:pointer;
                      margin-right:1em;
                } 
                .clip-btn{
                      padding-left:2em;
                      display:inline-block;
                      background:url("../assets/module/u2196.png") no-repeat left center;
                      background-size:28%;
                      cursor:pointer;
                      margin-right:1em;
                }  
                .td-del{
                      padding-left:1.5em;
                      display:inline-block;
                      background:url("../assets/videoPlay/u148.png") no-repeat left center;
                      background-size:32%;
                      cursor:pointer;
                }
                .excel{
                     width:100%;
                     margin-top:0.5em;
                     max-height:50em;
                     overflow-y:auto;
                     table{
                         width:100%;
                         text-align:center;
                         label{
                          font-weight:400;
                         }
                         tr{
                             height:2em;
                             line-height:2em;
                             border-top:1px solid #313030;
                             th{
                                 color:#0099ff;
                                 font-size:1.3em;
                                 font-weight:normal;
                                 text-align:center;
                                 background-color:#242424;
                                 }
                                 th:first-child,td:first-child{
                                     text-align:left;
                                     padding-left:4px;
                                     box-sizing:border-box;
                                  } 
      
                                 td{
                                     overflow: hidden;
                                     text-overflow:ellipsis;
                                     white-space: nowrap;
      
                                     	input{
                                     		position:relative;
                                     		top:0;
                                     		left:0em;
                                     	}
      
                                     	.img-s{
                                                display:inline-block;
                                                position:relative;
                                                top:0.5em;
                                                width:2em;
                                                height:2em;
                                                margin:0 1em;
                                        }
                                        .text{
                                                display:inline-block;
                                                width:50%;
                                                overflow: hidden;
                                                text-overflow:ellipsis;
                                                white-space: nowrap;
                                                position:relative;
                                                top:0.5em;
                                        }     
                                 }                                                                
                         }      
                         tr:nth-child(2n){
                             background-color:#242424;
                         }
                         tr:nth-child(2n+1){
                             background-color:#1c1b1b;
                         }
                     }
                }
		}
	}
      .Audiotip{
                    width:3em;
                    height:3em;
                    float:left;
                    position:relative;
                    top:-0.55em;
                }
      .addTip{
                    float:left;
                    width:auto;
                    padding:0.3em 0.5em;
                    background-color:#0099ff;
                    margin-right:10px;

                    span{
                        margin-left:1.5em;
                        margin-right:0 !important;
                        font-weight:700;
                        cursor:pointer;
                    }
                }
      .upload-btn{
                         width:60em;
                         max-height:53em;
                         background:url("../assets/module/u10.png") no-repeat;
                         background-size:100% 100%;
                         position:fixed;
                         z-index:10;
                         top:50%;
                         margin-top:-23em;
                         left:50%;
                         margin-left:-30em;
                         padding:0.1em 0.5em 2em;

                         .title-top{
                              width:95%;
                              margin: 0 auto;
                              height:5em;
                              line-height:4em;
                              border-bottom:1px dashed #fff;

                              p{
                                float:left;
                                font-size:1.3em;
                                line-height:4em;
                              }
                              .red-close{
                                position:absolute;
                                width:3em;
                                height:3em;
                                top:1em; 
                                right:1em;
                                cursor:pointer;
                                background:url("../assets/resouce/u1153.png") no-repeat center;
                                background-size:100%;
                              }

                         }                                             
                       em{
                             font-style:normal;
                         }
                        
                        .content{
                             width:100%;
                             padding:2em 4em;
                             overflow-y:auto;
                             overflow-x:hidden;
                             max-height:40em;
                             box-sizing:border-box;
                             color:#fff;
                             .add-tip{
                                background:none;
                                margin-left:-21em;
                                 input[type="text"]{
                                        width:8em !important;
                                        border:1px solid #fff;
                                        border-radius:3px;
                                        height:2em;
                                 }

                                 a{
                                        height:2em;
                                        line-height:3em;
                                        top:0;
                                 }
                             }

                             .item{
                                 width:100%;
                                 clear:both;
                                 .span-name{
                                     margin-right:3em;
                                     display:inline-block;
                                     width:15%;
                                     text-align:right;
                                 }

                                 a{
                                        display:inline-block;
                                        width:3em;
                                        height:3em;
                                        position:relative;
                                        top:1em;
                                        text-decoration: none;
                                        overflow:hidden;
                                        input{
                                            position: absolute;
                                            height:30px;
                                            right: 0;
                                            top: 0;
                                            opacity:0;
                                            cursor:pointer;
                                        }
                                 }
                                 .blue-add{
                                        background:url("../assets/resouce/uadd.png") no-repeat center;
                                        background-size:80%;
                                 }
                                 .gray-add{
                                        background:url("../assets/resouce/uadd1.png") no-repeat center;
                                        background-size:80%;
                                 }

                                 select{
                                        width:10em;
                                        height:2em;
                                        color:#333;
                                 }
                                textarea{
                                         background:none;
                                         border-radius:3px;
                                         border:1px solid #4e4e4e;
                                         resize:none;
                                }
                                 input[type="text"]{
                                        width:20em;
                                        height:2em;
                                        border:1px solid #fff;
                                        border-radius:3px;
                                 }
                        
                                 label{
                                     margin-right:3em;
                                     input{
                                         position:relative;
                                         top:1px;
                                         left:-4px;
                                     }
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
                                 padding:0.5em 1em;
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
}
</style>