<template>
  <div class="video-right" >
     <search name='视频' :title='restitle'></search>
     <video-info :resid="resid" :uid="uid"></video-info> 
     <copy-info  class="copy-info"
                        :isShow="true" 
                        :isPic="false"
                        :isVideo = 'true'
                        :isAudio="true" 
                        mestitle="视频"
                        :profile="resInfo"
                        :tipArr = "labels"
                        :duration='timeStr'
                        :format="format"
                        :isedit="false"
                        :resid="resid"
                        :copyright= "copyright"
                        :comment = "comment">
     </copy-info>
  </div>
</template>
<script>
import Search from "../videodetil/Search"
import VideoInfo from "../videodetil/VideoInfo"
import CopyInfo from "../videodetil/CopyInfo"
export default {
  name: 'video-right',
  data(){
    return{
          playNum:0,
          thumbsup:0,
          resInfo:{},
          labels:[],//标签数组
          timeStr:'00分00秒',
          format:'mp4',
          copyright:{},//版权;
          comment:{},//评论;
          restitle:'',
          marknum:0,
          info:null,
    }
  },
  props:['resid'],
  components: { Search,VideoInfo,CopyInfo},
  created:function(){
          this.getResDetails();
          this.getResCopyright();
          this.getResComments();
  },
  computed:{
    uid:function(){
      return this.$store.state.user.uid;
    }
  },
  methods:{
        listen(val){
          this.marknum = val;
          this.$emit('SaveEvent',this.marknum);
        },
        getResDetails(){
             this.$http.get('/resource/GetResourceDetails',{
                params:{
                    id:this.resid,
                    uid:this.uid
                }
            }).then(res=>{
                var d=$.parseJSON(res.data);
                if (d) {
                    if (d.msgid==200) {
                        var info=d.data;
                        this.info=info;
                        this.playNum=info.play;
                        this.thumbsup=info.thumbsup;
                        this.resInfo=info.resmsg; 
                        this.restitle=info.resmsg.title;
                        var  lname=info.resmsg.lname;
                        if (lname) {
                            this.labels=lname.split(',');
                        }
                        var file=info.resmsg.file;
                        if (file&&file.length>0) {
                            var video=file[0];
                            var duration=video.duration;
                            if (duration) {
                                this.timeStr=this.getTimeStr(duration);
                            }
                            var suffix=video.suffix;
                            if (suffix) {
                              this.format=suffix.substr(1,suffix.length-1);
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
        getResCopyright(){
             this.$http.get('/resource/GetResourceCopyright',{
                params:{
                    rid:this.resid
                }
            }).then(res=>{
                var d=$.parseJSON(res.data);
                if (d) {
                    if (d.msgid==200) {
                        this.copyright=d.data;
                    }else{
                        console.log(d.msg);
                    }
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        getResComments(){
             this.$http.get('/resource/GetCommentByRid',{
                params:{
                    rid:this.resid
                }
            }).then(res=>{
                var d=$.parseJSON(res.data);
                if (d) {
                    if (d.msgid==200) {
                        this.comment=d.data;
                    }else{
                        console.log(d.msg);
                    }
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        getTimeStr(secord){
           var h=0,i=0,s=parseInt(secord);
           if(s>60){
               i=parseInt(s/60);
               s=parseInt(s%60);
               if(i > 60) {
                   h=parseInt(i/60);
                   i = parseInt(i%60);
               }
           }
           if(parseInt(h) > 0){
             h = h+'时'
           }else{
             h = ''
           }
           if(parseInt(i) > 0){
             i = i+'分'
           }else{
             i = ''
           }
           if(parseInt(s) > 0){
             s = s+'秒'
           }else{
             s = ''
           }
          var durations = h + i + s;
          return   durations;
        }
  },
}
</script>

<style lang="scss">
.video-right{
	width:92%;
	height:83em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;
	margin-left:1.5%;
	float:left;
    	margin-top:6px;
      .copy-info{
        width:31%;
      }
}
</style>
