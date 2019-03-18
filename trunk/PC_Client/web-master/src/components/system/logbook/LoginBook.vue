<template>
	<div class="login-book">
		<div class="search-div">
			<div class="top">
				<p>
				<span>工号/学号</span>
				<input type="text" placeholder="按工号/学号模糊查询" v-model="code">
				</p>
				<p>
					<span>用户名</span>
					<input type="text" placeholder="按用户名模糊查询" v-model="username">
				</p>
				<p>
					<span>用户角色</span>
					<select name="" id="" v-model="rid">
					         <option value="0">全部</option>
				                    <option v-for="r in roles" :value="r.id">{{r.name}}</option>
					</select>
				</p>
				<p class="search-btn" @click="searchLog">搜索</p>
			</div>
			<div class="time">
				<span>登录时间</span>
				<el-date-picker
      					v-model="lstart"
      					value-format="yyyy-MM-dd HH:mm:ss"
      					type="datetime">
    				</el-date-picker>
    				<span>至</span>
    				<el-date-picker
      					v-model="lend"
      					value-format="yyyy-MM-dd HH:mm:ss"
      					type="datetime">
    				</el-date-picker>
			</div>
			<div class="time">
				<span>退出时间</span>
				<el-date-picker
      					v-model="estart"
      					value-format="yyyy-MM-dd HH:mm:ss"
      					type="datetime">
    				</el-date-picker>
    				<span>至</span>
    				<el-date-picker
      					v-model="eend"
      					value-format="yyyy-MM-dd HH:mm:ss"
      					type="datetime">
    				</el-date-picker>
			</div>
		</div>
		<div class="derivation">
			<a :href="path">导出</a>
		</div>
		<div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="" style="margin-bottom:0"><input type="checkbox"  @click="checkAll" id="checkAll">All</label></th>
                        <th width="10">用户名</th>
                        <th width="10">真实姓名</th>
                        <th width="10">工号/学号</th>
                        <th width="10">用户角色</th>
                        <th  width="15">登录终端类型</th>
                        <th width="10">IP地址</th>
                        <th width="15">登录时间</th>
                        <th width="15">退出时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in loginLogs">
                        <td><input type="checkbox" :value="item.id" v-model="ids"></td>
                        <td :title="item.username">{{item.username}}</td>
                        <td :title="item.realname">{{item.realname}}</td>
                        <td :title="item.number">{{item.number}}</td>
                        <td :title="item.rolename">{{item.rolename}}</td>
                        <td :title="item.terminaltype?'移动端':'pc端'">{{item.terminaltype?"移动端":"pc端"}}</td>
                        <td :title="item.ip">{{item.ip}}</td>
                        <td :title="item.logintime">{{item.logintime}}</td>
                        <td :title="item.logouttime=='0001-01-01 00:00:00'?'--':item.logouttime">{{item.logouttime=='0001-01-01 00:00:00'?'--':item.logouttime}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageindex"
          :page-size="pagesize"
          layout="prev, pager, next"
          :total="count"
          v-if="count>pagesize"
          >
      </el-pagination>
      <alert-tip :message='emsg'
                      :isShowtip='isError'
                      @closeTipEvent = 'isError=false;'>
      </alert-tip>
    </div>
</template>
<script type="text/ecmascript-6">
import alertTip from '../../alertTip'
export default{
	name:"login-book",
	data(){
		return{
			pagesize:15,
			pageindex:1,
			code:'',
			username:'',
			rid:0,
			lstart:"",
			lend:"",
			estart:"",
			eend:"",
			loginLogs:[],
			ids:[],
			roles:[],//角色实例数组
			allCheck:false,
			count:0,
			emsg:'',
			isError:false,
			path:'',
		}
	},
	components:{alertTip},
	watch:{
		ids:function(){
			if(this.ids.length < this.loginLogs.length){
				$("#checkAll").prop("checked",false)
			}else if(this.ids.length>0&&this.ids.length == this.loginLogs.length){
				$("#checkAll").prop("checked",true)
			}
			this.path = this.ajaxBaseUrl+'/SystemManage/ExportLoginLog?ids='+this.ids.join(',');
		},
	},
	mounted:function(){
		this.path = this.ajaxBaseUrl+'/SystemManage/ExportLoginLog?ids=';
		this.getLoginLogs();
		    //获取角色数组
	           this.$http.get('/systemManage/getRolesName'
	           ).then(res=>{
		 var d=$.parseJSON(res.data);
	              if (d.msgid!=200) {
	                      console.log(d.msg);
	                      return false;
	               }
	                this.roles=d.data;
	           }).catch(err=>{
	                    console.log(err);
	          });
	},
	methods:{
	      checkAll(){
               if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.loginLogs.length; i++){
                        this.ids.push(this.loginLogs[i].id)
                    }                                    
                }else{
                    this.ids = [];
                }
            },
		getLoginLogs(){				
			this.$http.get('/systemManage/getLoginLogs',{
				params:{
					pagesize:this.pagesize,
					pageindex:this.pageindex,
					number:this.code,
					username:this.username,
					roleid:this.rid,
					loginbegin:this.lstart,
					loginend:this.lend,
					logoutbegin:this.estart,
					logoutend:this.eend
				}
			}).then(res=>{
				var data=res.data;
				var d;
				if (data) {
					d=$.parseJSON(data);
				}
				if (d.msgid!=200) {
					this.emsg=d.msg;
					this.isError=true;
					return false;
				}

				this.loginLogs=d.data;
				this.count = d.count;
				this.ids=[];
				$("#checkAll").prop("checked",false)
			})
		},
		searchLog(){
			this.pageindex=1;
			this.getLoginLogs();
		},
	              handleCurrentChange(val) {
	                  this.pageindex = parseInt(val);
	                  this.getLoginLogs();
	              },
	},
}
</script>
<style lang="scss">
@media screen and (max-width: 1366px) {
	.login-book .search-div .time{
		margin-right:0.2em !important;
	}
}
	.login-book{
		box-sizing:border-box;
		padding:3em 1em;
		.el-pagination{
			width:100%;
			position:absolute;
			bottom:6em;
		}
		.el-pagination .btn-next,.el-pagination .btn-prev{
			padding:0 0.3em;
		}
		.search-div{
			width:100%;
			overflow:hidden;
			background:rgba(#ffffff, 0.1);
			border-radius:5px;
			padding:1em;
			color:#fff;

			.top{
				width:100%;
				overflow:hidden;

				p{
				float:left;
				margin-right:3em;

					input{
						border:1px solid #0099ff;
						background:#fff;
						border-radius:5px;
						height:2.5em;
						color:#666;
						width:10em;
						width:10em;
					}
					select{
						height:2.5em;
						color:#666;
						width:10em;
					}
				}
				.search-btn{
					width:8em;
					height:2.5em;
					text-align:center;
					line-height:2.5em;
					background-color:#0099ff;
					border-radius:5px;
					float:right;
					margin-right:1em;
					background-image:url("../../../assets/system/faj.png");
					background-repeat:no-repeat;
					background-position:0 -0.6em;
					cursor:pointer;
					background-size:50%;
				}
			}

			.time{
				float:left;
				margin-right:1.5em;
				margin-top:1em;
				div{
					width:14.2em;

					input{
					border:1px solid #0099ff;
					background:#fff;
					border-radius:5px;
					height:2.5em;
					color:#666;
					width:14.2em;
				}
				}
			}

		}
		.derivation{
			width:100%;
			height:auto;

			a{
				display:block;
				width:6em;
				height:2.5em;
				background-color:#0099ff;
				color:#fff;
				margin-top:1em;
				line-height:2.5em;
				text-align:center;
				border-radius:3px;
			}
		}

	}
</style>