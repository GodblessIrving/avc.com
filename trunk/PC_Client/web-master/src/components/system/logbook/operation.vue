<template>
	<div class="operation">
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
					<span>真实姓名</span>
					<input type="text" placeholder="按真实姓名模糊查询" 
					v-model="realname">
				</p>
				<p>
					<span>用户角色</span>
					<select name="" id="" v-model="rid">
						<option value="0">全部</option>
						<option v-for="r in roles":value="r.id">{{r.name}}</option>
					</select>
				</p>
				<p class="search-btn" @click="searchOpLogs">搜索</p>
			</div>
			<div class="bottom">
				<p>
					<span>操作类型</span>
					<select name="" id="" v-model="optype">
						<option value="0">全部</option>
						<option v-for="op in operates" :value="op.id">{{op.name}}</option>
					</select>
				</p>
				<p>
					<span>操作内容</span>
					<input type="text" placeholder="按操作内容模糊查询" 
					v-model="opcontent">
				</p>
				<div class="time">
					<span>操作时间</span>
					<el-date-picker
      						v-model="start"
      						value-format="yyyy-MM-dd HH:mm:ss"
      						type="datetime">
    					</el-date-picker>
    					<span>至</span>
    					<el-date-picker
      						v-model="end"
      						value-format="yyyy-MM-dd HH:mm:ss"
      						type="datetime">
    					</el-date-picker>
				</div>
			</div>
			
		</div>
		<div class="derivation">
			<a :href="path">导出</a>
		</div>
		<div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="" style="margin-bottom:0"><input type="checkbox" 
                        @change="checkAll" id="checkAll">All</label></th>
                        <th width="10">用户名</th>
                        <th width="10">真实姓名</th>
                        <th width="10">工号/学号</th>
                        <th width="10">用户角色</th>
                        <th  width="10">操作类型</th>
                        <th width="30">操作内容</th>
                        <th width="15">操作时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="op in opLogs">
                        <td><input type="checkbox" :value="op.id" v-model="ids"></td>
                        <td :title="op.username">{{op.username}}</td>
                        <td :title="op.realname">{{op.realname}}</td>
                        <td :title="op.number">{{op.number}}</td>
                        <td :title="op.rolename">{{op.rolename}}</td>
                        <td :title="op.typename">{{op.typename}}</td>
                        <td :title="op.operationcontent">{{op.operationcontent}}</td>
                        <td>{{op.operatingtime}}</td>
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
		name:"operation",
		data(){
			return{
				code:'',
				username:'',
				realname:'',
				rid:0,
				optype:0,
				opcontent:'',
				start:'',
				end:'',
				//分页
				pagesize:15,
				pageindex:1,
				count:0,
				opLogs:[],
				ids:[],
				//
				roles:[],
				operates:[],
				allCheck:false,
				emsg:'',
				isError:false,
				path:'',
			}
		},
		components:{alertTip},
		watch:{
			'ids':{
		                handler:function(val,oldVal){
		                    if (this.opLogs.length==this.ids.length&&this.ids.length>0) {
		                       $("#checkAll").prop("checked",true)
		                    }else if(this.ids.length<this.opLogs.length){
		                        $("#checkAll").prop("checked",false)
		                    }
		                    this.path = this.ajaxBaseUrl+'/SystemManage/ExportOperatingLog?ids='+this.ids.join(',');
		                }
		            }
		},
		mounted:function(){
			this.path = this.ajaxBaseUrl+'/SystemManage/ExportOperatingLog?ids=';
			this.getOpLogs();
			//获取角色数组
		           this.$http.get('/systemManage/getRolesName'
		           ).then(res=>{
		              var  data=res.data;
		              var d;
		              if (data) {
		              	d=$.parseJSON(data);
		              }
		              console.log(d);
		              if (d.msgid!=200) {
		                      console.log(d.msg);
		                      //this.message=d.Msg;
		                      return false;
		               }
		                this.roles=d.data;
		           }).catch(err=>{
		                    console.log(err);
		          });
		          //获取操作数组
		           this.$http.get('/systemManage/getOperationTypes'
		           ).then(res=>{
		              var  data=res.data;
		              var d;
		              if (data) {
		              	d=$.parseJSON(data);
		              }
		              console.log(d);
		              if (d.msgid!=200) {
		                      console.log(d.msg);
		                      //this.message=d.Msg;
		                      return false;
		               }
		                this.operates=d.data;
		           }).catch(err=>{
		                    console.log(err);
		          });
		},
		methods:{
		       checkAll(){
            		    if($("#checkAll").prop("checked")){
            		        this.ids = [];
            		        for(var i = 0; i < this.opLogs.length; i++){
            		            this.ids.push(this.opLogs[i].id)
            		        }                                    
            		    }else{
            		        this.ids = [];
            		    }
            		},
			getOpLogs(){
				this.$http.get('/systemManage/getOperations',{
					params:{
						pagesize:this.pagesize,
						pageindex:this.pageindex,
						number:this.code,
						username:this.username,
						realname:this.realname,
						roleid:this.rid,
						otid:this.optype,
						content:this.opcontent,
						operationtimebegin:this.start,
						operationtimeend:this.end
					}
				}).then(res=>{
					var d=$.parseJSON(res.data);
					if (d.msgid!=200) {
						this.emsg=d.msg;
						this.isError=true;
						return false;
					}

					this.opLogs=d.data;
					this.count=d.count;
					this.ids=[];
					 $("#checkAll").prop("checked",false)
				})
			},
			searchOpLogs(){
				this.pageindex=1;
				this.getOpLogs();
			},
			handleCurrentChange(val) {
		                  this.pageindex = parseInt(val);
		                  this.getOpLogs();
		              },
		},
	}
</script>
<style lang="scss">
	.operation{
		box-sizing:border-box;
		padding:3em 1em;
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
					margin-right:2em;
	
					input{
						border:1px solid #0099ff;
						background:#fff;
						width:10em;
						border-radius:5px;
						height:2.5em;
						color:#666;
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
					float:right;
					line-height:2.5em;
					float:right;
					background-color:#0099ff;
					border-radius:5px;
					margin-left:2em;
					margin-right:0;
					background-image:url("../../../assets/system/faj.png");
					background-repeat:no-repeat;
					background-position:0 -0.6em;
					cursor:pointer;
					background-size:50%;
				}
			}
			.bottom{
				width:100%;
				overflow:hidden;
				p{
					float:left;
					margin-right:2em;
					margin-top:1em;
					
					input{
						border:1px solid #0099ff;
						background:#fff;
						width:10em;
						border-radius:5px;
						height:2.5em;
						color:#666;
						width:10em;
					}
					select{
						height:2.5em;
						color:#666;
						width:10em;
					}

				}
				.time{
					float:left;
					margin-right:2em;
					margin-top:1em;
					div{
						width:14.5em;
	
						input{
							border:1px solid #0099ff;
							background:#fff;
							border-radius:5px;
							height:2.5em;
							color:#666;
							width:14.5em;
						}
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