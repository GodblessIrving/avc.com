<template>
	<div class="compostask">
		<div class="operation-btn">
			<label for="input6">
				<input type="checkbox" id="input6">全选
			</label>
			<a href="javascript:void(0)" class="blue">删除</a>
			<p class="sear-in">
                			<input type="text" placeholder="搜索我的剪辑视频">
            			</p>
		</div>
		<div class="excel">
			<table cellpadding="0" cellspacing="0" style="table-layout:fixed">
				<thead>
					<tr>
						<th width="20">名称</th>
						<th width="5">分类</th>
						<th width="5">时长</th>
						<th width="15">标签</th>
						<th width="15">内容简介</th>
						<th width="10">状态</th>
						<th width="20">操作</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<label for="input1">
                                                                			<input type="checkbox" id="input1">
                                                                			<span class="img-s img-big">
                                                                        				<img src="../../assets/videoPlay/pin.png" width="100%">
                                                                			</span>
                                                                			<span class="text">
                                                                				跟谁学-职称英语简单看，李春化老师为您解析
                                                                			</span>
                                                        			</label>
						</td>
						<td>英语</td>
						<td>34'36''</td>
						<td>名师、大咖、李春化、职称</td>
						<td>跟谁学是在线教育行业的旗舰，未来在中国教育市场等新兴经济中占有</td>
						<td class="orange">合成转码中</td>
						<td></td>
					</tr>
					<tr>
						<td>
							<label for="input2">
                                                                			<input type="checkbox" id="input2">
                                                                			<span class="img-s img-big">
                                                                        				<img src="../../assets/videoPlay/pin.png" width="100%">
                                                                			</span>
                                                                			<span class="text">
                                                                				跟谁学-职称英语简单看，李春化老师为您解析
                                                                			</span>
                                                        			</label>
						</td>
						<td>英语</td>
						<td>34'36''</td>
						<td>名师、大咖、李春化、职称</td>
						<td>跟谁学是在线教育行业的旗舰，未来在中国教育市场等新兴经济中占有</td>
						<td class="orange">审核中</td>
						<td></td>
					</tr>
					<tr>
						<td>
							<label for="input3">
                                                                			<input type="checkbox" id="input3">
                                                                			<span class="img-s img-big">
                                                                        				<img src="../../assets/videoPlay/pin.png" width="100%">
                                                                			</span>
                                                                			<span class="text">
                                                                				跟谁学-职称英语简单看，李春化老师为您解析
                                                                			</span>
                                                        			</label>
						</td>
						<td>英语</td>
						<td>34'36''</td>
						<td>名师、大咖、李春化、职称</td>
						<td>跟谁学是在线教育行业的旗舰，未来在中国教育市场等新兴经济中占有</td>
						<td class="red">审核失败</td>
						<td>
							<span class="td-del">删除</span>
						</td>
					</tr>
					<tr>
						<td>
							<label for="input4">
                                                                			<input type="checkbox" id="input4">
                                                                			<span class="img-s img-big">
                                                                        				<img src="../../assets/videoPlay/pin.png" width="100%">
                                                                			</span>
                                                                			<span class="text">
                                                                				跟谁学-职称英语简单看，李春化老师为您解析
                                                                			</span>
                                                        			</label>
						</td>
						<td>英语</td>
						<td>34'36''</td>
						<td>名师、大咖、李春化、职称</td>
						<td>跟谁学是在线教育行业的旗舰，未来在中国教育市场等新兴经济中占有</td>
						<td class="red">合成转码失败</td>
						<td>
							<span class="compos-btn">合成</span>
							<span class="eidt">编辑</span>
							<span class="td-del">删除</span>
						</td>
					</tr>
					<tr>
						<td>
							<label for="input5">
                                                                			<input type="checkbox" id="input5">
                                                                			<span class="img-s img-big">
                                                                        				<img src="../../assets/videoPlay/pin.png" width="100%">
                                                                			</span>
                                                                			<span class="text">
                                                                				跟谁学-职称英语简单看，李春化老师为您解析
                                                                			</span>
                                                        			</label>
						</td>
						<td>英语</td>
						<td>34'36''</td>
						<td>名师、大咖、李春化、职称</td>
						<td>跟谁学是在线教育行业的旗舰，未来在中国教育市场等新兴经济中占有</td>
						<td class="green">完成</td>
						<td>
							<span class="eidt">编辑</span>
							<span class="td-del">删除</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script  type="text/ecmascript-6">
export default {
	name:"compostask"
}
</script>

<style lang="scss">
	.compostask{
		width:100%;

		.operation-btn{
			padding-top:1em;
			border-bottom:1px dashed #fff;
			overflow:hidden;

			label{
				margin-left:2em;
				cursor:pointer;
				input{
					position:relative;
					top:2px ;
					left:-1em;
				}
			}

			a{
				color:#fff;
				text-decoration: none;
				padding:0.4em 2em;
				border-radius:3px;
				margin-left:3em;
			}
			.sear-in{
                    			width:40%;
                   			 height:4em;
                   			 float:right;
                   			 background:url("../../assets/module/u2098serch.png") no-repeat;
                   			 background-size:100% 100%;
                   			 position:relative;
                   			 top:-0.4em;
			
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
		}
		.excel{
			width:100%;
			table{
				width:100%;

				th:first-child{
					text-align:center  !important;
				}
				tr,th,td{
                                			background:none !important;
                                			border:none !important;
                            		}
                            		td:last-child{
                                			text-align:right;
                                			padding-right:2em;
                               			 box-sizing:border-box;
                            		}

                            		td{
                                			height:3em;
                                			overflow:hidden;
                                			padding: 0 5px;
                               			 label{
                                        			position:relative;
                                        			top:0.5em !important;
                                        			.img-s{
                                                				top:0.4em !important;
                                        			}
                                        			.img-big{
                                            				width:5em !important;
                                            				height:5em !important;
                                       			 }
                                			}

                            		}
			}
		}
	}
</style>