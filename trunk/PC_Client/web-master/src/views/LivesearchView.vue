<template>
  <div class="livesearch-view">
    <!-- <slide-nav></slide-nav> -->
    <div class="search-view-right">
    <div class="search">
      <input type="text" class="search-in" placeholder="为您模糊搜索直播频道、直播课程..." v-model="key">
      <a href="javascript:void(0)" class="searBtn" @click="search()">搜索</a>
    </div>
      <div class="res-type">
        <ul>
          <li class="cur">全部</li>
          <li>
            <label for="input1">
              <input type="checkbox" id="input1" value="1" v-model="status">直播中
            </label>
          </li>
          <li>
            <label for="input2">
              <input type="checkbox" id="input2" value="2" v-model="status">即将播出
            </label>
          </li>
          <li>
            <label for="input3">
              <input type="checkbox" id="input3" value="3" v-model="status">直播频道
            </label>
          </li>
          <li>
            <label for="input4">
              <input type="checkbox" id="input4" value="4" v-model="status">直播课程
            </label>
          </li>
        </ul>
      </div>
      <div class="show-view">
        <ul>
          <li v-for="c in channel">
            <div class="list-top" @click="goTodetail(c)">
              <img  :src= "c.pic?c.pic:path" width="100%" alt="">
              <div class="text">
                <h4 class="title" :title="c.position">{{c.position}}</h4>
              </div>
              <p class="live-time">
                <span class="left" :title="c.name" v-html="c.newname"></span>
                <span class="right">{{c.stime}}</span>
              </p>
            </div>
            <p class="live-state">
              <span class="left">直播频道</span>
              <span class="right" :class="[c.status==1?'green':'']">{{c.status==1?'直播中':'即将播出'}}</span>
            </p>
          </li>
          <!-- <li>
            <div class="list-top">
              <img src="../assets/live/u179.jpg" width="100%" alt="">
              <div class="text">
                <h4 calss="title">中国建筑史<span class="red">赏析</span></h4>
                <p>土木与工程学院</p>
                <p>
                  <span style="margin-right:1em;">李学东</span>
                  <span>副教室</span>
                </p>
              </div>
              <p class="live-time">
                <span class="left">A区<em class="red">201</em></span>
                <span class="right">08:30:00</span>
              </p>
            </div>
            <p class="live-state">
              <span class="left">直播频道</span>
              <span class="green right">直播中</span>
            </p>
          </li> -->
        </ul>
      </div>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next"
          :total="count"
          v-show = "page">
      </el-pagination>
      <alert-tip :isShowtip="isShowtip"
                      :message = "message"
                      @closeTipEvent = "close()">
      </alert-tip>
  </div>
  </div>
