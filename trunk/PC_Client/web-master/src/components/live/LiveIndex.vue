<template>
  <div class="live-index">
    <!-- <slide-nav></slide-nav> -->
    <div class="search-viewt">
    <div class="search">
      <input type="text" class="search-in" placeholder="为您模糊搜索直播频道、直播课程..." v-model="key">
      <a href="javascript:void(0)" class="searBtn" @click="GoToLive()">搜索</a>
    </div>
    <div class="title">
        <ul>
          <li>
            <img src="../../assets/module/u14.png" alt="" width="30%">
          </li>
        </ul>
    </div>
    <div class="show-view">
        <ul>
          <li v-for="c in channel">
            <div class="list-top" @click="goTodetail(c)">
              <img  :src= "c.pic?c.pic:path" width="100%" alt="">
              <div class="text">
                <h4 calss="title" :title="c.position">{{c.position}}</h4>
              </div>
              <p class="live-time">
                <span class="left" :title="c.name">{{c.name}}<em class="red"></em></span>
              </p>
            </div>
            <p class="live-state">
              <span class="left">{{c.stime}}-{{c.etime}}</span>
              <span class="right" :class="[c.status==1?'green':'']">{{c.status==1?'直播中':'即将播出'}}</span>
            </p>
          </li>
        </ul>
      </div>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="16"
          layout="prev, pager, next"
          :total="count"
          v-show = "page">
      </el-pagination>
      <alert-tip :isShowtip = "isShowtip"
                      :message="message"
                      @closeTipEvent="close()">
      </alert-tip>
  </div>
  <live-rightlist></live-rightlist>
  </div>
</template>
<script>
// import SlideNav  from "../SlideNav"
import LiveRightlist from "./LiveRightlist"
import alertTip from "../alertTip"
export default {
  name: 'live-index',
  data(){
    return{
      page:true,
      pagesize:16,
      pageindex:1,
      currentPage:1,
      key:'',
      message:'',
      isShowtip:false,
      count:0,
      channel:[],
      path:require('../../assets/live/u175.png'),
    }
  },
  components:{LiveRightlist,alertTip},
  mounted:function(){
    this.getLiveinfo();
  },
  methods:{
    // 获取所有直播信息
    getLiveinfo(){
      this.$http.get('Live/GetLivechannels',{
        params:{
          pagesize:this.pagesize,
          pageindex:this.pageindex,
          key:this.key,
          status:0
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.count = d.count;
            if(this.count <= 16){
              this.page = false;
            }else{
              this.page = true;
            }
            this.channel = d.data;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 分页
    handleCurrentChange(val) {
        this.pageindex = parseInt(val);
        this.getLiveinfo();
    },
    // 搜索
    GoToLive(){
      this.$router.push({path:'/live/search',query:{keys:this.key} });
    },
    goTodetail(c){
      this.$http.get('Live/GetLivechannelDetails',{
        params:{
          id:c.id
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d.msgid != 200){
          this.isShowtip = true;
          this.message = d.msg;  
          return
        }else{
          this.$router.push({path:'/live/detail',query:{id:c.id} });
        }
      })
    },
    close(){
      this.isShowtip = false;
    }
  }
}
</script>

<style lang="scss">
@media screen and (-webkit-min-device-pixel-ratio:0){
  .live-index .search-viewt .show-view{
    padding:1.5em 2em 1.5em 1.8em !important;
  }
}
@media screen and (max-width: 1366px){
  .live-index .search-viewt .show-view ul li{
    width:15em !important;
  }
}
.live-index{
  width:100%;
  height:85em;
  color:#fff;
  position:relative;
  // top:-85em;
  left:5%;
  em{
    font-style:normal;
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
  .search-viewt{
    float:left;
    width:62%;
    height:83em;
    background:url("../../assets/module/u10.png") no-repeat;
    background-size:100% 100%;
    margin-left:-3.5%;
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
      width:5.5em;
    }
    .search{
      margin-top:40px;
      height:60px;
      width:55%;
      display:inline-block;
      background:url("../../assets/module/u2098serch.png") no-repeat;
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
          background:url("../../assets/module/u2100.png") no-repeat 25%;
          background-size:30%;
          padding-left:6%;
      }
    }
    .title{
      width:102%;
      height:4em;
      line-height:4em;
      background:url("../../assets/module/u12.png") no-repeat;
      background-size:100% 100%;
      margin-left:-1%;
      margin-top:3em;
      ul{
        width:100%;
        height:4em;
      }
      li{
        float:left;
        width:8em;
        height:2.5em;
        text-align:center;
        line-height:2.5em;
        font-size:1.1em;
        margin-top:0.4em;
        cursor:pointer;
      }
    }     
    .show-view{
      width:100%;
      overflow:hidden;
      padding:1.5em 0;

      ul{
        width:100%;
        overflow:hidden;
        li{
          float:left;
          margin-left:1.5em;
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
              h4{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
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
              .left{
                width:100%;
                padding:0 5px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                text-align:left;
              }
            }
          }
          .live-state{
            width:100%;
          }
        }
      }
     }
  }
}

</style>
