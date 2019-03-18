<template>
    <div class="system-info">
    　　　　<ul class="slide">
                          <li v-for="(m,i) in menus" @click="toggleTabs(m.component,i);" :class="[m.path.replace('/system/',''),{'active':i==actived}]" class="lis">{{m.name}}</li>
    　　　　  </ul>
　　　　　<live :is="currentView" keep-alive @saveEnable="listen"></live>
　　    </div>
</template>

<script  type="text/ecmascript-6">
import {getChildrenAuth} from  '../../scripts/auth.js' 
export default {
        name:"system-info",
        data () {
             return {
                actived:0
             };
         },
         methods: {
             toggleTabs (com,num) {
                this.currentView=com;
                this.actived=num;
             },
             listen(){
                this.$emit('saveEnable');
             },
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
   .system-info{
    width:16%;
    float:left;
    color:#fff;
    height:83em;
    background:url("../../assets/module/u10.png") no-repeat;
    background-size:100% 100%;
    margin-left:1.5%;
    padding:3em 0.2em 0;                
    .lis{
        height:5em;
        line-height:5em;
        padding-left:40%;
        font-size:1.3em;
        cursor:pointer;
    }
        .el-pagination{
            position:absolute;
            bottom:5em;
            width:100%;
            text-align:center;
        }
    .active{
        background-color:#5a5a5a;
    }
    .logo{
        background-image:url("../../assets/system/u53.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .livemanager{
        background-image:url("../../assets/live/u91.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .datamanager{
        background-image:url("../../assets/system/u73.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:12%;
    }
    .hot{
        background-image:url("../../assets/system/u75.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .transcoding{
        background-image:url("../../assets/system/u77.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .scan{
        background-image:url("../../assets/system/u87.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .user{
        background-image:url("../../assets/system/u79.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .role{
        background-image:url("../../assets/system/u81.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .log{
        background-image:url("../../assets/system/u85.png");
        background-repeat:no-repeat;
        background-position:3em center;
        background-size:13%;
    }
    .sear{
            width:35%;
            height:4em;
            float:right;
            background:url("../../assets/module/u2098serch.png") no-repeat;
            background-size:100% 100%;
            margin:0 auto;
            input{
              float:left;
               width:75%;
               background:#1c1f1f;
               height:2.4em;
               border-radius:5px;
               margin:0;
               margin-top:2%;
               margin-left:2.5%;
               padding-left:2%;
           }
          .searchbtn{
            margin-top:2%;
            width:20%;
            height:2.4em;
            float:left;
            line-height:2.4em;
            font-size:1.2em;
            background:url("../../assets/module/u2100.png") no-repeat 15%;
            background-size:40%;
            padding-left:10%;
            font-size:1em;
            color:#0099ff;
            cursor:pointer;
          }
    }
    .excel{
                width:100%;
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
                                padding-left:10px;
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
                                    text-align:center;
                                    background-color:#0099ff;
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