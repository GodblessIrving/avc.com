<template>
   <div class="masklayer" v-if="isShow">
     <div class="more-resource" >
       <div class="move-title">
          <p class="title-name">大家关注资源TOP50</p>
          <p class="title-close" @click="closeMove" style="font-size:2.2em; font-weight:400">×</p>
        </div>
        <div class="add-content">
            <ul class="list">
                  <li v-for="(s,i) in moreList" @click="openResource(s.rtid,s.id,s.foid)">
                    <span :class="[i<3?'order':'order1']">{{i+1}}</span>
                    <span class="name" :title="s.title">{{s.title.length>40?(s.title.substr(0,40)+'...'):s.title}}</span>
                    <span class="num">{{s.hot>10000?(s.hot/10000).toFixed(2)+'万':s.hot}}</span>
                  </li>
            </ul>
        </div>
     </div>
   </div>
  </div>
  
</template>

<script>
export default {
  name: 'more-resource',
  props:["isShow","moreList"],
  methods:{
      closeMove(){
        this.$emit('closeNewEvent');
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
        $('#myModal').modal('hide');
      },
  }
}
</script>

<style lang="scss" scoped>
  .more-resource{
          width:40em;
          position:fixed;
          left:50%;
          margin-left:-25em;
          height:30em;
          top:50%;
          margin-top:-15em;
          background:url("../../assets/module/u10.png") no-repeat;
          background-size:100% 100%;
          padding:0 0.3em 2em;
          .move-title{
             width:100%;
             height:3em;
             background-color:#0099ff;
             padding:0 2em;
             line-height:3em;
             .title-name{
               float:left;
               font-size:1.2em;
             }
             .title-close{
               float:right;
               cursor:pointer;
               font-size:1.5em;
               font-weight:700;
             }
           }
      .add-content{
        height:25em;
        overflow-y:auto;
        padding-bottom:2em;
        width:100%;
      }
      .list{
        width:90%;
        margin:0 auto;

        li{
          width:100%;
          overflow:hidden;
          clear:both;
          margin-top:1em;
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
        line-height:1.2em;
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
    
  }
</style>
