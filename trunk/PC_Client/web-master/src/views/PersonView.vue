<template>
  <div class="person-view">
	<!-- <slide-nav></slide-nav> -->
	<person></person>
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav";
import person from "../components/person/person"
export default {
  name: 'person-view',
  components: {person}
}
//
</script>

<style lang="scss">
.person-view{
	width:100%;
	height:85em;
	top:-85em;
	left:5%;
}
</style>