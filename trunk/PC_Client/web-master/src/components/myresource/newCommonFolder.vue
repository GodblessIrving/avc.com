   <template>
   <div v-show="isNew" class="masklayer">
	<div class="newmess">
		<div class="top-title">
			<p>{{title}}文件夹</p>
            	<span @click="closeNew()" style="font-size:2em;">×</span>
		</div>
             <p>
                  <p class="litle-name">文件夹名称：<input placeholder="请输入文件夹名称.."  type="text" 
                  v-model="foldername" maxlength="200" /></p>
             </p>
		<div class="content">
			<div class="left-content">
				<p class="litle-little">可选用户：</p>
				<div class="chose-use">
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
					<p class="litle-little">已授权用户：</p>
					<div class="scope-box">
                              <ul class="userList"></ul>
                            </div>
				</div>
			</div>
		</div>
		 <div class="edit-btn">
           			<a href="javascript:void(0)" @click="saveCommon">保存</a>
           			<a href="javascript:void(0)" @click="closeNew()">取消</a>
        		</div>
	</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
name:"newcommon",
data() {
      return {
        foldername:'',
        data: [{
          id: 0,
          label: '全部',
          children: []
        }],
        roles:[],
        users:[],
        name:'',
        uids:[],
        title:'新建',
        defaultProps:{
          children:'children',
          label:'label'
        },
      };
    },
    props:["isNew","foid"],
    watch: {
      isNew(val){
          if (val) {
            //获取共享文件夹的信息
             this.getAlluser();
            this.getFolderInfo(this.foid);
          }
      }
    },
    mounted:function(){
      this.getAlluser();
    },
    methods: {
      //region 公开事件
      closeNew(){
        this.foldername='';
        this.filterText = '';
        this.name = "";
        this.title='新建';
        $('.scope-box span').remove();
        this.uids=[];
        this.$refs.tree.setCheckedKeys([],false);

      	  this.$emit("closeEvent");
      },
      saveCommon(){
        this.$emit("saveEvent",this.foldername,this.uids);
        this.closeNew();
      },
      searchUser(){
        this.getAlluser();
      },
      //#endregion

      //树形控件相关
      // loadNode(node, resolve) {      
      //   var _this=this;
      //   console.log(node);
      //   if (node.level == 0) {
      //       return resolve([{id:0,name: '全部',type:'root' }]);
      //   }else if (node.level==1) {
      //       resolve(this.roles);
      //   }else if (node.level==2){
      //      setTimeout(() => {
      //           this.getUsers(node.data.id,function(){
      //             resolve(_this.users);
      //           });           
      //       }, 5);
      //   }else{
      //       return resolve([]);
      //   } 
      // },
      //选中事件
      // handleCheckChange(data, checked, indeterminate){
      //   if (data.type=='user') {
      //     if (checked) {
      //       if(!this.uids.contain(data.id)){
      //         var span='<span data-id="'+data.id+'">'+data.name+'</span>';
      //         $('.scope-box').append(span);
      //         this.uids.push(data.id);
      //       }
      //     }
      //     else{
      //         $('span[data-id='+data.id+']').remove();
      //         for(var i=0;i<this.uids.length;i++){
      //           var id=this.uids[i];
      //               if (id==data.id) {
      //                 this.uids.splice(i, 1);
      //                }
      //          }
      //     }
      //   }
      // },
      // getRoles(){
      //   this.$http.get('/myResources/GetCommunalRoles'
      //   ).then(res=>{
      //           var d=$.parseJSON(res.data);
      //           if (d) {
      //               if (d.msgid==200) {
      //                   var roles=d.data;
      //                   var _this=this;

      //                   for(var i=0;i<roles.length;i++){
      //                         let role=roles[i];
      //                         role.type='role';
      //                         this.roles.push(role);
      //                   }
      //               }else{
      //                   console.log(d.msg);
      //               }
      //           }
      //       }).catch(err=>{
      //           console.log(err);
      //      });
      // },
      // getUsers(id,callback){
      //   this.$http.get('/myResources/GetUserByRole',{
      //         params:{
      //             id:id
      //         }
      //   }).then(res=>{
      //           var d=$.parseJSON(res.data);
      //           if (d) {
      //               if (d.msgid==200) {
      //                   var arr=d.data;
      //                   this.users=[];
      //                   for(var i=0;i<arr.length;i++){
      //                         var a=arr[i];
      //                         var user={
      //                             id:a.id,
      //                             name:a.username,
      //                             type:'user'
      //                         }
      //                         this.users.push(user);
      //                   }
      //                   if (callback) {
      //                     callback();
      //                   }
      //               }else{
      //                   console.log(d.msg);
      //               }
      //           }
      //       }).catch(err=>{
      //           console.log(err);
      //      });
      // },
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
      getCheckedKeys(){
        $(".userList").empty();
        this.uids = [];
        this.val = this.$refs.tree.getCheckedNodes(true);
          if(this.val.length >= 1){
            for(var i = 0; i<this.val.length; i++){
            if(this.val[i].children){
              this.val = this.childrenData;
            }
              var labelling = '<li class="adduser">'+this.val[i].label+'</li>';
              $(".userList").append(labelling);
              this.uids.push(this.val[i].id);
           }
        }
      },
      getFolderInfo(val){
           this.$http.get('/myResources/GetCommunalFolderDetail',{
              params:{
                  id:val
              }
        }).then(res=>{
                var d=$.parseJSON(res.data);
                if (d) {
                    if (d.msgid==200) {
                        var info=d.data;

                        this.title='编辑';
                        this.foldername=info.name;
                        this.uids=[];
                        var arr=info.user;
                        for(var i=0;i<arr.length;i++){
                              var a=arr[i];
                              var user={
                                id:a.id,
                                name:a.username,
                                type:'user'
                              }
                              this.users.push(user);
                              this.uids.push(a.id);
                              var li= '<li class="adduser">'+a.name+'</li>';;
                              $('.userList').append(li);
                        }
                        this.$refs.tree.setCheckedKeys(this.uids,false);
                    }else{
                        console.log(d.msg);
                    }
                }
            }).catch(err=>{
                console.log(err);
           });
      },
    }
}
</script>
<style lang="scss">
.newmess{
	width:60em;
	height:auto;
	padding:0 0.4em 3em;
	position:absolute;
	top:8em;
	left:50%;
	margin-left:-30em;
	background:url("../../assets/module/u10.png") no-repeat;
	background-size:100% 100%;

      .el-tree-node__expand-icon.expanded{
      background:none;
    }
    .el-tree-node__expand-icon{
      background:none;
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
        .litle-name{
          width:100%;
          padding-left:2em;
          padding-top:1em;
          margin:0;
          input{
            width:50%;
            border:1px solid #eee;
            border-radius:5px;
            height:2em;
            line-height:2em;
          }
        }
        .content{
        	width:100%;
        	padding:1em 2em 2em 2em;
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
        	.chose-use{
        		width:100%;
        		height:25em;
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
			height:25em;
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
			height:11em;
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