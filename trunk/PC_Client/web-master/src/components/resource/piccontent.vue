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
            <p>排序：</p>
            <ul>
              <li class="cur" @click="changeOrder(1,$event)">最热</li>
              <li @click="changeOrder(2,$event)">最新</li>
              <li @click="changeOrder(3,$event)" title="观看人数最多">观看人数最多</li>
              <li @click="changeOrder(4,$event)" title="点赞人数最多">点赞人数最多</li>
            </ul>
          </div>
          </div>   
      <div class="show">
        <ul>
          <li v-for="s in resourceList">
                <div @click="openResource(s.id,s.foid)">
                    <p class="pc-img img" v-if="s.path" v-bind:style="{ 'background-image' : 'url('+s.path+')'}"></p>
                    <p v-else class="pc-img img"></p>
                    <!-- <p class="imgbox">
                      <img :src="s.pic" alt="" @load="ReSizePic(s.pic,s.id)" :data="s.id" class="imgload">
                    </p> -->
                    <p :title="s.title">{{s.title}}</p>
               </div>
            <span class="watch">{{s.play}}</span>
            <span class="good">{{s.thumbsup}}</span>
          </li>
      </ul>
      </div>
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
export default {
  name: 'audio-content',
  data(){
    return{
      sort:0,
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
    }
  },
  props:['sourceList','classList'],
  mounted:function(){
    this.getResources();
  },
    methods:{
      getResources(){
          this.$http.get('/Resource/FilterResources',{
              params:{
                  pagesize:this.pagesize,
                  pageindex:this.pageindex,
                  type:3,
                  sort:this.sort,
                  source:this.source,
                  orderby:this.orderby,
              }
          }).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                  if (d.msgid==200) {
                      this.count = d.count;
                      this.resourceList=d.data;
                      if(this.count <= 20){
                        this.ispage = false;
                      }else{
                        this.ispage = true;
                      }
                      for(let i=0;i<this.resourceList.length;i++){
                        let info=this.resourceList[i];
                            if(info.md5){
                              this.$http.get('/storage/getfilepath',{
                                params:{
                                    fileid:info.md5
                                }
                              }).then(res=>{
                                      var d=$.parseJSON(res.data);
                                      if (d.msgid==200) {
                                          if(d.data){
                                            var json=JSON.parse(d.data); 
                                            var addr=json.file_addr;
                                            if (addr) {
                                               var  pic=addr+'.jpg';
                                               var  path=addr+'.json';
                                               var img=new Image();
                                               img.src=pic;
                                               img.onload=function(){
                                                      info.path=pic;
                                               };
                                            }
                                          }
                                      } 
                              });
                          }
                      }
                  }else{
                      console.log(d.msg);
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
      handleCurrentChange(val) {
        this.pageindex = parseInt(val);
        this.getResources();
     },
     ReSizePic(path,id,thispic){
        var image = new Image();
        image.src =  path;
        var _this = this;
        console.log(thispic)
        var oldwidth = $(".imgbox").width();
        var oldheight = $(".imgbox").height();
        image.onload = function(e){
          var width =  image.width;
          var height =  image.height;
          if(width < height){
            $(".imgload[data='"+id+"']").css("height",oldheight)
          }else if(width >= height){
            $(".imgload[data='"+id+"']").css("width",oldwidth)
          }
        };
     },
     openResource(id,foid){
        this.$router.push({path:'/resource/picture/detail',query:{id:id,foid:foid} });
    },
  }
}
</script>
<style>
  .resource-content .show-content .show ul li{
    margin-bottom:1.5em;
  }
  .pc-img{
    background-image:url("../../assets/module/picmoren.png");
  }
  .resource-content .show-content .show ul li div .imgbox {
    width: 100%;
    height: 7.5em;
    overflow: hidden;
    margin-bottom: 0;
    margin-top: -0.3em;
    text-align: center;
  }
</style>
