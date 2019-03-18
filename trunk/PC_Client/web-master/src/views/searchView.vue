<template>
  <div class="search-view">
    <!-- <slide-nav></slide-nav> -->
    <div class="search-view-right">
    <div class="search">
      <input type="text" class="search-in" placeholder="为您模糊搜索视频、音频、图片及文稿" v-model="keys">
      <a href="javascript:void(0)" class="searBtn" @click="getResources()">搜索</a>
    </div>
    <ul class="hot">
        <li>热搜：</li>
        <li v-for="h in hotwords" :data-hot="h.hot" @click="searchHot(h.name)">{{h.name}}</li>
      </ul>
      <div class="res-type">
        <ul>
              <li class="cur" @click="changeResType(0,$event)">全部</li>
              <li v-for="s in resourceTypes"  @click="changeResType(s.id,$event)">{{s.name}}</li>
        </ul>
      </div>
      <div class="res-order">
        <ul>
          <li>
            <span>排序</span>
            <select name="" id="" v-model="orderby">
              <option value="1">最热</option>
              <option value="2">最新</option>
              <option value="3">观看最多</option>
              <option value="4">点赞最多</option>
            </select>
          </li>
          <li>
            <span>分类</span>
            <select name="" id="" v-model="sort">
              <option value="0">全部</option>
              <option v-for="c in classList" :value="c.id">{{c.name}}</option>
            </select>
          </li>
          <li>
            <span>来源</span>
            <select name="" id="" v-model="source">
              <option value="0">全部</option>
              <option v-for="s in sourceList" :value="s.id">{{s.name}}</option>
            </select>
          </li>
        </ul>
      </div>
      <div class="show-view">
        <ul>
          <li v-for="r in resourceList">
            <p class="show-img" v-if="r.rtid == 1">
              <span v-if="r.pic" class="img"  v-bind:style="{ 'background-image' : 'url('+r.pic+')'}" @click="openResource(r.rtid,r.id,r.foid)"></span>
              <span v-else class="img" @click="openResource(r.rtid,r.id,r.foid)"></span>
            </p>
            <p class="show-img" v-if="r.rtid == 2">
              <span class="img audio"  @click="openResource(r.rtid,r.id,r.foid)">
              </span>
            </p>
             <p class="show-img" v-if="r.rtid == 3">
              <span v-if="r.pic" class="img"  v-bind:style="{ 'background-image' : 'url('+r.pic+')'}" @click="openResource(r.rtid,r.id,r.foid)"></span>
              <span v-else class="img picture" @click="openResource(r.rtid,r.id,r.foid)"></span>
            </p>
            <p class="show-img" v-if="r.rtid == 4">
              <span class="img"  :class="getDefaultBg(r.suffix,r.rtid)" @click="openResource(r.rtid,r.id,r.foid)">
              </span>
            </p>
            <div class="show-text">
              <h4 v-html="r.title"></h4>
              <p>
                <span>标签：</span>
                <span v-html="r.label"></span>
              </p>
              <p>
                <span>标注内容：</span>
                <span v-html="r.mark"></span>
              </p>
            </div>
            <span class="show-icon" :class="getClassName(r.rtid)">{{getType(r.rtid)}}</span>
          </li>
        </ul>
      </div>
      <el-pagination
          background
          v-if="total>pagesize"
          layout="prev, pager, next"
          :page-size="pagesize"
          :current-page="pageindex"
          :total="total"
          @current-change="changePage"
          >
      </el-pagination>
  </div>
  <div class="search-list">
    <h4 class="list-title">大家都在找</h4>
    <ul>
      <li v-for="l in lookfors">
        <span class="list-pic" v-if="l.rtid == 1">
               <span v-if="l.pic" class="img"  v-bind:style="{ 'background-image' : 'url('+l.pic+')'}" @click="openResource(l.type,l.id,l.foid)"></span>
               <span v-else class="img"></span>
        </span>
        <span class="list-pic" v-if="l.rtid == 2">
              <span class="img audio" @click="openResource(l.type,l.id,l.foid)">
              </span>
        </span>
        <span class="list-pic" v-if="l.rtid == 3">
               <span v-if="l.pic" class="img"  v-bind:style="{ 'background-image' : 'url('+l.pic+')'}" @click="openResource(l.type,l.id,l.foid)"></span>
               <span v-else class="img picture"></span>
        </span>
        <span class="list-pic" v-if="l.rtid == 4">
              <span class="img"  :class="getDefaultBg(l.suffix,l.type)" @click="openResource(l.type,l.id,l.foid)">
              </span>
        </span>
        <div class="list-info">
          <p style="-webkit-box-orient: vertical;" :title="l.title">
          {{l.title.length>50?l.title.substr(0,50):l.title}}
          </p>
          <p style="height:auto; position:absolute; bottom:10px;">
            <span class="watch">{{l.play>9999?(l.play/10000).toFixed(2)+'万':(l.play>999?l.play.substr(0,1)+','+l.play.substr(1,3):l.play)}}</span>
            <span class="like">{{l.thumbsup>9999?(l.thumbsup/10000).toFixed(2)+'万':(l.thumbsup>999?l.thumbsup.substr(0,1)+','+l.thumbsup.substr(1,3):l.thumbsup)}}</span>
          </p>
          <span class="identify" :class="getClassName(l.type)"></span>
        </div> 
      </li>
    </ul>
  </div>
  </div>
