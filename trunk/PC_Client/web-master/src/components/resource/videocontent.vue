<template>
      <div class="show-content" style="color:#fff; "> 
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
              <li class="cur"  @click="changeOrder(1,$event)">最热</li>
              <li @click="changeOrder(2,$event)">最新</li>
              <li @click="changeOrder(3,$event)" title="观看人数最多">观看人数最多</li>
              <li @click="changeOrder(4,$event)" title="点赞人数最多">点赞人数最多</li>
            </ul>
          </div>
          </div>   
      <div class="show">
        <ul>
          <li v-for="s in resourceList">
            <div style="position:relative;"  @click="openResource(s.id)" v-on:mouseenter="add($event)" v-on:mouseleave="leave($event)"> 
                  <p class="img" v-if="s.pic" v-bind:style = "{ 'background-image' : 'url('+s.pic+')'}"> 
                  <p v-else class="img"></p>
                  <em class="duration">{{s.duration?getTime(s.duration):'00:00'}}</em>
                  <p :title="s.title">{{s.title}}</p>
                  <span class="play-cover"></span>
            </div>
            <span class="watch">{{s.play}}</span>
            <span class="good">{{s.thumbsup}}</span>
          </li>
        </ul>
      </div>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageindex"
          :page-size="pagesize"
          layout="prev, pager, next"
          :total="count"
          v-if="count>pagesize"
          >
      </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'show-content',
  data(){
    return{
          resourceList:[],
          pagesize:20,
          pageindex:1,
          sort:0,
          source:0,
          count:0,
          orderby:1,
          suffix:'',
          keys:'',
    }
  },
  props:['sourceList','classList'],
  created:function(){
    this.getResources();
  },
  methods:{
      //endregion数据初始化\
      //按照条件获取资源数据
      getResources(){
          this.$http.get('/Resource/FilterResources',{
              params:{
                  pagesize:this.pagesize,
                  pageindex:this.pageindex,
                  type:1,
                  sort:this.sort,
                  source:this.source,
                  orderby:this.orderby,
                  suffix:this.suffix,
                  keys:this.keys,
              }
          }).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                  if (d.msgid==200) {
                      this.count = d.count;
                      this.resourceList=d.data;
                      for(let i=0;i<this.resourceList.length;i++){
                            let info=this.resourceList[i];
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
                                                    info.pic=pic;
                                             };
                                             var _this=this;
                                             $.getJSON(path,function(result){
                                                  info.duration=result.Duration;
                                                  _this.$http.post('/Resource/UpdateFileDuration',{
                                                          rid:info.id,
                                                          duration:info.duration
                                                  }).then(res=>{
                                                      //console.log(info.id,info.duration,res.data);
                                                  });
                                             });
                                          }
                                        }
                                    } 
                            });
                      }
                  }else{
                      console.log(d.msg);
                  }
              }
          }).catch(err=>{
              console.log(err);
          });
      },
      add(e){
        var dom = e.currentTarget;
        $(dom).children('.play-cover').css("display","block");
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
      leave(e){
        var dom = e.currentTarget;
        $(dom).children('.play-cover').css("display","none");
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
      getTime(s){
          var t=''; 
          var min=0;
          var sec=0;
          if (s>=60) {
            sec=s%60;
            min=(s-sec)/60;
          }else{
            sec=s;
          }
          t=(min>9?min:'0'+min)+':'+(sec>9?sec:'0'+sec);
          return t;
      },
      handleCurrentChange(val) {
        this.pageindex = parseInt(val);
        this.getResources();
    },
      openResource(id){
        this.$router.push({path:'/resource/video/detail',query:{id:id} });
      },
  }
}
</script>
<style lang="scss">
.duration{
  position:absolute;
  font-style:normal;
  bottom:4em;
  right:1em;
}
.resource-content .show-content .show ul li  .play-cover{
  width:100%;
  height:7.5em;
  position:absolute;
  top:0;
  left:0;
  background:url('../../assets/module/u610.png') no-repeat center center;
  background-size:25%;
  display:none;
} 
.show-content .el-pagination{
      position:absolute;
      width:100%;
      bottom:3em;
  }
  .img{
    background-image:url("../../assets/module/shipinmoren.png");
    background-repeat:no-repeat;
    background-position:center center;
    background-size:contain;
  }
</style>


