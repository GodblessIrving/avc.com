<template>
  <div class="resource-content">
    <div class="search">
      <input type="text" class="search-in" placeholder="为您模糊搜索视频、音频、图片及文稿" v-model="keys">
      <a href="javascript:void(0)" class="searBtn" @click="searchRes()">搜索</a>
    </div>
    <ul class="hot">
        <li>热搜：</li>
        <li v-for="h in hotwords" :data-hot="h.hot" @click="searchHot(h.name)">{{h.name}}</li>
      </ul>
      <div class="tab">
        <ul class="typenav">
          <li style="cursor:default">
            <img src="../../assets//module/u14.png" alt="" width="30%">
          </li>
          <li v-for="(m,i) in menus" @click="toggleTabs(m.component,i)" :class="[m.path.replace('/resource/',''),{'active':i==actived}]">
            {{m.name}}
          </li>
        </ul>
      </div>
      <live :is="currentView" keep-alive :sourceList="sourceList" :classList="classList"></live>
    </div>
     
</template>

<script>
import {getChildrenAuth} from  '../../scripts/auth.js' 
export default {
  name: 'resource-content',
  data(){
    return{
      hotwords:[],
      keys:'',
      sourceList:[],
      classList:[],
      actived:0,
    }
  },
  props:["type"],
  computed:{
    menus:function(){
        return getChildrenAuth(this.$route.path);
    },
    currentView:{
        get:function(){
          if(this.actived<this.menus.length){
            return this.menus[this.actived].component;
          }
          return null;
        },
        set:function(inx){
          this.actived=inx;
        }
    }
  },
  created:function(){
    this.getHotWords(5);
    this.getClasses();
    this.getAllSource();
    this.actived = this.type?this.type:0;
  },
  methods: {
      //1获取所有分类;
      getClasses(){
         this.$http.get('Resource/GetResourceClass',{
         }).then(res=>{
             var d=$.parseJSON(res.data);
             if (d) {
                 if (d.msgid==200) {
                     this.classList=d.data;
                 }else{
                     console.log(d.msg);
                 }
             }
         }).catch(err=>{
             console.log(err);
         });
    },
      //2获取所有来源;
      getAllSource(){
              this.$http.get('/Resource/GetResourceSource'
              ).then(res=>{
                  var d=$.parseJSON(res.data);
                  if (d) {
                      if (d.msgid==200) {
                          this.sourceList=d.data;
                      }else{
                          console.log(d.msg);
                      }
                  }
              }).catch(err=>{
                  console.log(err);
              });
      },
    
      toggleTabs (com,num) {
          this.currentView=num;
      },
      getHotWords(num){
          this.$http.get('/resource/GetHotwords',{
              params:{
                  num:num,
              }
          }).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                  if (d.msgid==200) {
                      this.hotwords=d.data;
                  }else{
                      console.log(d.msg);
                  }
              }
          }).catch(err=>{
              console.log(err);
          });
      },
      // 热搜词
      searchHot(val){
          this.keys = val;
          this.searchRes();
      },
      searchRes(){
          this.$router.push({'path':'/resource/search',query:{'keys':this.keys} });
      },
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1440px){
  .show-content .el-pagination .btn-next, .show-content .el-pagination .btn-prev{
      padding:0 !important;
    }
  .show-content .show ul li div .img{
    height:7em !important;
  }
  .show-content .el-pagination{
      bottom:5em !important;
  }
  .resource-content .show-content .show ul li{
    margin-bottom:1em !important;
  }
}
@media screen and (max-width: 1366px){
    .resource-content .show-content .show-text ul li .more{
      width:63em !important;
    }
}
  .resource-content{
    float:left;
    width:65%;
    height:83em;
    background:url("../../assets//module/u10.png") no-repeat;
    background-size:100% 100%;
    margin-left:1.5%;
    margin-top:6px;
    text-align:center;
    .show-content .el-pagination .btn-next, .show-content .el-pagination .btn-prev{
      padding:0 1em;
    }
    .show-content{
      position:relative; 
      height:84%;
    .show-text{
            width:95%;
            margin:0 auto;
            .cur{
                  color:#0099ff;
                }
                p{
                float:left;
                width:7%;
                margin-bottom:8px;
              }

              ul{
                float:left;
                width:93%;
                margin-bottom:8px;

                li{
                  float:left;
                  margin-right:1.5%;
                  text-align:center;
                  cursor:pointer;
                  width:8%;
                  .more{
                    position:absolute;
                    right:0;
                    height:auto;
                    padding:0.7em 1em;
                    width:65.5em;
                    z-index:5;
                    background:#333b44;
                    border-radius:3px;
                    display:none;
                    overflow:hidden;

                    span{
                      margin-right:4%;
                      float:left;
                    }
                  }
                }
                .lis{
                    overflow:hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
              }
            div{
              width:100%;
              height:2.6em;
              background:#242424;
              margin-top:0.5em;
              box-sizing:border-box;
              line-height:2.55em;
              font-size:1em;
            }
            .object{
              margin-top:0;
            }
            .order{
              li{
                width:auto;
                margin-left:2.5%;
              }
            }
      }
  .show{
    overflow:hidden;
    background:none;
    clear:both;
    ul{width:95%;
        margin:0 auto;
    li{
      float:left;
      width:19.28%;
      height:12em;
      margin-right:0.7%;
      text-align:center;

      div{
        height:10.5em;
        background:url("../../assets/module/u176.png");
        background-size:100% 100%;
        padding:4%;
        margin-bottom:0.5em;
        box-sizing:border-box;
        overflow:hidden;
        
     .img{
              width:100%;
              height:7.5em;
              overflow:hidden;
              margin-bottom:0;
              margin-top:-0.3em;
      }   

        p{
          width:100%;
          font-size:0.9em;
          text-align:left;
          line-height:2em;
          height:2em;
          box-sizing:border-box;
          padding:1.5%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      span{
        position:relative;
        top:-1.2em;
        width:5em;
        display:inline-block;
        left:-0.5em;
        cursor:pointer;
      }
      .watch{
        background:url("../../assets/module/u224.png") no-repeat left center;
        background-size:21%;
        left:-1.3em;
      }
      .good{
        background:url("../../assets/module/u228.png") no-repeat left center;
        background-size:21%;
      }
    }
  }
}
}

    .search{
      margin-top:40px;
      height:60px;
      width:55%;
      display:inline-block;
      background:url("../../assets//module/u2098serch.png") no-repeat;
      background-size:100% 100%;

      .search-in{
        float:left;
        width:77%;
        background:#1c1f1f;
        height:33px;
        border-radius:5px;
        margin-top:11px;
        margin-left:2.5%;
        padding-left:2%;
        color:#fff;
        }

        .searBtn{
          margin-top:10px;
          width:20%;
          height:33px;
          float:left;
          line-height:33px;
          font-size:1.2em;
          background:url("../../assets//module/u2100.png") no-repeat 10%;
          background-size:30%;
          padding-left:2%;
      }
    }
     .hot{
        width:55%;
        margin:0 auto;
        overflow:hidden;
        color:#fff;
        height:2em;
        
        li{
        float:left;
        margin-right:5%;
        font-size:1.1em;
        cursor:pointer;
       }

        li:first-child{
          color:#0099ff;
          margin-right:2%;
          margin-left:1%;
        }
       
      }
      .tab{
        width:102%;
        height:4em;
        background:url("../../assets//module/u12.png") no-repeat;
        background-size:100% 100%;
        margin-left:-1%;
        margin-top:1em;
        color:#fff;

        .typenav{
          width:100%;
          height:4em;

           li{
            float:left;
            width:12%;
            height:2.5em;
            text-align:center;
            line-height:2.5em;
            font-size:1.1em;
            margin-top:0.4em;
            cursor:pointer;
          }
          li:first-child{
            width:8em;
          }
          .active{
              background-color:#127dc3;
            }
          .video{
            background-image:url("../../assets//module/u21.png");
            background-repeat:no-repeat;
            background-position:0.8em center;
            background-size:20%;
          }
          .audio{
              background-image:url("../../assets/module/u35.png");
              background-repeat:no-repeat;
              background-position:0.8em center;
              background-size:23%;
            }
            .picture{
              background-image:url("../../assets//module/u37.png");
              background-repeat:no-repeat;
              background-position:0.8em center;
              background-size:23%;
            }
            .draft{
              background-image:url("../../assets//module/u39.png");
              background-repeat:no-repeat;
              background-position:0.8em center;
              background-size:23%;
            }
            .topic{
              background-image:url("../../assets//module/u45.png");
              background-repeat:no-repeat;
              background-position:0.8em center;
              background-size:20%;
            }
        }
      }
  }

</style>
