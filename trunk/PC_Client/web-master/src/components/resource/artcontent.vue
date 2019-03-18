<template>
      <div class="show-content" style="color:#fff"> 
       <div class="show-text" style="color:#fff">
          <div class="object">
            <p>分类：</p>
            <ul v-if="classList.length<=8">
              <li class="cur" @click="changeClass(0,$event)">全部</li>
              <li class="lis" v-for="c in classList" :title="c.name"  @click="changeClass(c.id,$event)">{{c.name}}</li>
            </ul>
            <ul v-else>
              <li class="cur" @click="changeClass(0,$event)">全部</li>
              <li class="lis" v-for="c in classList.slice(0,8)" :title="c.name"  @click="changeClass(c.id,$event)">{{c.name}}</li>
              <li style="position:relative;" @mouseenter="showClass" @mouseleave="hideClass">
                <span>更多</span>
                <div class="moreclass more">
                  <span v-for="c in classList.slice(8,classList.length)" @click="changeClass(c.id,$event)">{{c.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="type">
            <p>来源：</p>
            <ul v-if="sourceList.length <=8">
              <li class="cur" @click="changeSource(0,$event)">全部</li>
              <li class="lis" v-for="s in sourceList" :title="s.name" @click="changeSource(s.id,$event)">{{s.name}}</li>
            </ul>
            <ul v-else>
              <li class="cur" @click="changeSource(0,$event)">全部</li>
              <li class="lis" v-for="s in sourceList.slice(0,8)" :title="s.name" @click="changeSource(s.id,$event)">{{s.name}}</li>
              <li style="position:relative;" @mouseenter="showResource" @mouseleave="hideResource">
                <span>更多</span>
                <div class="moreresource more">
                  <span v-for="s in sourceList.slice(8,sourceList.length)" @click="changeSource(s.id,$event)">{{s.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="order" style="margin-bottom:1em;">
            <div class="left">
              <p>排序：</p>
              <ul>
                <li class="cur" @click="changeOrder(1,$event)">最热</li>
                <li @click="changeOrder(2,$event)">最新</li>
                <li @click="changeOrder(3,$event)" title="观看人数最多">观看人数最多</li>
                <li @click="changeOrder(4,$event)" title="点赞人数最多">点赞人数最多</li>
              </ul>
            </div>
            <div class="right">
              <p>格式：</p>
              <ul>
                <li class="cur" data-num="all" @click="choseFormat($event)">全部</li>
                <li data-num="doc" @click="choseFormat($event)">DOC</li>
                <li data-num="pdf" @click="choseFormat($event)">PDF</li>
                <li data-num="txt" @click="choseFormat($event)">TXT</li>
                <li data-num="ppt" @click="choseFormat($event)">PPT</li>
                <li data-num="xls" @click="choseFormat($event)">XLS</li>
                <li data-num="other" @click="choseFormat($event)">OHTER</li>
              </ul>
            </div>
          </div>
          </div>   
      <div class="show">
        <ul>
          <li v-for="s in resourceList">
                <div @click="openResource(s.id)">
                    <p class="bg" :class="getClassname(s.suffix)"></p>
                    <p :title="s.title">{{s.title}}</p>
               </div>
            <span class="watch">{{s.play}}</span>
            <span class="good">{{s.thumbsup}}</span>
          </li>
        </ul>
      </div>
      <alert-tip :isShowtip = "isShowtip" :message="message" @closeTipEvent="closeTip"></alert-tip>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next"
          :total="count"
          v-show="ispage"
          >
      </el-pagination>
  </div>
</template>

<script>
import alertTip from "../alertTip"
export default {
  name: 'audio-content',
  data(){
    return{
        sort:0,
        isShowtip:false,
        message:'',
        resourceList:[],
        resourceList:[],
        pagesize:20,
        pageindex:1,
        currentPage:1,
        sort:0,
        ispage:true,
        source:0,
        count:0,
        orderby:1,
        suffix:'',
        keys:'',
        ispage:false,
    }
  },
  props:['sourceList','classList'],
  components:{alertTip},
  mounted:function(){
    this.getResources();
  },
    methods:{
      getResources(){
          this.$http.get('/Resource/FilterResources',{
              params:{
                  pagesize:this.pagesize,
                  pageindex:this.pageindex,
                  type:4,
                  sort:this.sort,
                  source:this.source,
                  orderby:this.orderby,
                  suffix:this.suffix,
                  keys:this.keys,
              }
          }).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                console.log(d)
                  if (d.msgid==200) {
                      this.count = d.count;
                      this.resourceList=d.data;
                      if(this.count <= 20){
                        this.ispage = false;
                      }else{
                        this.ispage = true;
                      }
                  }else{
                      console.log('hh'+d.msg);
                  }
              }
          }).catch(err=>{
              console.log(err);
          });
      },
      showClass(){
        $(".moreclass").stop().slideDown();
      },
      hideClass(){
        $(".moreclass").stop().slideUp();
      },
      showResource(){
        $(".moreresource").stop().slideDown();
      },
      hideResource(){
        $(".moreresource").stop().slideUp();
      },
      changeClass(cid,e){
          this.sort=cid;
          this.getResources();
          var li=e.currentTarget;
          $(".moreclass").stop().slideUp();
          $(".object li").removeClass('cur');
          $(".object span").removeClass('cur');
          $(li).addClass('cur');
      },
      changeSource(sid,e){
          this.source=sid;
          this.getResources();
          var li=e.currentTarget;
           $(".moreresource").stop().slideUp();
          $(".type li").removeClass('cur');
          $(".type span").removeClass('cur');
          $(li).addClass('cur');
      },
      changeOrder(oid,e){
          this.orderby=oid;
          this.getResources();
          var li=e.currentTarget;
          $(li).addClass('cur').siblings().removeClass('cur');
      },
      choseFormat(e){
        var dom = e.currentTarget;
        $(dom).addClass('cur').siblings().removeClass('cur');
        var format = $(dom).attr("data-num");
        if(format == "all"){
          this.suffix = "";
        }else{
          this.suffix = format;
        }
        console.log(this.suffix)
        this.getResources();
      },
      handleCurrentChange(val) {
        this.pageindex = parseInt(val);
        this.getResources();
     },
     openResource(id){
        for(var i = 0; i < this.resourceList.length; i++){
            if(this.resourceList[i].id == id && this.resourceList[i].suffix == ".txt"){
                this.message = "该格式暂不支持预览";
                this.isShowtip = true;
                return
            }
        }
        this.$router.push({path:'/resource/draft/detail',query:{id:id} });
     },
     closeTip(){
      this.isShowtip = false;
     },
     getClassname(suffix){
        var className='';
        console.log();
        switch(suffix){
          case '.doc':
          case '.docx':
            className='doc';
            break;
          case '.ppt':
          case '.pptx':
            className='ppt';
            break;
          case '.pdf':
            className='pdf';
            break;
          case '.ai':
            className='ai';
            break;
          case '.txt':
            className='txt';
            break;
          case '.eps':
            className='eps';
            break;
          case ".xls":
          case ".xlsx":
            className = "exc"
            break
          default:
            className='other';
            break;
        }
        return className;
     }
  }
}
</script>
<style lang="scss">
  .resource-content .show-content .show-text .order .left{
    float:left;
    width:50%;
    position:relative;
    top:-0.5em;
    p{
      width:14%;
    }
    ul{
      width:85%;
      li{
        margin-right:5.45%;
        width:auto;
      }
    }
  }
  .resource-content .show-content .show-text .order .right{
    float:right;
    width:50%;
    position:relative;
    top:-0.5em;
    p{
      width:15%;
    }
    ul{
      width:85%;
      li{
        margin-right:3%;
        width:auto;
      }
    }
  }
  @media screen and (max-width: 1440px) {
    .resource-content .show-content .show ul li div .bg{
      height:6.5em !important;
    }
  }
  .resource-content .show-content .show ul li div .bg{
    display:block;
    width:100%;
    height:7.5em;
    margin:0;
  }
  .ppt{
    background:url("../../assets/module/u1807.png") no-repeat center;
    background-size:45%;
  }
  .doc{
    background:url("../../assets/module/u1801.png") no-repeat center;
    background-size:45%;
  }
 .pdf{
    background:url("../../assets/module/u1805.png") no-repeat center;
    background-size:45%;
  }
  .ai{
    background:url("../../assets/module/u1813.png") no-repeat center;
    background-size:45%;
  }
   .txt{
    background:url("../../assets/module/u1815.png") no-repeat center;
    background-size:45%;
  }
    .eps{
    background:url("../../assets/module/u1825.png") no-repeat center;
    background-size:45%;
  }
  .exc{
    background:url("../../assets/module/u188.png") no-repeat center;
    background-size:45%;
  }
  .other{
    background:url("../../assets/module/u189.png") no-repeat center;
    background-size:45%;
  }
</style>
