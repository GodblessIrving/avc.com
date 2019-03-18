<template>
	<div class="data-view">
		<!-- <slide-nav></slide-nav> -->
		<div class="data-right">
			<div class="title">
                                            <a v-for="(m,i) in menus" @click="toggleTabs(m.component,i);" :class="{'cur':i==actived}">{{m.name}}</a>
    　　			 </div>
           			<live :is="currentView" keep-alive></live>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
// import SlideNav from "../components/SlideNav"
import {getChildrenAuth} from  '../scripts/auth.js' 
export default{
	data () {
        	   return {
                actived:0
        	   };
        	},
	methods: {
         	   toggleTabs (com,num) {
                this.currentView=com;
                this.actived=num;
         	   }
         	},
         	computed:{
            menus:function(){
                return getChildrenAuth(this.$route.path);
            },
            currentView:{
                  get:function(){
                    return this.menus[this.actived].component;
                  },
                  set:function(inx){
                    this.actived=inx;
                  }
            }
         }
}
	
</script>
<style lang="scss">
	.data-view{
		width:100%;
		overflow:hidden;
      		height:85em;
		position:relative;
                        top:-85em;
                        left:5%;
		.data-right{
			height:83em;
        			width:92.5%;
        			float:left;
        			background:url("../assets/module/u10.png") no-repeat;
        			background-size:100% 100%;
        			position:absolute;
        			left:1.5%;
        			top:0;
        			padding:2em;
        			box-sizing:border-box;
        			.title{
     			     height:3em;
     			     line-height:2.3em;
     			     padding-left:3em;
     			     font-size:1.4em;
     			     border-bottom:1px dashed #525252;

     			     a{
     			         color:#fff;
     			         display:inline-block;
     			         margin-right:5em;
     			         text-decoration: none;
     			         padding:0 2em;
     			         height:2.5em;
     			         text-align:center;
     			         cursor:pointer;
     			     }
     			      .cur{
     			         border-bottom:2px solid #0099ff;
     			         color:#0099ff;
     			      }
     			 }
		}
	}	
</style>