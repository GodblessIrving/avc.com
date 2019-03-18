<template>
	<div class="live-rightlist">
		<p class="title">当前频道直播课程</p>
		<div class="now-list">
			<img src="../../assets/resouce/123.png" width="100%">
			<!-- <ul>
				<li class="orange">
					<h4>中国建筑史赏析</h4>
					<p>
						<span>土木与工程学院</span>
						<span class="right">正在直播..</span>
					</p>
					<p>
						<span style="margin-right:1em;">李学东</span>
						<span>副教授</span>
						<span class="right">08:30-09:30</span>
					</p>
				</li>
				<li class="blue">
					<h4>中国建筑史赏析</h4>
					<p>
						<span>土木与工程学院</span>
						<span class="right">即将开始..</span>
					</p>
					<p>
						<span style="margin-right:1em;">李学东</span>
						<span>副教授</span>
						<span class="right">08:30-09:30</span>
					</p>
				</li>
				<li class="blue">
					<h4>中国建筑史赏析</h4>
					<p>
						<span>土木与工程学院</span>
						<span class="right">即将开始..</span>
					</p>
					<p>
						<span style="margin-right:1em;">李学东</span>
						<span>副教授</span>
						<span class="right">08:30-09:30</span>
					</p>
				</li>
			</ul> -->
		</div>
	</div>
</template>
<script>
export default {

}	
</script>
<style lang="scss">
.live-rightlist{
	float:left;
	width:29%;
	height:83em;
	margin-left:1em;
	background:url("../../assets/module/u10.png") no-repeat;
    	background-size:100% 100%;
    	margin-top:6px;
    	padding:2em;
    	.orange{
    		background-color:#ff9900;
    	}
    	.blue{
    		background-color:#0099ff;
    	}
    	.title{
    		padding-left:3em;
    		height:4em;
    		font-size:1.2em;
    		line-height:4.3em;
    		background:url("../../assets/live/u91.png") no-repeat left center;
    		background-size:7%;
    	}
    	.now-list{
    		width:100%;
    		height:80em;
    		overflow-y:auto;
    		padding-top:5em;
    		text-align:center;
    		ul{
    			width:100%;
    			height:auto;
    			li{
			   width:100%;
			   height:10em;
			   border-radius:5px;
			   padding:1em;
			   margin-bottom:1.5em;
			   color:#fff;

			   h4{
			   	margin-bottom:1em;
			   	font-size:1.4em;
			   	font-weight:700;
			   }
			   p{
			   	margin-bottom:1em;
			   }
    			}
    		}
    	}
}
</style> 