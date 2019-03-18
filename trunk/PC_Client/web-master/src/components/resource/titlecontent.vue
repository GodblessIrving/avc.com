<template>
      <div class="title-content" style="color:#fff"> 
       <div class="show-text" style="color:#fff">
          <div class="object">
            <p>分类：</p>
            <ul>
              <li class="cur">全部</li>
              <li>数学</li>
              <li>英语</li>
              <li>化学</li>
              <li>计算机</li>
              <li>物理</li>
              <li>音乐</li>
              <li>考试冲刺</li>
              <li>语文</li>
              <li>历史</li>
              <li>地理</li>
              <li>哲学</li>
              <li>建筑专业</li>
              <li>社会实践</li>
              <li>其他</li>
            </ul>
          </div>
          <div class="type">
            <p>来源：</p>
            <ul>
              <li class="cur">全部</li>
              <li>个人专题</li>
              <li>视频聚合专题</li>
            </ul>
          </div>
          <div class="order" style="margin-bottom:1em;">
              <p>排序：</p>
              <ul>
                <li class="cur">最热</li>
                <li>最新</li>
                <li>关注人数最多</li>
              </ul>
          </div>
          </div>   
      <div class="show">
        <ul>
          <li>
            <router-link :to="{ name: 'VideoView'}">
                <div>
                    <img src="../../assets/module/u1852.jpg" width="100%">
                    <p>跟谁学-英语基础课（一）跟谁学-英语基础</p>
               </div>
            </router-link>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
             <img src="../../assets/module/u1852.jpg" width="100%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u1852.jpg" width="100%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u1852.jpg" width="100%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
             <img src="../../assets/module/u1852.jpg" width="100%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u1852.jpg" width="100%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: 'title-content'
}
</script>
<style lang="scss">
  .title-content{
 .show-text{
            width:95%;
            margin:0 auto;
            .cur{
                  color:#0099ff;
                }
                p{
                float:left;
                width:7%;
              }

              ul{
                float:left;
                width:93%;
                overflow:hidden;

                li{
                  float:left;
                  margin-right:2.5%;
                  text-align:left;
                  cursor:pointer;
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
              overflow:hidden;
            }
            .object{
              margin-top:0;
            }
      }
  .show{
    overflow:hidden;
    background:none;
    ul{width:95%;
        margin:0 auto;
    li{
      margin-top:0.7em;
      margin-bottom:1em;
      float:left;
      width:31.28%;
      height:12em;
      margin-right:1.7%;
      text-align:center;

      div{
        height:10.5em;
        background-size:100% 100%;
        position:relative;
        width:100%;
        margin-bottom:1em;
        box-sizing:border-box;
        p{
          width:100%;
          font-size:0.9em;
          text-align:left;
          line-height:2em;
          height:2em;
          box-sizing:border-box;
          padding-left:1.5%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position:absolute;
          bottom:0;
          left:0;
          background:rgba(#000, 0.5);
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
        left:-6.3em;
      }
      .good{
        background:url("../../assets/module/u228.png") no-repeat left center;
        background-size:21%;
        left:-5.3em;
      }
    }
    li:nth-child(3n+3){
      margin-right:0;
    }
  }
}
}
</style>
