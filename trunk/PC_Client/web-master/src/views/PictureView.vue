<template>
  <div class="video-view">
	<!-- <slide-nav></slide-nav> -->
	<picture-right :id="this.$route.query.id" :foid="this.$route.query.foid"></picture-right>
  </div>
</template>
<script>
// import SlideNav from "../components/SlideNav"
import PictureRight from "../components/picture/PictureRight"
export default {
  name: 'video-view',
  components: {PictureRight},
  mounted:function(){
  	console.log(this.$route.query.id)
  },
}
</script>
<style lang="scss">
.video-view{
	width:100%;
	overflow:hidden;
      height:85em;
	position:relative;
      top:-85em;
      left:5%;
}
</style>