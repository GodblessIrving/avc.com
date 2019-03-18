<template>
  <div class="task-view">
      <!-- <slide-nav></slide-nav> -->
      <task-info></task-info>
  </div>
</template>

<script>
// import SlideNav from "../components/SlideNav"
import TaskInfo from "../components/task/TaskInfo"
export default {
  name: 'task-view',
  components:{TaskInfo}
}
</script>

<style scoped>
	.task-view{
		width:100%;
		overflow:hidden;
		position:relative;
      		top:-85em;
      		left:5%;
	}

</style>