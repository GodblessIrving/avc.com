<template>
<div v-if="isNew" class="masklayer">
	<div class="newmess">
		<div class="top-title">
			<p>新建</p>
            			<span @click="closeNew()" style="font-size:2.2em">×</span>
		</div>
		<div class="content">
			<div class="left-content">
				<p class="litle-little">可选用户：</p>
				<div class="chose-user">
					<div class="search">
   					  <input type="text" class="search-in" placeholder="模糊搜索用户名" v-model="name">
   					  <a href="javascript:void(0)" class="searBtn" @click="searchUser">搜索</a>
   					</div>
   					  <el-tree :data="data"
                                  :props="defaultProps"
                                  default-expand-all
                                  show-checkbox
                                  node-key="id"
                                  ref="tree"
                                  @check-change="getCheckedKeys()">
                               </el-tree>
				</div>
			</div>
			<div class="cont-right">
				<div class="scope">
					<p class="litle-little">发送范围：</p>
					<div class="scope-box">
                                  <ul class="userList"></ul>
                               </div>
				</div>
				<div class="scope" style="margin-top:2em;">
					<p class="litle-little">消息内容：</p>
					<textarea name="" placeholder="请输入消息内容" maxlength="2000" v-model="message" @input="watchLength"></textarea>
                              <p style="text-align:right"><em>{{length}}</em>/2000</p>
				</div>
			</div>
		</div>
		 <div class="edit-btn">
           			<a href="javascript:void(0)" @click="sendMessage()">发送</a>
           			<a href="javascript:void(0)" @click="closeNew()">取消</a>
        	 </div>
              <alert-tip :isShowtip="isShowtip" :message="text" @closeTipEvent="closeTip">
              </alert-tip>
	</div>
</div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../alertTip"
export default{
name:"newmess",
data() {
      return {
       defaultProps:{
          children:'children',
          label:'label'
        },
        val:[],
        data: [{
          id: 0,
          label: '全部',
          children: []
        }],
        name:'',
        childrenData:[],
        ids:[],
        message:'',
        isShowtip:false,
        text:'',
        length:0,
      }
    },
    props:["isNew"],
    components:{alertTip},
    computed:{
                uid:function(){
                    return this.$store.state.user.uid;
                }
    },
    mounted:function(){
      this.getAlluser();
    },
    watch:{
      isNew:function(){
        if(!this.isNew){
            this.message = '';
            this.length = 0;
            this.ids = [];
            this.name = '';
            this.getAlluser();
            $(".userList").empty();
            this.$refs.tree.setCheckedKeys([]);
        }
      }
    },
    methods: {
      // 获取所有的用户
      getAlluser(){
        this.$http.get('/User/GetUsername',{
          params:{
            name:this.name
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
                this.childrenData = d.data;
                this.data[0].children = this.childrenData;
                this.$refs.tree.setCheckedKeys([]);
            }else{
               console.log(d.msg);
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 关闭新建消息弹窗
      closeNew(){
        	this.$emit("closeNewMess");           
      },
      //搜索用户
      searchUser(){
        this.getAlluser();
      },
      // 选择用户
      getCheckedKeys(){
        $(".userList").empty();
        this.ids = [];
        this.val = this.$refs.tree.getCheckedNodes(true);
          if(this.val.length >= 1){
            for(var i = 0; i<this.val.length; i++){
            if(this.val[i].children){
              this.val = this.childrenData;
            }
              var labelling = '<li class="adduser">'+this.val[i].label+'</li>';
              $(".userList").append(labelling);
              this.ids.push(this.val[i].id);
           }
        }
      },
      // 消息发送
      sendMessage(){
        if(this.ids.length < 1){
            this.isShowtip = true;
            this.text = '请选择用户';
            return
        }else if(!this.message){
            this.isShowtip = true;
            this.text = '请填写消息';
            return
        }
        this.$emit("saveTipEvent",this.ids,this.message);
      },
      // 消息长度提示
      watchLength(){
        this.length = this.message.length;
      },
      // 关闭提示
      closeTip(){
        this.isShowtip = false;
      }
    }
}
</script>
<style lang="scss">
.newmess{
	width:60em;
	height:auto;
	padding:0 0.4em 3em;
	position:absolute;
	top:5em;
	left:50%;
	margin-left:-30em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;
      em{
        font-style:normal;
        color:#0099ff;
      }
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
        	width:100%;
        	padding:2em;
        	overflow:hidden;
        	.litle-little{
        		width:100%;
        		color:#0099ff;
        		height:1.5em;
        	}

        	.left-content{
        		width:46%;
        		height:28em;
        		float:left;
        	}
        	.chose-user{
        		width:100%;
        		height:34.2em !important;
        		border:1px solid #eee;
        		border-radius:5px;
        		overflow-y:auto;
        		.search{
 		    height:60px;
 		    width:96%;
 		    margin:10px 2%;
 		    display:inline-block;
 		    background:url("../../assets/module/u2098serch.png") no-repeat;
 		    background-size:100% 100%;

 		    .search-in{
 		      float:left;
 		      width:75%;
 		      background:#1c1f1f;
 		      height:33px;
 		      border-radius:5px;
 		      margin-top:11px;
 		      margin-left:2.5%;
 		      padding-left:2%;
 		      }

 		      .searBtn{
 		        margin-top:10px;
 		        width:20%;
 		        height:33px;
 		        float:left;
 		        line-height:33px;
 		        font-size:1.2em;
 		        background:url("../../assets/module/u2100.png") no-repeat 15%;
 		        background-size:40%;
 		        padding-left:9%;
 		    }
 		 }
 		 .el-tree{
 		 	background-color:transparent !important;
 		 	color:#fff;
 		 }
 		 .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover{
 		 	background-color:#31495a;
 		 }
        	}
        	.cont-right{
        		float:right;
        		width:50%;
		.scope-box{
			width:100%;
			height:15em !important;
			overflow-y:auto;
			border:1px solid #eee;
			border-radius:5px;
			padding:1em;
                  .userList{
                     width:100%;
                     overflow:hidden;
                     li{
                       padding:0.2em 0.5em;
                       background-color:#0099ff;
                       border-radius:3px;
                       float:left;      
                       margin-right:1em; 
                       margin-bottom:1em;
                     }
                   }
		}
		textarea{
			width:100%;
			height:15em;
			border:1px solid #eee;
			border-radius:5px;
			padding:1em;
			background:none;
			resize: none; 
		}
        	
        	}
        }
        .edit-btn{
            width:100%;
            text-align:center;
            margin-top:3em;
            clear:both;
            a{
                display:inline-block;
                color:#fff;
                text-decoration: none;
                width:4em;
                height:2em;
                line-height:2em;
                text-align:center;
                background-color:#0099ff;
                margin-right:3em;
                border-radius:3px;
            }
            a:nth-child(2){
                background-color:#666666;
            }
        }
}
</style>