<template>
<div v-show="isBlock" class="masklayer">
	<div class="move-to">
		<div class="move-title">
			<p class="title-name">{{this.message}}</p>
			<p class="title-close" @click="closeMove()" style="font-size:2.5em">×</p>
		</div>
		<div class="tree">
			<el-tree :data="data"
			 :props="defaultProps"
			 show-checkbox
			 node-key="id"
			 ref="tree"
			 :check-strictly = "true"
			 @check-change="handleNodeClick"></el-tree>
		</div>
		<div class="newflie" v-show="isAdd">
			<span></span>
			<input type="text" v-model="flodername" maxlength="200">
			<a href="javascript:void(0)" class="sure" @click="newfloder()"></a>
			<a href="javascript:void(0)" class="no" @click="hideAdd()"></a>
		</div>
		<div class="bottom-btn">
			<a href="javascript:void(0)" class="blue new-folder" @click="showAdd()">新建文件夹</a>
			<a href="javascript:void(0)" class="blue cancel-btn" @click="closeMove()">取消</a>
			<a href="javascript:void(0)" class="blue sure-btn" @click="sureMove">确定</a>
		</div>
		<alert-tip :isShowtip="isShowtip" :message="mess" @closeTipEvent="closetip"></alert-tip>
	</div>
</div>
</template>
<script  type="text/ecmascript-6">
import alertTip from "../alertTip"
	export default {
		name:"move-to",
		data(){
			return{
				selectedOptions:'',
				val:[],
				isAdd:false,
				flodername:'',
				fid:0,
				data:[],
				defaultProps:{
					children:'children',
					label:'label'
				},
				isShowtip:false,
				mess:'',
			}
		},
		props:["isBlock","message","ids","resType"],
		computed:{
		       uid:function(){
                                return this.$store.state.user.uid;
                            }
		},
		components:{alertTip},
		watch:{
			isBlock(val,oldVal){
				if(val){
					if(this.resType == 6){//只有公共存储会给使用这个字段
						this.getCommunalFolder();
					}else{
						this.getAllFloders();//写在mounted里，发现最新添加的文件夹看不到;
					}
				}
			}
		},
 		methods: {
 		  handleNodeClick(value) {
      		   var array = this.$refs.tree.getCheckedNodes();
      		   //目标文件夹只允许一个
      		   this.val=[];
      		   if(array.length > 0){
      		   	this.val.push(array[array.length-1]);
      		  	if(array.length>1){
      		  		this.$refs.tree.setCheckedNodes(this.val);     		   	
      		  	}
      		   }
      		 },
      		 closetip(){
      		 	this.isShowtip = false;
      		 },
      		 getAllFloders(){
                            this.$http.get('/MyResources/GetMyFolders',{
                                params:{
                                    uid:this.uid
                                }                                   
                            }).then(res=>{
                                var d = $.parseJSON(res.data);
                                if(d){
                                    if(d.msgid == 200){
                                        let floders = d.data; 
                                        //过滤要移动的文件夹
                                        if(this.ids){
	                                       for(let i=0;i<floders.length;i++){
	                                        	let folder=floders[i];
	                                        	if(this.ids.contain(folder.id)){
	                                        		floders.splice(i, 1);
	                                        		i--;
	                                        	}
	                                        }
                                        }
                                        var tree = this.toTree(floders, 0);
                                        this.data = tree;
                                        this.val=[];
                                    }else{
                                        console.log(d.msg);
                                    }
                                }
                            }).catch(err=>{
                                console.log(err);
                            })
                        },
                        toTree(floders, fid) {
                           var tree = [];
                           var temp;
                           for (var i = 0; i < floders.length; i++) {
                             if (floders[i].fid == fid) {
                               var obj = floders[i];
                               obj.label = floders[i].name;
                               obj.value = floders[i].id;
                               temp = this.toTree(floders, floders[i].id);
                               if (temp.length > 0) {
                                 obj.children = temp;
                               }
                               tree.push(obj);
                             }
                           }
                           return tree;
                         },
      		 showAdd(){
      		 	this.flodername = '';
      		 	this.isAdd = true;
      		 },
      		 hideAdd(){
      		 	this.isAdd = false;
      		 },
      		 newfloder(){
      		 	if(this.val.length > 0){
      		 		this.fid = this.val[0].id;
      		 	}
      		 	this.fid = 0;
      		 	this.$http.post('/MyResources/NewFolder',{
      		 		uid:this.uid,
      		 		name:this.flodername,
      		 		fid:this.fid,
      		 	}).then(res=>{
      		 		var d = $.parseJSON(res.data);
      		 		if(d.msgid==200){
      		 			if(this.resType == 6){
      		 				this.getCommunalFolder()
      		 			}else{
      		 				this.getAllFloders();	
      		 			}    		 		      
      		 		      this.isAdd = false;
      		 		}else{
	      		 		this.isShowtip = true;
	      		 		this.mess=d.msg;
      		 		}
      		 	})
      		 },
      		 sureMove(){
      		 	if(this.val.length == 0){
      		 		this.isShowtip = true;
      		 		this.mess= "请选择目标文件夹";
      		 		return;
      		 	}
      		 	var node=this.val[0];
      		 	if(this.resType){
      		 		this.$emit('child-say',node.id,node.type);
      		 	}else{
      		 		this.$emit('child-say',node.id);
      		 	}
      		 	
      		 },
 		  closeMove(){
 		  	this.isAdd = false;
 		  	this.$emit('closeNewEvent');
 		  },
 		  getCommunalFolder(){
                            this.$http.get('/MyResources/GetCommunalFolder'                           
                            ).then(res=>{
                                var d = $.parseJSON(res.data);
                                if(d){
                                    if(d.msgid == 200){
                                        let cfolder = d.data.cfolder; 
                                        let folder=d.data.folder; 
                                        //默认文件夹不允许向里面复制文件
                                        for(let i=0;i<folder.length;i++){
                                        	let fo=folder[i];
                                        	if(fo.fid>0&&fo.default==0){
                                        		folder.splice(i, 1);
                                        		i--;
                                        	}
                                        }
                                        //过滤要移动的文件夹
                                        if(this.ids){
	                                       for(let i=0;i<cfolder.length;i++){
	                                        	let _folder=cfolder[i];
	                                        	if(this.ids.contain(_folder.id)){
	                                        		cfolder.splice(i, 1);
	                                        		i--;
	                                        	}
	                                        	_folder.default=1;
	                                        }
                                        }
                                        var tree = this.toTree(cfolder, 1);
                                        var tree2=this.toTree(folder, 0);
                                        this.data=tree.concat(tree2);
                                        this.val=[];
                                    }else{
                                        console.log(d.msg);
                                    }
                                }
                            }).catch(err=>{
                                console.log(err);
                            })
                        },
 		},
	}
