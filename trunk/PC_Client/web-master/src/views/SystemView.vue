<template>
  <div class="system-view">
      <!-- <slide-nav :logonow="logonow"></slide-nav> -->
      <system-info @saveEnable="listen"></system-info>
  </div>
</template>

<script>
import SlideNav from "../components/SlideNav"
import SystemInfo from "../components/system/SystemInfo"
export default {
  name: 'system-view',
  data(){
  	return{
  		logonow:1,
  	}
  },
  components:{SlideNav,SystemInfo},
  methods:{
  	listen(){
  		this.logonow = this.logonow+1;
  	},
  }
}
</script>

<style scoped>
	.system-view{
		width:100%;
		overflow:hidden;
		position:relative;
            top:-85em;
            height:85em;
            left:5%;
	}

</style>