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
                <div @click="openResource(s.id)">
                    <img src="../../assets/module/u987.png" alt="" width="80%">
                    <p :title="s.title">{{s.title}}</p>
                    <em style="font-style:normal; position:relative; top:-4em;">{{getTime(s.duration)}}</em>
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
                  type:2,
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
                      if(this.count <= 20){
                        this.ispage = false;
                      }else{
                        this.ispage = true;
                      }
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
                                        console.log(addr)                                    
                                        if (addr) {
                                           var  path=addr+'.json';
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
     openResource(id){
        this.$router.push({path:'/resource/audio/detail',query:{id:id} });
    },
  }
}
</script>
