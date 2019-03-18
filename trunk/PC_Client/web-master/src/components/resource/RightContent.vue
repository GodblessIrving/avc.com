<template>
  <div class="right-content">
    <div class="attention">
      <p class="title">
        <span style="float:left; font-size:1.1em;">大家关注资源</span>
        <span style="float:right; font-size:1.1em; cursor:pointer; color:#0099ff;" @click="moreRes">更多...</span>
      </p>
      <ul>
        <li v-for="(s,i) in resourceList" @click="openResource(s.rtid,s.id,s.foid)">
          <span :class="[i<3?'order':'order1']">{{i+1}}</span>
          <span class="name" :title="s.title">{{s.title.length>40?(s.title.substr(0,40)+'...'):s.title}}</span>
          <span class="num">{{s.hot>10000?(s.hot/10000).toFixed(2)+'万':s.hot}}</span>
        </li>
      </ul>
    </div>
    <div class="thematic">
      <p class="title">
        <span style="float:left; font-size:1.1em;">精品专题</span>
        <span style="float:right; font-size:1.1em; cursor:pointer; color:#0099ff;" >更多...</span>
      </p>
      <div style="padding-top:3em;">
        <img src="../../assets/resouce/123.png" width="100%">
      </div>
      <!-- <ul>
        <li>
          <div>
            <img src="../../assets/module/u1850.png" alt="" width="100%" height="100%">
            <span class="instruction">高校名师视频锦集</span>
          </div>
          <p>关注人数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512人</p>
        </li>
        <li>
          <div>
            <img src="../../assets/module/u1850.png" alt="" width="100%" height="100%">
            <span class="instruction">高校名师视频锦集</span>
          </div>
          <p>关注人数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512人</p>
        </li>
        <li>
          <div>
            <img src="../../assets/module/u1850.png" alt="" width="100%" height="100%">
            <span class="instruction">高校名师视频锦集</span>
          </div>
          <p>关注人数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512人</p>
        </li>
      </ul> -->
    </div>
    <more-resource :isShow="show" @closeNewEvent="close" :moreList="moreList"></more-resource>
  </div>
</template>

<script>
import MoreResource from "./MoreResource"
export default {
  name: 'right-content',
  data(){
    return {
      resourceList:[],
      moreList:[],
      moveRes:0,
      show:false,
    }
  },
  components: {MoreResource},
  mounted:function(){
    this.getSource(5);
  },
  methods:{
          getSource(num){
              this.$http.get('/Resource/GetEverybodyCares',{
                    params:{
                        num:num
                    }
              }).then(res=>{
                  var d=$.parseJSON(res.data);
                  if (d) {
                      if (d.msgid==200) {
                            if(num==5){
                              this.resourceList=d.data;
                            }else{
                              this.moreList=d.data;
                            }
                      }else{
                          console.log(d.msg);
                      }
                  }
              }).catch(err=>{
                  console.log(err);
              });
      },
      moreRes(){
        this.getSource(50);
        this.show = true;
      },
      close(){
         this.show = false;
      },
      openResource(type,id,foid){
        var path='';
        switch(type){
          case 1:
            path='video';
            break;
          case 2:
            path='audio';
            break;
          case 3:
            path='picture';
            break;
          case 4:
            path='draft';
            break;
          default:
            path='video';
            break;
        }
        if(path!="picture"){
          this.$router.push({path:'/resource/'+path+'/detail',query:{id:id} });
        }else{
          this.$router.push({path:'/resource/'+path+'/detail',query:{id:id,foid:foid} });
        }
      },
  }
}
</script>

<style lang="scss">
.right-content{
  width:26%;
  float:left;
  margin-left:1%;
  height:83em;
  background:url("../../assets/module/u10.png") no-repeat;
  background-size:100% 100%;
  margin-top:6px;
  box-sizing:border-box;
  padding:2.5% 1.5%;
  color:#fff;

  .title{
      width:100%;
      height:2em;
      line-height:2em;
      box-sizing:border-box;
      padding-left:4%;
      border-left:4px solid #0099ff;
    }

  .attention{
    width:100%;
    height:auto;

    li{
      width:100%;
      overflow:hidden;
      clear:both;
      margin-top:2em;
      cursor:pointer;

      .order{
        float:left;
        width:1.2em;
        height:1.2em;
        background:#f00;
        text-align:center;
        line-height:1.2em;
      }

      .name{
        width:60%;
        float:left;
        line-height:1.5em;
        margin-left:2em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
      }

      .num{
        float:right;
      }
      .order1{
        float:left;
        width:1.2em;
        height:1.2em;
        background:#666666;
        text-align:center;
        line-height:1.2em;
      }
    }
  }
  .thematic{
    margin-top:30px;
    text-align:center;

    ul{
      width:100%;
      margin:0 auto;

      li{
        width:22.6em;
        margin:4em auto;

        div{
          height:10em;
          cursor:pointer;
          position:relative;

          .instruction{
            position:absolute;
            bottom:0;
            left:0;
            width:100%;
            height:2em;
            line-height:2em;
            background-color:rgba(#000000, 0.4);
          }
        }

        p{
          text-align:left;
          padding-left:2em;
          margin-top:6px;
          background:url("../../assets/module/u1872.png") no-repeat left center;
          background-size:7%;
        }
      }
    }
  }
}

</style>
