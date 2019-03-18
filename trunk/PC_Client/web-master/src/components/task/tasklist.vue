<template>
  <div class="tasklist">
      	<div class="mytask-title">
                <a v-for="(h,inx) in handles" @click="toggleTabs(inx);" :class="{'cur':inx==actived}">{{h.name}}</a>
    	</div>
       	<live :is="currentView" keep-alive></live>
  </div>
</template>

<script>
import videotask from "./videotask"
import marktask from "./marktask"
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js' 
export default {
  name: 'tasklist',
  data () {
             return {
                actived:0
             };
         },
         components: {
             videotask,
             marktask
         },
         methods: {
             toggleTabs (inx) {
              this.actived=inx;
            },
         },
         computed:{
              handles:function(){
                return getChildrenAuth('/task/tasklist');
              },
              currentView:function(){
                  var cur=this.handles[this.actived];
                  switch(cur.id){
                    case 168:
                       return videotask;
                      break;
                    case 169:
                      return marktask;
                      break;
                  }
              }
        },
}
</script>

<style lang="scss">
	.tasklist{
		width:100%;
		height:auto;
		padding:1em 2em;

		.mytask-title{
			height:4em;
			width:100%;

			a{
				display:inline-block;
				text-align:center;
				line-height:3em;
				font-size:1.4em;
				color:#fff;
				padding:0 2em;
				text-decoration: none;
				cursor:pointer
			}
			.cur{
				color:#0099ff;
				background-color:#333333;
				border-radius:5px 5px 0 0;
			}
		}
	}
</style>