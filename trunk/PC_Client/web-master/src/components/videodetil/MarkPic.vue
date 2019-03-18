<template>
  <div class="mark-pic">
	<a href="javascript:void(0)" class="lefts" @click="backward"></a>
	<a href="javascript:void(0)" class="right-to" @click="forward"></a>
      <div style="width:100%" class="mark-box">
      	<ul>
      	<li v-for="(m,index) in marks" v-if="marks&&marks.length>0" :data-id="m.resourcesid">
      		<div class="black-top">
      			<p>{{m.timestamp}}</p>
      			<div>
      				<span class="edit" v-if="!m.type&&stutas!='审核中'" @click="editMark(m,m.id)"></span>
      				<span class="del-btn" @click="delMark(m.id)" v-if="m.type!=10&&stutas!='审核中'" :value="index"></span>
      				<em v-show="!isText">位置一</em>
      			</div>
      			<img :src="m.frame" :onerror="errorImg" alt="" width="100%" class="frame" @click="getTimestamp(m.timestamp)">
      			<p class="title-name" v-show="!isText">中考解题技巧</p>
      		</div>
      		<p class="title" v-show="isText" :title="m.description" style="-webkit-box-orient: vertical;">{{m.description}}</p>
      	</li>
             </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: 'mark-pic',
  data(){
  	return{
  		errorImg:'this.src="'+require('../../assets/videoPlay/u8.png')+'"',
  		inx:0,
  		left:0,
  	}
  },
  props:["isText","marks","stutas"],
  computed: {
  	value() {
  	  const {marks, inx} = this
  	  return {
  	    marks,
  	    inx
  	  }
  	}
  },
  watch:{
	value: {
            handler: function(val){
            	if(val.marks.length<=6){
            		this.inx=0;
            		this.left=0;
            		$('ul').css('left',0);
            	}
            	if(val.inx > 0){
            		$('.lefts').show();
            	}else{
            		$('.lefts').hide();
            	}
            	if(val.marks.length/6-1 > val.inx){
            		$('.right-to').show();
            	}else{
            		$('.right-to').hide();
            	}
            },deep:true
      },
  },
  methods:{
  	editMark(mark,index){
  		this.$emit('edit',mark,index);
  	},
  	delMark(index){
  		this.$emit('dele',index);
  	},
  	backward(){
		var width=$('.mark-box').width();
		this.left+=width;
		$('ul').animate({left: this.left},100);
  		this.inx--;
  	},
  	forward(){
		var width=$('.mark-box').width();
		this.left-=width;
		$('ul').animate({left: this.left},100);
  		this.inx++;
  	},
  	getTimestamp(time){
  		this.$emit('getCur',time);
  	},
  },
}
</script>

<style lang="scss">
	.mark-pic{
		width:98%;
		height:25em;
		margin:0 auto;
		clear:both;
		overflow:hidden;
		position:relative;

		em{
			font-style:normal
		}
		.frame{
			cursor:pointer;			
		}

		.lefts{
			position:absolute;
			left:1.5em;
			top:25%;
			width:2em;
			height:4em;
			background-image:url("../../assets/videoPlay/right.png");
			background-repeat: no-repeat;
			background-color:rgba(#000000,0.4);
			background-position:center center;
			background-size:100% 100%;
			z-index:99;
			display:none;
		}
		.right-to{
			position:absolute;
			right:0.7em;
			top:25%;
			width:2em;
			height:4em;
			background-image:url("../../assets/videoPlay/left.png");
			background-repeat: no-repeat;
			background-color:rgba(#000000,0.4);
			background-position:center center;
			background-size:100% 100%;
			z-index:99;
			display:none;
		}
		.mark-box{
			width:100%;
			background:url("../../assets/videoPlay/u86.png") no-repeat;
			background-size:100% 100%;
		}

		ul{
			width:15000px;
			height:17em;
			position:relative;

			li{
				width:10em;
				height:25em;
				box-sizing:border-box;
				padding-top:1.5em;
				float:left;
				margin-left:1.5em;
				.black-top{
					height:16em;
					position:relative;

					p{
					color:#fff;
					width:6em;
					height:1.5em;
					margin:0 auto;
					text-align:center;
					background-color:#02070a;
					}
					div{
						height:1.5em;
						padding-left:0.3em;
						margin:0.5em 0;

						span{
							float:left;
							width:1.5em;
							height:1.5em;
							cursor:pointer;
						}
						.edit{
							background:url("../../assets/videoPlay/u146.png") no-repeat;
							background-size:100%;
						}
						.del-btn{
							background:url("../../assets/videoPlay/u148.png") no-repeat;
							background-size:79%;
							margin-left:1em;
						}

						em{
							float:right;
						}
					}
					.title-name{
						width:100%;
						background:rgba(#000000, 0.4);
						height:1.6em;
						line-height:1.6em;
						position:relative;
						top:-1.6em;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						padding:0 0.5em;
					}
				}
				.title{
					color:#fff;
					display: -webkit-box;
					overflow: hidden;  
					text-overflow: ellipsis;   
					-webkit-line-clamp: 4; height:5.6em;
					
				}

				
			}
		}
	}
</style>
