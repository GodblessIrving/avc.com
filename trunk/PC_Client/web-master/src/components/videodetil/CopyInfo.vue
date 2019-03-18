<template>
    <div class="copy-info">
    　　　　<nav id="nav">
    　　　　　   <span v-if="_info.contain(0)" data-num="0" @click="toggleTabs($event);">{{first}}</span>
            　        <span v-if="_info.contain(1)&&!pictrue" data-num="1" @click="toggleTabs($event);" >{{second}}</span>
            　　     <span v-if="_info.contain(2)" data-num="2" @click="toggleTabs($event);" v-show="isShow">{{third+cnum}}</span>
    　　　　</nav>
　　　　　　<component :is="currentView" keep-alive 
                              :isPic="isPic" 
                              :pictrue="pictrue"
                              :isVideo = 'isVideo'
                              :isWord="isWord"
                              :isAudio="isAudio"
                              :mestitle="mestitle"
                              :tipArr="tipArr"
                              :size="size"
                              :isedit = "isedit"
                              :duration="duration"
                              :count="count"
                              :tid="tid"
                              :classList="classList"
                              :sourceList="sourceList"
                              :description="description"
                              :resolution = "resolution"
                              :format = "format"
                              :copyright="copyright"
                              :isMark = "isMark"
                              :resid="resid"
                              @addNewEvent="addsucess"
                              @closeNewEvent="close"
                              :profile="profile"></component>
　　    </div>
</template>

<script  type="text/ecmascript-6">
import first from './first';
import second from './second';
import third from './third';
import {getChildrenAuth,handleAuth} from  '../../scripts/auth.js' 

export default {
        name:"copy-info",
        data () {
             return {
                 first: "概要信息", //导航栏文本1
                second: "版权", //导航栏文本2
                third: "全部评论", //导航栏文本3
                actived:0,
                cnum:''
             };
         },
         components: {
             first,
             second,
             third
         },
         props:["isShow","isPic","isAudio","mestitle","profile","tipArr","size","description","resolution","format","isWord","copyright","comment","count","isVideo","duration","isedit","classList","sourceList","tid","isMark","resid","pictrue"],
         computed:{
              handles:function(){
                var path=this.$route.path;
                if(path!='/task'){
                  return getChildrenAuth(path.replace('/detail',''));
                }
                if(this.mestitle=='视频'){
                  return getChildrenAuth('/resource/video');
                }else{
                  return getChildrenAuth('/resource/audio');
                }
              },
              _info:function(){
                var auth=[];
                for(var i=0;i<this.handles.length;i++){
                     var h=this.handles[i];
                     switch(h.name){
                       case '概要信息':
                         auth.push(0);
                         break;
                       case '版权信息':
                         auth.push(1);
                         break;
                       case '评论查看':
                         auth.push(2);
                         break;
                     }
                }
                return auth;
              },
              currentView:{
                get:function(){
                  var views=[];
                  for(var i=0;i<this.handles.length;i++){
                    var cur=this.handles[i];
                    switch(cur.name){
                      case '概要信息':
                         views.push(first);
                        break;
                      case '版权信息':
                        views.push(second);
                        break;
                      case '评论查看':
                        views.push(third);
                        break;
                    }
                }
                  return views[this.actived];
                },
                set:function(inx){
                  this.actived=inx;
                }
              }
         },
         mounted:function(){
          $("#nav span").eq(0).addClass('active').siblings().removeClass('active');
          this.getUserComments();
         },
         methods: {
             toggleTabs (e) {
                 // $("#nav span").eq(0).attr("value",0);
                 // $("#nav span").eq(1).attr("value",1);
                 // $("#nav span").eq(2).attr("value",2);
                var dom = e.currentTarget;
                this.currentView = $(dom).attr("data-num");
                $(dom).addClass('active').siblings().removeClass('active')
             },
             close(){
                this.$emit('closeNewEvent');
             },
             addsucess(){
                this.$emit('addNewEvent');
             },
             getUserComments(){
                    this.$http.get('/Resource/GetCommentByRid',{
                        params:{
                            rid:this.resid
                        }
                    }).then(res=>{
                        if(res.data){
                            var d=JSON.parse(res.data);
                            if(d.msgid==200){
                                this.cnum='('+d.count+')';
                            }else{
                                console.log(d.msg);
                            }
                        }
                    });
                },
         }
    }
</script>

//使用sass
<style lang="scss">
    .copy-info{
        width:30%;
        float:left;
        color:#fff;
        margin-top:0.5em;
        nav{
            width:100%;
            height:4em;
            position:relative;
            top:1px;

            span{
                float:left;
                width:33.33%;
                height:4em;
                border-radius:3px 3px 0 0;
                line-height:4em;
                text-align:center;
                cursor:pointer;
            }
            .active{
                background-color:#303030;
                border:1px solid #282828;
                border-bottom:none;
            }
        }
    }
</style>