<template>
  <div class="video-mark">
      <p class="myMark">我的标注</p>
      <div class="myinfo">
      	<ul>
      		<li @click="getMymark" style="cursor:pointer">
      			<div v-if="mark.mypic" class="avatar" v-bind:style = " { 'background-image' : 'url('+mark.mypic+')'} ">
      				<!-- <img v-if="mark.mypic" :src="mark.mypic" alt="" width="100%">
                              <img v-else src="../../assets/setUser/u404.png"  width="100%" alt=""> -->
      			</div>
                      <div v-else class="avatar"></div>
      		</li>
      		<li>
      			<p style="margin-top:1em;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="mark.myname">{{mark.myname}}</p>
      			<p><span style="color:red">{{markcount}}</span>处标注</p>
      		</li>
      		<li>
      			<p style="line-height:5em;" :class="[stutas == '审核通过'?'green':(stutas=='审核失败'?'red':stutas=='审核中'?'orange':'')]">{{stutas}}</p>
      		</li>
      	</ul>
      </div>
      <div class="botn">
      	<span @click="subMark($event)" :class='[submit==0?"gray":"blue"]' v-if="stutas != '审核中'">提交</span>
      	<span @click="delmark($event)" :class='[empty==0?"gray":"blue"]'  v-if="stutas != '审核中'">清空</span>
      </div>
      <p class="myMark" style="margin-top:0px; margin-bottom:0.6em;">其他标注</p>
      <p class="sear">
            <input type="text" placeholder="搜素对该视频标注的人" v-model='key'/>
            <span class='searchbtn' @click="searchMark">搜索</span>
      </p>
      <ul class="markList">
        <li v-for="(m,index) in mark.othermark" :value="m.uid" class="lis" v-if="m.uid!=uid">
            <div class="avatar" v-if="m.pic" v-bind:style = " { 'background-image' : 'url('+m.pic+')'} " @click="checkMark(m.uid)">
            </div>
            <div class="avatar" v-else @click="checkMark(m.uid)"></div>
            <p class="name">{{m.realname}}</p>
            <p><span>{{m.count}}</span>处标注</p>
            <p v-if="stutas != '审核中'" style="width:2em; cursor:pointer; margin-left:2em;" @click="copymark(index)">
                <img src="../../assets/videoPlay/u508.png" alt="" width="80%">
            </p>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'video-mark',
  data(){
    return{
      othermark:{},
      key:'',
      dfPhoto:'this.src="'+require('../../assets/setUser/u404.png')+'"',
      otherId:'',
      iscommon:false,
      mess:'',
      oncemark:0,
    }
  },
  props:['mark','total','stutas','markcount','submit',"empty","uid","addmark"],
  methods:{
    subMark(e){
      var dom = e.currentTarget;
      if($(dom).hasClass('gray')){
        return;
      }
      this.$emit('subNewEvent');
    },
    delmark(e){
      var dom = e.currentTarget;
      if($(dom).hasClass('gray')){
        return;
      }
      this.$emit('delNewEvent');
    },
    copymark(inx){
      this.othermark = this.mark.othermark[inx];
      this.$emit('copyNewEvent',this.othermark);
      $(".lis").removeClass('bgCur');
      $(".myinfo").css("background-color","#264559");
    },
    searchMark(){
        this.$emit('searchNewEvent',this.key);
    },
    checkMark(uid){
       this.otherId = uid;
        $(".lis[value='"+uid+"']").addClass('bgCur').siblings().removeClass('bgCur');
        $(".myinfo").css("background","none")
        this.$emit('preViewNewEvent',this.otherId); 
    },
    getMymark(){
      this.oncemark = 0;
      $(".lis").removeClass('bgCur');
      this.$emit('previewMymark');
      $(".myinfo").css("background-color","#264559")
    },
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1366px) {
  .video-mark .markList  li p{
    margin-left:0 !important;
  }
  .video-mark .sear .searchbtn{
    background-size:33% !important;
    padding-left:12% !important;
    width:30% !important;
  }
  .video-mark .sear input{
    width:66% !important;
  }
}
	.video-mark{
		width:29%;
		float:left;
		background:url("../../assets/module/u10.png") no-repeat;
		background-size:100% 100%;
            .red{
              color:red;
            }
            .bgCur{
              background-color:#264559;
            }
            .green{
              color:green;
            }
            .orange{
              color:orange;
            }
		.myMark{
			color:#0099ff;
			width:85%;
			font-size:1.1em;
			margin:1.3em auto;
			border-left:3px solid #0099ff;
			padding-left:1em;
		}
		.myinfo{
			width:100%;
			height:5em;
			background-color:#264559;
			padding-left:1em;

			ul{
				width:100%;
				height:5em;
				li{
					float:left;
					width:30%;
					height:5em;
					color:#fff;
                              .avatar{
                                width:4em; 
                                height:4em; 
                                border-radius:50%; 
                                overflow:hidden; 
                                margin-top:0.5em;
                                background-size:cover;
                                background-repeat:no-repeat;
                                background-position:center center;
                                background-image:url('../../assets/setUser/u404.png');
                              }
					p{
						line-height:1em;
					}
				}
			}
		}
		.botn{
			width:100%;
			height:2.4em;
			color:#fff;
			margin-top:1em;
			clear:both;
			padding-left:1em;
                    
                  .gray{
                    background-color:#666;
                  }
                  .blue{
                     background-color:#0099ff;
                  }
			span{
				float:left;
				width:2.4em;
				height:1.5em;
			      background-color:#0099ff;
				line-height:1.5em;
				margin-right:1em;
				text-align:center;
				cursor:pointer;
                          color:#fff;
			}
		}
		.sear{
			width:96%;
			height:3em;
			background:url("../../assets/module/u2098serch.png") no-repeat;
			background-size:100% 100%;
			margin: 0 auto;
                  position:relative;

                   input{
                      float:left;
                       width:75%;
                       background:#1c1f1f;
                       height:1.9em;
                       border-radius:5px;
                       margin:0;
                       margin-top:2%;
                       margin-left:2.5%;
                       padding-left:2%;
                       color:#fff;
                   }
                  .searchbtn{
                    margin-top:2%;
                    width:20%;
                    height:2em;
                    float:left;
                    line-height:2em;
                    font-size:1em;
                    background:url("../../assets/module/u2100.png") no-repeat 15%;
                    background-size:36%;
                    padding-left:9%;
                    font-size:1em;
                    color:#0099ff;
                    cursor:pointer;
          }
		}
        .markList{
            width:100%;
            height:auto;
            color:#fff;
            padding:2%;
            box-sizing:border-box;
            max-height:20em;
            overflow-y:auto;

            li{
                height:5em;
                padding-left:1em;
                padding-top:0.5em;
                .avatar{
                  float:left;
                  width:4em; 
                  height:4em; 
                  border-radius:50%; 
                  cursor:pointer; 
                  overflow:hidden;
                  background-size:cover;
                  background-repeat:no-repeat;
                  background-position:center center;
                  background-image:url("../../assets/setUser/u404.png")
                }

                p{
                float:left;
                height:4em;
                line-height:4em;
                margin-left:1em;

                span{
                color:red;
                }
                }
                .name{
                margin-left:0.3em;
                width:22%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                }
            }
        }
	}

</style>
