<template>
  <div class="word-view">
	<!-- <slide-nav></slide-nav> -->
	<word-right :id="this.$route.query.id"></word-right>
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav"
import WordRight from "../components/word/WordRight";
export default {
  name: 'video-view',
  data(){
  	return{
  		id:'',
            md:'',
  	}
  },
  mounted:function(){
  	this.id = this.$route.params.id;
      this.md = this.$route.params.md5;
  },
  components: {WordRight}
}
//
</script>

<style lang="scss">
.word-view{
	width:100%;
	overflow:hidden;
	position:relative;
      top:-85em;
      left:5%;
}
</style>