</template>
<script>
// import SlideNav  from "../components/SlideNav.vue"
export default {
  name: 'search-view',
  data(){
    return{
        pagesize:5,
        pageindex:1,
        total:0,
        hotwords:'',
        resourceTypes:[],
        classList:[],
        sourceList:[],
        resourceList:[],
        rtid:0,
        sort:0,
        source:0,
        orderby:1,
        suffix:'',
        keys:'',
        keywords:[],
        lookfors:[],
    }
  },
  // components:{SlideNav},
  mounted:function(){
      this.getHotWords(5);
      this.keys=this.$route.query.keys;
      this.getResourceType();
      this.getClasses();
      this.getAllSource();
      this.getResources();
      this.getLookFors();
  },
  watch:{
    keys(val,oldVal){
          this.pageindex = 1;
    },
    sort:function(){
      this.getResources();
    },
    source:function(){
      this.getResources();
    },
    orderby:function(){
      this.getResources();
    },
  },
  methods:{
        // 获得热词
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
      // 搜索结果
      getResources(){
          var keystr = this.keys.replace(/(^\s*)|(\s*$)/g, "")
          var str = keystr.replace(/\s+/g, ' ');  
          if(!str){
            this.keywords = [];
          } else{
            this.keywords=str.split(' ');
          }            
          this.$http.get('/Resource/FilterResources',{
              params:{
                  pagesize:this.pagesize,
                  pageindex:this.pageindex,
                  type:this.rtid,
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
                      this.resourceList=d.data;
                      this.total=d.count;
                      for(let i=0;i<this.resourceList.length;i++){
                          let item=this.resourceList[i];
                          item.title=this.getKeyStyle(item.title);
                          var label=item.label==null?'':item.label.replace(new RegExp(',',"gm"),' ');
                          item.label=this.getKeyStyle(label);
                          //标注内容
                          if(item.mark){
                            item.mark=item.mark.join(' ');
                          }else{
                            item.mark='';
                          }
                          item.mark=this.getKeyStyle(item.mark);
                          if (item.rtid==1) {
                              this.$http.get('/storage/getfilepath',{
                                  params:{
                                      fileid:item.md5
                                  }
                              }).then(res=>{
                                      var d=$.parseJSON(res.data);
                                      //console.log(res.data);
                                      if (d.msgid==200) {
                                          var json=JSON.parse(d.data); 
                                          var addr=json.file_addr;
                                          if (addr) {
                                             var  pic=addr+'.jpg';
                                             var img=new Image();
                                             img.src=pic;
                                             img.onload=function(){
                                                    item.pic=pic;
                                             };
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
      changePage(val){
          this.pageindex=val;
          this.getResources();
      },
      // 资源类型
      getResourceType(){
          this.$http.get('/Resource/GetAllResourceType'
          ).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                  if (d.msgid==200) {
                      this.resourceTypes=d.data;
                  }else{
                      console.log(d.msg);
                  }
              }
          }).catch(err=>{
              console.log(err);
          });
       }, 
       // 资源分类
      getClasses(){
          this.$http.get('/systemManage/getClassifications',{
              params:{
                  pagesize:9999,
                  pageindex:1,
                  name:''
              }
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
       // 资源来源
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
     changeResType(val,e){
          var dom=e.currentTarget;
          $(dom).addClass('cur').siblings().removeClass('cur');
          this.rtid=val;
          this.getResources();
     },
      getLabels(label){
          var res=[]; 
          if (label) {
            res=label.split(',');
          }
          return res;
      },
      getKeyStyle(oldval){
        console.log(this.keywords)
          var html=oldval;
          for(var i=0;i<this.keywords.length;i++){
               var k=this.keywords[i];
               var inx=html.indexOf(k);
               if(inx>-1){
                   html=html.replace(new RegExp(k,"gm"),'<em>'+k+'</em>');
               }
          }
          
          return html;
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
        if(path != "picture"){
          this.$router.push({path:'/resource/'+path+'/detail',query:{id:id} });
        }else{
          this.$router.push({path:'/resource/'+path+'/detail',query:{id:id,foid:foid} });
        }    
      },
      getDefaultBg(suffix,rtid){
        var className='';
         if(rtid==2){
                className="audio";
          }else if(rtid==3){
                className="picture";
          }else if(rtid==4){
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
          }
          return className;
      },
      getClassName(rtid){
          var classname='';
          switch(rtid){
            case 1:
               classname=' blue-video';
              break;
             case 2:
               classname=' blue-audio';
              break;
             case 3:
               classname=' blue-pic';
              break;
             case 4:
               classname=' blue-word';
              break;
            case 5:
               classname=' blue-title';
              break;
          }
          return classname;
      },
      getType(rtid){
          var type="";
          switch(rtid){
            case 1:
               type='视频';
              break;
             case 2:
               type='音频';
              break;
             case 3:
               type='图片';
              break;
             case 4:
               type='文稿';
              break;
            case 5:
               type='专题';
              break;
          }
          return type;
      },
      getLookFors(){
          this.$http.get('/Resource/GetEverybodyLookFors'
          ).then(res=>{
              var d=$.parseJSON(res.data);
              if (d) {
                  if (d.msgid==200) {
                      this.lookfors=d.data;
                      for(let i=0;i<this.lookfors.length;i++){
                        let item=this.lookfors[i];
                        if (item.type==1) {
                            this.$http.get('/storage/getfilepath',{
                                params:{
                                    fileid:item.md5
                                }
                            }).then(res=>{
                                    var d=$.parseJSON(res.data);
                                    //console.log(res.data);
                                    if (d.msgid==200) {
                                        var json=JSON.parse(d.data); 
                                        var addr=json.file_addr;
                                        if (addr) {
                                           var  pic=addr+'.jpg';
                                           var img=new Image();
                                           img.src=pic;
                                           img.onload=function(){
                                                  item.pic=pic;
                                           };
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
      searchHot(val){
        this.keys = val;
        this.getResources();
      },
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1440px){
  .search-view .search-view-right .el-pagination .btn-next, .search-view .search-view-right .el-pagination .btn-prev{
    padding:0 !important;
  }
}
.search-view{
  width:100%;
  background-color:#252c34;
  overflow:hidden;
  height:85em;
  color:#fff;
  top:-85em;
  left:5%;
  position:relative;
  .img{
    display:inline-block;
    width:100%;
    height:6em;
    margin-top:0.5em;
    cursor:pointer;
    background-repeat:no-repeat;
    background-position:center center;
    background-size:contain;
    // background-image:url("../assets/module/shipinmoren.png");
  }
  .blue-video{
    background:url("../assets/search/u3431.png") no-repeat left center;
  }
  .blue-audio{
    background:url("../assets/search/u3432.png") no-repeat left center;
  }
  .blue-pic{
    background:url("../assets/search/u3433.png") no-repeat left center;
  }
  .blue-word{
    background:url("../assets/search/u3434.png") no-repeat left center;
  }
  .blue-title{
    background:url("../assets/search/u3435.png") no-repeat left center;
  }
   .ppt{
    background:url("../assets/module/u1807.png") no-repeat center;
    background-size:34%;
  }
  .doc{
    background:url("../assets/module/u1801.png") no-repeat center;
    background-size:34%;
  }
 .pdf{
    background:url("../assets/module/u1805.png") no-repeat center;
    background-size:34%;
  }
  .ai{
    background:url("../assets/module/u1813.png") no-repeat center;
    background-size:34%;
  }
  .txt{
    background:url("../assets/module/u1815.png") no-repeat center;
    background-size:34%;
  }
  .eps{
    background:url("../assets/module/u1825.png") no-repeat center;
    background-size:34%;
  }
  .audio{
    background:url("../assets/module/u987.png") no-repeat center;
    background-size:55%;
  }
  .picture{
    background:url("../assets/module/picmoren.png") no-repeat center;
    background-size:55%;
  }
  .search-view-right{
    float:left;
    width:65%;
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
      width:55%;
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
          background:url("../assets/module/u2100.png") no-repeat 10%;
          background-size:30%;
          padding-left:6%;
      }
    }
     .hot{
        width:55%;
        margin:0 auto;
        overflow:hidden;
        color:#fff;
        
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
          }
          li.cur{
            color:#0099ff;
          }
        }
      }
      .res-order{
        width:100%;
        height:4em;
        padding:0 2em;
        margin-top:1.2em;

        ul{
          width:100%;
          height:4em;
          background-color:#232323;

          li{
            float:left;
            line-height:4em;
            margin: 0 2em;
            cursor:pointer;

            span{
              color:#0099ff;
            }
            select::-ms-expand { display: none; }
            select{
              background:none;
              border:1px solid #0099ff;
              border-radius:3px;
              line-height:2em;
              height:2em;
              width:8em;

              option{
                background-color:#252c34;
                height:2em;
                line-height:2em;
              }
            }
          }
        }
      }
      .show-view{
        width:100%;
        height:auto;
        padding: 0 2em;
        
        em{
          font-style:normal;
          color:#f00;
        }
        .red{
          color:red;
        }
        ul{
          width:100%;
          height:auto;
          li{
            width:100%;
            height:10em;
            padding:1em;
            border-bottom:1px dashed #2a2a2a;

            .show-img{
              width:14em;
              height:8em;
              float:left;
              background:url("../assets/module/u176.png");
              background-size:100% 100%;
            }
            .show-text{
              width:71%;
              float:left;
              text-align:left;
              margin-left:1em;
              h4{
                width:100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              p{
                width:100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
               span{
                margin-right:5px;
               }
            }
            .show-icon{
              float:left;
              padding-left:2.5em;
              height:2em;
              line-height:2em;
              background-size:50%;
            }
          }
        }
      }
  }
    .search-list{
        float:left;
        height:83em;
        width:28%;
        background:url("../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        margin-top:6px;
        padding:2em 1.5em;

        .list-title{
          width:100%;
          height:2em;
          line-height:2em;
          color:#0099ff;
          border-left:4px solid #0099ff;
          padding-left:1em;
        }
        ul{
          width:100%;
          height:82em;
          padding:0.5em 0;
          overflow-x:hidden;
          overflow-y:auto;

          li{
              width:100%;
              height:8em;
              position:relative;

              .list-pic{
                width:40%;
                height:8em;
                float:left;
                margin:0;
                background:url("../assets/module/u176.png");
                background-size:100% 100%;
                padding:0.2em 0.8em;
              }
              .identify{
                width:2em;
                height:2em;
                position:absolute;
                top:0;
                left:0.3em;
                background-size:100%;
              }
              .list-info{
                width:58%;
                float:left;
                margin-left:2%;

                p{
                  width:100%;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  height:2.8em;
                }
                .watch{
                  padding-left:1.3em;
                  background:url("../assets/module/u224.png") no-repeat left center;
                  background-size:45%;
                  margin-right:2em;
                }
                .like{
                  padding-left:1.3em;
                  background:url("../assets/module/u228.png") no-repeat left center;
                  background-size:45%;
                }
              }
          }
        }
    }
}

</style>
