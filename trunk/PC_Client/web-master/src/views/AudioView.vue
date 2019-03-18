<template>
  <div class="video-view">
	<!-- <slide-nav></slide-nav> -->
	<audio-right :id="this.$route.query.id"></audio-right>
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav"
import AudioRight from "../components/audiodetil/AudioRight";
export default {
  name: 'video-view',
  components: {AudioRight},
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