</template>
<script>
// import SlideNav  from "../components/SlideNav.vue"
import alertTip from "../components/alertTip"
export default {
  name: 'livesearch-view',
  data(){
    return{
      key:'',
      pagesize:20,
      pageindex:1,
      currentPage:1,
      count:0,
      page:true,
      channel:[],
      status:[],
      type:0,
      isShowtip:false,
      message:'',
      path:require('../assets/live/u175.png'),
    }
  },
  watch:{
    status:function(){
      this.watchStatus();
    }
  },
  mounted:function(){
    this.key = this.$route.query.keys;
    this.getLiveinfo(this.type);
  },
  components:{alertTip},
  methods:{
    // 获取搜索匹配的直播信息
    getLiveinfo(status){
      this.$http.get('Live/GetLivechannels',{
        params:{
          pagesize:this.pagesize,
          pageindex:this.pageindex,
          key:this.key,
          status:status
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.count = d.count;
            if(this.count <= 20){
              this.page = false;
            }else{
              this.page = true;
            }
            if(d.data){
              this.channel = d.data;
              for(var i = 0; i<this.channel.length; i++){
                let item=this.channel[i];
                item.newname = this.getKeyStyle(item.name);
                item.newposition=this.getKeyStyle(item.position);
              }
            }else{
              this.isShowtip = true;
              this.message = "没有查到该信息，请重新查询";
            }                     
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    getKeyStyle(oldval){
          var html=oldval;
          var key = this.key.split(' ');
          for(var i=0;i<key.length; i++){
               var k= key[i];
               var inx=html.indexOf(k);
               if(inx>-1){
                   html=html.substring(0,inx)+'<em>'+k+'</em>'+html.substr(inx+k.length,html.length-k.length-inx);
               }
          }          
          return html;
      },
    // 搜索
    search(){
        this.watchStatus();
    },
    // 观察选择的状态
    watchStatus(){
        if(this.status.length>0){
          this.getLiveinfo(this.status.join());
        }else{
          this.getLiveinfo(0);
        }
    },
    // 关闭提示框
    close(){
      this.isShowtip = false;
    },
    // 分页
    handleCurrentChange(val) {
        this.pageindex = parseInt(val);
        this.watchStatus();
    },
    goTodetail(c){
      if(c.status != 1){
        this.isShowtip = true;
        this.message = "直播还未开始，请稍后再来…"
      }else{
         this.$router.push({path:'/live/detail',query:{id:c.id} });
      }
    },
  }
}
</script>

<style lang="scss">
@media screen and (-webkit-min-device-pixel-ratio:0){
  .livesearch-view .search-view-right .show-view ul li{
    margin-left:4em !important;
  }
}
.livesearch-view{
  width:100%;
  overflow:hidden;
  height:85em;
  color:#fff;
  position:relative;
  top:-85em;
  left:5%;
  em{
    font-style:normal;
    color:red;
  }
  h4{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .green{
    color:green;
  }
  .red{
    color:red;
  }
  .left{
    float:left;
    margin-left:5px;
  }
  .right{
    float:right;
    margin-right:5px;
  }
  .search-view-right{
    float:left;
    width:92%;
    height:83em;
    background:url("../assets/module/u10.png") no-repeat;
    background-size:100% 100%;
    margin-left:1.5%;
    margin-top:6px;
    text-align:center;
    position:relative;
    .el-pagination{
      position:absolute;
      width:100%;
      bottom:3em;
    }
    .el-pagination .btn-next, .el-pagination .btn-prev{
      padding:0 10px;
    }
    .search{
      margin-top:40px;
      height:60px;
      width:40%;
      display:inline-block;
      background:url("../assets/module/u2098serch.png") no-repeat;
      background-size:100% 100%;

      .search-in{
        float:left;
        width:75%;
        background:#1c1f1f;
        height:33px;
        border-radius:5px;
        margin-top:11px;
        margin-left:2.5%;
        padding-left:2%;
        }

        .searBtn{
          margin-top:10px;
          width:20%;
          height:33px;
          float:left;
          line-height:33px;
          font-size:1.2em;
          background:url("../assets/module/u2100.png") no-repeat 25%;
          background-size:30%;
          padding-left:6%;
      }
    }
      .res-type{
        width:100%;
        height:4em;
        padding:0 2em;
        margin-top:1em;

        ul{
          width:100%;
          height:4em;
          background-color:#232323;

          li{
            float:left;
            height:4em;
            line-height:3.2em;
            font-size:1.3em;
            margin:0 2em;
            cursor:pointer;

            label{
              font-weight:200;
              input{
                position:relative;
                left:-10px;
                top:2px;
              }
            }
          }
          li.cur{
            color:#0099ff;
          }
        }
      }
     .show-view{
      width:100%;
      overflow:hidden;
      padding:1.5em 2.5em;

      ul{
        width:100%;
        overflow:hidden;
        li{
          float:left;
          margin-left:3.5em;
          margin-bottom:2em;
          width:16em;
          height:13em;
          .list-top{
            width:100%;
            height:11em;
            position:relative;
            cursor:pointer;
            overflow:hidden;

            .text{
              position:absolute;
              width:100%;
              height:8em;
              top:0;
              left:0;
              padding:1em;
              text-align:left;
            }
            .live-time{
              width:100%;
              height:2em;
              line-height:2em;
              position:absolute;
              margin:0;
              bottom:0;
              left:0;
              background:rgba(#000000, 0.6);
            }
            .left{
              display:inline-block;
              width:70%;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              text-align:left;
            }
          }
          .live-state{
            width:100%;
            overflow:hidden;
            margin-top:5px;
          }
        }
      }
     }

  }
}

</style>
