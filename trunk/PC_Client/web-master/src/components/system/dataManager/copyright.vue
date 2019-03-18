<template>
    <div class="position">
        <div class="operation">
            <a href="javascript:void(0)" @click="addNew(1)">创建</a>
            <a href="javascript:void(0)" @click="del(1)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索版权归属方式名称" v-model="copyname">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="15">版权归属方式名称</th>
                        <th width="25">描述</th>
                        <th width="20">修改时间</th>
                        <th width="25">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in clist">
                      <td><input type="checkbox" :value="c.id" v-model="cids"></td>
                        <td :title="c.name">{{c.name}}</td>
                        <td :title="c.description">{{c.description}}</td>
                        <td :title="c.createtime">{{c.createtime}}</td>
                        <td :class="[c.enable===1?'green':'red']">{{c.enable==1?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="addNew(2,c)">编辑</a>
                            <a href="javascript:void(0)" @click="del(2,c)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip :isShow="isDel" 
                             :message="message" 
                             :notDele = "notDele"
                             :notMess = "notMess"
                             @delObjEvent="delClass" 
                             @closeTipEvent="closeTip">
        </common-tip>
        <new-sou 
            :show="isShow" 
            :title="title" 
            :type="ntype" 
            :model="model"
            @closeEvent="closeClass" 
            @saveEvent="saveClass" >
        </new-sou>
        <alert-tip :isShowtip="isShowtip" :message="mess" @closeTipEvent="closeAlert"></alert-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip"
    import NewSou from "./NewSou"
    import alertTip from "../../alertTip"
    export default{
        data () {
             return {
                isDel:false,
                message:"",
                isShow:false,
                title:'版权归属方式',
                ntype:'创建',
                model:null,
                copyname:'',
                cid:0,
                cids:[],
                clist:[],
                isShowtip:false,
                mess:'',
                notDele:false,
                notMess:'',
             };
         },
        components:{CommonTip,NewSou,alertTip},
        watch:{
            cids:function(){
              if(this.cids.length < this.clist.length){
                $("#checkAll").prop("checked",false);
              }else if(this.cids.length>0&&this.cids.length == this.clist.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        mounted:function(){
          this.GetOwnership();
        },
        methods: {
            // 获取所有数据
            GetOwnership(){
              this.$http.get('/systemManage/GetOwnership',{
                params:{
                  name:this.copyname
                }
              }).then(res=>{
                this.cids = [];
                $("#checkAll").prop("checked",false);
                var d = $.parseJSON(res.data);
                if(d){
                  if(d.msgid == 200){
                    this.clist = d.data;
                  }else{
                    console.log(d.msg)
                  }
                }
              }).catch(err=>{
                console.log(err)
              })
            },
            // 关闭对话框
             closeTip(){
                this.isDel=false;
                this.cids = [];
             }, 
            // 新增或者编辑弹窗
            addNew(type,c){
              this.cids = [];
              if(type==1){
                this.ntype = "创建";
                this.model = null;
                this.cid = 0;
              }else{
                this.ntype = "编辑";
                this.model = c;
                this.cid = c.id;
                this.model.enabled = c.enable;
              }
              this.isShow = true;
             },  
            // 全选
            checkAll(){
               if($("#checkAll").prop("checked")){
                  this.cids = [];
                   for(var i = 0; i < this.clist.length; i++){
                       this.cids.push(this.clist[i].id)
                   }                                    
               }else{
                   this.cids = [];
               }
            },
            // 删除询问
            del(type,c){
                  if(type == 1){
                      if(this.cids.length < 1){
                          this.isShowtip = true;
                          this.mess = "未选中任何版权归属方式";
                      }else{
                         var all = this.cids.length;
                         var arr = []
                         for(var i=0;i<this.clist.length;i++){
                                 var  item=this.clist[i];
                                 if (this.cids.contain(item.id)) {
                                     if (item.count>0) {
                                         this.cids.removevalue(item.id);
                                         arr.push(item.id)
                                          continue;
                                     }
                                 }
                             }
                          var cant = arr.length;
                          this.notMess = '共选中'+all+'条版权归属方式，其中'+cant+'条不允许被删除';
                          this.message = '不允许删除的版权归属方式下有绑定资源，禁止删除';
                          this.notDele = true;
                          this.isDel=true; 
                      }
                   }else{
                    if(c.count > 0){
                        this.isShowtip = true;
                        this.mess = '版权归属方式'+c.name+'下绑定资源,禁止删除';
                        return
                    }
                     this.cids = [];
                     this.cids.push(c.id);
                     this.notDele = false;
                     this.isDel=true;
                     this.message = "您确定删除该版权归属方式吗？" 
                  }
             }, 
            // 删除请求
            delClass(){
                this.isDel=false;
                if(this.cids.length < 1){
                  return
                }
                this.$http.post('/systemManage/DeleteOwnership',{
                      ids:this.cids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                         this.isShowtip = true; 
                         this.cids = [];
                        if(d.msgid == 200){                          
                            this.mess = "删除成功";                           
                            this.GetOwnership();
                        }else{
                            this.mess = d.msg
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }, 
            // 关闭新增
             closeClass(){
                this.isShow = false;
             }, 
            // 关闭提示
             closeAlert(){
                this.isShowtip = false;
                if(this.cids.length >=1){
                    this.delClass();
                }
             },
            // 新增或者编辑请求
            saveClass(name,description,enabled){
                this.$http.post('/systemManage/SaveOwnership',{
                  id:this.cid,
                  name:name,
                  enable:enabled,
                  description:description
                }).then(res=>{
                  var d = $.parseJSON(res.data);
                  console.log(d);
                  if(d){
                    if(d.msgid == 200){
                      this.isShow = false;
                      if(this.ntype=='创建'){
                        this.mess = '创建成功'
                      }else{
                        this.mess = '编辑成功'
                      }
                      this.GetOwnership();
                    }else{
                      this.mess = d.msg;
                    }
                    this.isShowtip = true;
                  }
                }).catch(err=>{
                  console.log(err)
                })
         },
            // 模糊搜索
             search(){
                  this.GetOwnership();
             },            
         }
    }
</script>
<style lang="scss">
.position{
        .operation{
            width:100%;
            padding:1em;
            overflow:hidden;
            .red{
                color:red;
            }
            .green{
              color:green;
            }
            a{
                float:left;
                width:5em;
                height:2em;
                line-height:2em;
                background-color:#0099ff;
                text-align:center;
                color:#fff;
                margin-top:1em;
                margin-left:1em;
                text-decoration: none;
            }
        }
        .excel{
          height:63em;
          overflow-y:auto;
        }
    }
</style>