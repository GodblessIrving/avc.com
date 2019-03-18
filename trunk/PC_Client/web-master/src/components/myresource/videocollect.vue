<template>
	<div class="videocollect">
		<p class="sear-in">
                		<input type="text" placeholder="搜索我的收藏视频">
            		</p>
            		<div class="video-info">
            			<ul>
            				<li>
            					<div class="info-left">
            						<img src="../../assets/module/u178.jpg" width="100%">
            					</div>
            					<div class="info-right">
            						<p>
            							<span>视频名称：</span>
            							<span>跟谁学-职称英语简单看，李春化老师为您解析</span>
            						</p>
            						<p>
            							<span>时长：</span>
            							<span>34'36''</span>
            						</p>
            						<p>
            							<span>分辨率：</span>
            							<span>1280 * 720</span>
            						</p>
            					</div>
            				</li>
            				<li>
            					<div class="info-left">
            						<img src="../../assets/module/u178.jpg" width="100%">
            					</div>
            					<div class="info-right">
            						<p>
            							<span>视频名称：</span>
            							<span>跟谁学-职称英语简单看，李春化老师为您解析</span>
            						</p>
            						<p>
            							<span>时长：</span>
            							<span>34'36''</span>
            						</p>
            						<p>
            							<span>分辨率：</span>
            							<span>1280 * 720</span>
            						</p>
            					</div>
            				</li>
            				<li>
            					<div class="info-left">
            						<img src="../../assets/module/u178.jpg" width="100%">
            					</div>
            					<div class="info-right">
            						<p>
            							<span>视频名称：</span>
            							<span>跟谁学-职称英语简单看，李春化老师为您解析</span>
            						</p>
            						<p>
            							<span>时长：</span>
            							<span>34'36''</span>
            						</p>
            						<p>
            							<span>分辨率：</span>
            							<span>1280 * 720</span>
            						</p>
            					</div>
            				</li>
            				<li>
            					<div class="info-left">
            						<img src="../../assets/module/u178.jpg" width="100%">
            					</div>
            					<div class="info-right">
            						<p>
            							<span>视频名称：</span>
            							<span>跟谁学-职称英语简单看，李春化老师为您解析</span>
            						</p>
            						<p>
            							<span>时长：</span>
            							<span>34'36''</span>
            						</p>
            						<p>
            							<span>分辨率：</span>
            							<span>1280 * 720</span>
            						</p>
            					</div>
            				</li>
            				<li>
            					<div class="info-left">
            						<img src="../../assets/module/u178.jpg" width="100%">
            					</div>
            					<div class="info-right">
            						<p>
            							<span>视频名称：</span>
            							<span>跟谁学-职称英语简单看，李春化老师为您解析</span>
            						</p>
            						<p>
            							<span>时长：</span>
            							<span>34'36''</span>
            						</p>
            						<p>
            							<span>分辨率：</span>
            							<span>1280 * 720</span>
            						</p>
            					</div>
            				</li>
            			</ul>
            		</div>
	</div>
</template>
<script  type="text/ecmascript-6">
	export default{
		name:"videocollect"
	}
</script>
<style lang="scss">
	.videocollect{
		width:100%;
		background-color:#303030;
                	border:1px solid #282828;
                	border-radius:0 0 3px 3px;
                	height:44em;
                	padding:1em;

                	.sear-in{
                    			width:100%;
                   			 height:4em;
                   			 background:url("../../assets/module/u2098serch.png") no-repeat;
                   			 background-size:100% 100%;
			
                   			 input{
                   			   width:95%;
                   			   height:2.5em;
                   			   margin:0.5em 0.8em;
                   			   background-color:#1c1f1f;
                   			   border:none;
                   			   background-image:url("../../assets/module/u2100.png");
                   			   background-size:8%;
                   			   background-repeat:no-repeat;
                   			   border-radius:5px;
                   			   color:#fff;
                   			   background-position:right center;
                   			}
               		 }
               	.video-info{
               		padding:1em 0;
               		height:36em;
               		overflow-y:auto;
               		width:100%;

               		ul{
               			width:100%;
               			overflow:hidden;

               			li{
               				width:100%;
               				overflow:hidden;
               				.info-left{
               					width:40%;
               					height:8em;
               					overflow:hidden;
               					float:left;
               					margin-right:5%;
               				}
               				.info-right{
						float:left;
						width:55%;
						height:8em;

						p{
							width:100%;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
               				}
						
               			}
               		}
               	}
	}
</style>