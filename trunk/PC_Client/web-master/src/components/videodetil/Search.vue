<template>
  <div class="search" >
     <div class="searchAll">
      <input type="text" class="search-in" placeholder="为您模糊搜索视频、音频、图片及文稿" v-model="keyknows">
      <a href="javascript:void(0)" class="searBtn" @click="goToSearch()">搜索</a>
    </div>
    <div class="title">
	<p>
		<img src="../../assets/module/u14.png" alt="" width="30%">
	</p>
	<p class="break">
		<span style="cursor:pointer;" @click="goTorespurce()">{{name}}</span>
		<span>-></span>
		<span>{{title}}</span>
	</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'search',
  data(){
    return{
      keyknows:'',
      type:''
    }
  },
  props:["name","title"],
  methods:{
    goToSearch(){
      this.$router.push({'path':'/resource/search',query:{'keys':this.keyknows} });
    },
    goTorespurce(){
      switch(this.name) {
        case "视频" :
          this.type = 0;
          break;
        case "音频":
          this.type = 1;
          break;
        case "图片":
          this.type = 2;
          break;
        case "文稿":
          this.type = 3;
          break;
        case "专题":
          this.type = 4;
          break;
      }
      this.$router.push({path:'/resource',query:{type:this.type} });
    }
  }
}
</script>

<style lang="scss">
.search{
      margin-top:5em;
    	.searchAll{
      		margin-top:3em;
      		height:60px;
      		width:50%;
      		margin: 3em auto;
      		background:url("../../assets/module/u2098serch.png") no-repeat;
      		background-size:100% 100%;
		
      		.search-in{
      		  float:left;
      		  width:80%;
      		  background:#1c1f1f;
      		  height:33px;
      		  border-radius:5px;
      		  margin-top:11px;
      		  margin-left:2.5%;
      		  padding-left:2%;
      		  box-sizing:border-box;
                    color:#fff;
      		  }
		
      		  .searBtn{
      		    margin-top:10px;
      		    width:15%;
      		    height:33px;
      		    float:left;
      		    line-height:33px;
      		    font-size:1.2em;
      		    background:url("../../assets/module/u2100.png") no-repeat 10%;
      		    background-size:28%;
      		    padding-left:6%;
      		    box-sizing:border-box;
		    text-decoration: none;
      		}
    }
    .title{
    	width:102%;
    	height:3.5em;
    	line-height:3.5em;
    	background:url("../../assets/module/u12.png") no-repeat;
    	background-size:100% 100%;
    	margin-left:-1%;
      margin-top:-1em;

    	p{
    		height:3.5em;
    		width:6%;
    		text-align:center;
    		float:left;
    		line-height:3em;
    	}
    	.break{
    		width:90%;
    		text-align:left;
            color:#ffffff;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
    	}
    }
}
</style>
