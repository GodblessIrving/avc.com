<template>
      <div class="show-content" style="color:#fff"> 
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
              <li>课堂录播</li>
              <li>跟谁学</li>
              <li>采购资源</li>
              <li>三方上传</li>
            </ul>
          </div>
          <div class="order">
            <p>排序：</p>
            <ul>
              <li class="cur">最热</li>
              <li>最新</li>
              <li>观看人数最多</li>
              <li>点赞人数最多</li>
            </ul>
          </div>
          </div>   
      <div class="show">
        <ul>
          <li>
            <router-link :to="{ name: 'VideoView'}">
                <div>
                    <img src="../../assets/module/u178.jpg" alt="" width="95%">
                    <p>跟谁学-英语基础课（一）跟谁学-英语基础</p>
               </div>
            </router-link>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u178.jpg" alt="" width="95%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u178.jpg" alt="" width="95%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u178.jpg" alt="" width="95%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u178.jpg" alt="" width="95%">
               <p>跟谁学-英语基础课（一）</p>
            </div>
            <span class="watch">12万</span>
            <span class="good">221</span>
          </li>
          <li>
            <div>
              <img src="../../assets/module/u178.jpg" alt="" width="95%">
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
  name: 'show-content'
}
</script>

<style lang="scss">
.show-content{
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


        p{
          width:100%;
          font-size:0.9em;
          text-align:left;
          line-height:1.5em;
          height:1.5em;
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
    li:nth-child(2n+5){
      margin-right:0;
    }
  }
}
}

</style>