</script>
<style lang="scss">
	.move-to{
		width:40em;
		height:auto;
		position:fixed;
		left:50%;
		margin-left:-20em;
		margin-top:-15em;
		top:50%;
		background:url("../../assets/module/u10.png") no-repeat;
		background-size:100% 100%;
		padding: 0 0.3em;
		z-index:10;
		.el-tree-node__label{
                  color:#fff;
                  width:90%;
                  overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
             }
		.move-title{
			width:100%;
			height:3em;
			background-color:#0099ff;
			padding:0 2em;
			line-height:3em;
			.title-name{
				float:left;
				font-size:1.2em;
			}
			.title-close{
				float:right;
				cursor:pointer;
				font-size:1.5em;
				font-weight:700;
			}
		}
		.tree{
			padding: 0 2em 4em;
			margin-top:2em;
			height:20em;
			overflow-y:auto;
		}
		.newflie{
			width:100%;
			height:3em;
			padding-left:2em;
			span{
				display:inline-block;
				width:2em;
				height:2em;
				background:url("../../assets/resouce/u825.png") no-repeat left bottom;
				background-size:80%;
				position:relative;
				top:0.3em;
			}
			input{
				width:8em;
				height:1.5em;
				border:1px solid #666;
				background-color:#fff;
				color:#333;
			}
			a{
				display:inline-block;
				width:1.5em;
				height:1.5em;
				position:relative;
				top:0.3em;
			}
			.sure{
				background:url("../../assets/resouce/udui.png") no-repeat left bottom;
				background-size:90%;
			}
			.no{
				background:url("../../assets/resouce/ucuo.png") no-repeat left bottom;
				background-size:90%;
			}
		}
		.bottom-btn{
			height:4em;
			width:95%;
			margin:0 auto;
			border-top:1px dashed #fff;

			a{
                                    color:#fff;
                                     text-decoration: none;
                                     margin-right:1em;
                                     border-radius:3px;
                                     padding:0.3em 1em;
                                     margin-top:0.8em;
                                     background-repeat:no-repeat;
                                     background-position:5px center;
                                }

                                .new-folder{
                                	     padding-left:2em !important;
                                	     float:left;
                                }
                                .cancel-btn,.sure-btn{
                                	    float:right;
                                }
		}
	}
</style>