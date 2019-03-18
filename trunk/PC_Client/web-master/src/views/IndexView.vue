<template>
  <div class="index-view">
  	<router-view></router-view>
	<!-- <slide-nav></slide-nav> -->
	<resource-content :type="this.$route.query.type"></resource-content>
	<right-content></right-content>
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav"
import ResourceContent from "../components/resource/ResourceContent.vue"
import RightContent from "../components/resource/RightContent"
export default {
  name: 'index-view',
  components: {ResourceContent,RightContent},
}
//
</script>

<style lang="scss">
.index-view{
	width:100%;
	overflow:hidden;
      height:85em;
	// background:#262d35;
	position:relative;
	top:-85em;
	left:5%;
}
</style>