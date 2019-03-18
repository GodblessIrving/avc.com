<template>
    <div v-show="Email" class='masklayer'>
	<div class="mess-content">
		<div class="top-title">
			<p>消息详情</p>
            			<span @click="closeEmail()" style="font-size:2.2em">×</span>
		</div>
		<div class="content">
			<span>消息内容：</span>
			<p class="messcontent" style="-webkit-box-orient: vertical;" :title="message.content">{{message.content}}</p>
		</div>
		<div class="content">
			<span>消息来源：</span>
			<p>{{message.fname?message.fname:'管理员'}}</p>
		</div>
		<div class="content">
			<span>发布时间：</span>
			<p>{{message.createtime}}</p>
		</div>
		<div class="closeBox">
			<a href="javascript:void(0)" @click="closeEmail()">关闭</a>
		</div>
	</div>
    </div>
</template>
<script type="text/ecmascript-6">
export default{
	name:"mess-content",
	props:["Email","message"],
	methods:{
	   closeEmail(){
	       this.$emit('closeEmail','from MessContent');
	   }
	}
}
</script>
<style lang="scss">
.mess-content{
	width:50em;
	height:auto;
	padding:0 0.4em 3em;
	position:absolute;
	top:15em;
	left:50%;
	margin-left:-25em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;
	.top-title{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding:0 2em;

            p{
                float:left;
            }
            span{
                float:right;
                font-size:1.4em;
                cursor:pointer;
            }
        }
        .content{
        	padding:2em 2em 0;
        	overflow:hidden;
        	width:100%;
        	span{
        		float:left;
        		width:15%;
        		color:#0099ff;
        	}
        	p{
        		float:right;
        		width:80%;
        	}
            .messcontent{
                max-height:10em;
                overflow-y:auto;
                word-wrap: break-word; 
                word-break: normal;
            }
        }
        .closeBox{
        	width:100%;
        	margin-top:2em;
        	text-align:center;
        	a{
        		padding:0.5em 1em;
        		color:#fff;
        		background-color:#0099ff;
        		border-radius:3px;
        		text-decoration: none;
        	}
        }
}
</style>