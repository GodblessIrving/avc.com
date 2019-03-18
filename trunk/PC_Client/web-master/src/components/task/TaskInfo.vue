<template>
  <div class="task-Info">
      	<div class="title">
    　　　 <a v-for="(m,i) in menus" @click="toggleTabs(m.component,i);" :class="{'cur':i==actived}">{{m.name}}</a>
    	</div>
            <live :is="currentView" keep-alive></live>
  </div>
</template>

<script>
import {getChildrenAuth} from  '../../scripts/auth.js' 
export default {
  name: 'task-Info',
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
	.task-Info{
		width:92%;
 		float:left;
 		margin-left:1.5%;
 		height:83em;
 		background:url("../../assets/module/u10.png") no-repeat;
 		background-size:100% 100%;
 		margin-top:6px;
 		box-sizing:border-box;
 		padding:2.5% 1.5%;
 		color:#fff;

 		.title{
            			height:3em;
            			line-height:2.3em;
            			padding-left:3em;
            			font-size:1.4em;
            			border-bottom:1px dashed #fff;

            				a{
                				color:#fff;
                				display:inline-block;
                				margin-right:5em;
                				text-decoration: none;
                				width:8em;
                				height:2.5em;
                				text-align:center;
                				cursor:pointer;
            				}
             			.cur{
                				border-bottom:2px solid #0099ff;
                				color:#0099ff;
             			}
        		}
                        .excel{
                width:100%;
                margin-top:1.5em;

                table{
                    width:100%;
                    text-align:center;
                    tr{
                        height:3em;
                        line-height:3em;
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

                                a{
                                    text-decoration: none;
                                    color:#fff;
                                    display:inline-block;
                                    width:3em;
                                    height:1.7em;
                                    line-height:1.7em;
                                    background-color:#0099ff;
                                }
                            }
                            td:last-child{
                                text-align:right;
                                padding-right:5px;

                                a{
                                    text-align:center;
                                }
                            }

                            .red{
                                color:red;
                            }
                            .green{
                                color:#00ff00;
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

</style>