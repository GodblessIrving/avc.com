<template>
  <div class="video-view">
	<!-- <slide-nav></slide-nav> -->
	<video-right :resid='this.$route.query.id' ></video-right>
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav"
import VideoRight from "../components/videodetil/VideoRight";
export default {
  name: 'video-view',
  components: {VideoRight},
}
//
</script>

<style lang="scss">
.video-view{
	width:100%;
	overflow:hidden;
	position:relative;
      top:-85em;
      left:5%;
  }
</style>