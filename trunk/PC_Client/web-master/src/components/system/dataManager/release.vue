<template>
    <div class="position">
        <div class="operation">
            <a href="javascript:void(0)" @click="addNew(1)">创建</a>
            <a href="javascript:void(0)" @click="del(1)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索首次发布方式名称" v-model="release">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="10">发布方式名称</th>
                        <th width="25">描述</th>
                        <th width="25">修改时间</th>
                        <th width="25">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rlist">
                      <td><input type="checkbox" :value="r.id" v-model="rids"></td>
                        <td :title="r.name">{{r.name}}</td>
                        <td :title="r.description">{{r.description}}</td>
                        <td :title="r.createtime">{{r.createtime}}</td>
                        <td :class="[r.enable===1?'green':'red']">{{r.enable==1?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="addNew(2,r)">编辑</a>
                            <a href="javascript:void(0)" @click="del(2,r)">删除</a>
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
                title:'首次发布方式',
                ntype:'创建',
                release:'',
                model:null,
                rlist:[],
                rid:0,
                type:'',
                isShowtip:false,
                mess:'',
                rids:[],
                notDele:false,
                notMess:'',
             };
         },
        name:"position",
        components:{CommonTip,NewSou,alertTip},
        watch:{
            rids:function(){
              if(this.rids.length < this.rlist.length){
                $("#checkAll").prop("checked",false);
              }else if(this.rids.length > 0&&this.rids.length == this.rlist.length){
                $("#checkAll").prop("checked",true);
              }
            }
        },
        mounted:function(){
          this.GetPublictype();
        },
        methods: {
             // 获取所有数据
             GetPublictype(){
              this.$http.get('/systemManage/GetPublictype',{
                params:{
                  name:this.release
                }
              }).then(res=>{
                this.rids = [];
                $("#checkAll").prop("checked",false);
                var d = $.parseJSON(res.data);
                if(d){
                  if(d.msgid==200){
                    this.rlist = d.data;
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
                this.rids = [];
             }, 
             // 编辑和新增弹窗
             addNew(type,r){
              this.rids = [];
              if(type == 1){
                this.model = null;
                this.ntype = '创建';
                this.rid = 0;
              }else{
                this.model = r;
                this.rid = r.id;
                this.model.enabled = r.enable;
                this.ntype = '编辑'
              }
              this.isShow = true;
             },  
             // 全选
             checkAll(){
                if($("#checkAll").prop("checked")){
                    this.rids = [];
                    for(var i = 0; i < this.rlist.length; i++){
                        this.rids.push(this.rlist[i].id)
                    }                                    
                }else{
                    this.rids = [];
                }
            },
            del(type,r){
             if(type == 1){
               if(this.rids.length < 1){
                   this.isShowtip = true;
                   this.mess = "未选中任何首次发布方式";
               }else{
                  var all = this.rids.length;
                  var arr = []
                  for(var i=0;i<this.rlist.length;i++){
                          var  item=this.rlist[i];
                          if (this.rids.contain(item.id)) {
                              if (item.count>0) {
                                  this.rids.removevalue(item.id);
                                  arr.push(item.id)
                                   continue;
                              }
                          }
                      }
                   var cant = arr.length;
                   this.notMess = '共选中'+all+'条班级/部门，其中'+cant+'条不允许被删除';
                   this.message = '不允许删除的班级/部门下有绑定用户，禁止删除';
                   this.notDele = true;
                   this.isDel=true; 
               }
             }else{
                 if(r.count > 0){
                    this.isShowtip = true;
                    this.mess = '首次发布方式'+r.name+'下绑定资源,禁止删除';
                    return
                 }
                 this.rids = [];
                 this.rids.push(r.id);
                 this.notDele = false;
                 this.isDel=true;
                 this.message = "您确定删除该首次发布方式吗？" 
             }
            },
            // 关闭提示弹窗
            closeAlert(){
                this.isShowtip = false;
             },
             delClass(){
                this.isDel=false;
                if(this.rids.length < 1){
                  return
                }
                this.$http.post('/systemManage/DeletePublictype',{
                      ids:this.rids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isShowtip = true; 
                        this.rids = [];
                        if(d.msgid == 200){                           
                            this.mess = "删除成功";                           
                            this.GetPublictype();
                        }else{
                            this.mess = d.msg;
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
             }, 
             // 关闭新增弹窗
             closeClass(){
                this.isShow = false;
             }, 
             // 新增和编辑请求
             saveClass(name,description,enabled){
                this.$http.post('/systemManage/SavePublictype',{
                  id:this.rid,
                  name:name,
                  enable:enabled,
                  description:description
                }).then(res=>{
                  var d = $.parseJSON(res.data);
                  if(d){
                    if(d.msgid == 200){
                      this.isShow = false;
                      if(this.ntype=='创建'){
                        this.isShowtip = true;
                        this.mess = '创建成功'
                      }else{
                        this.isShowtip = true;
                        this.mess = '编辑成功'
                      }
                      this.GetPublictype();
                    }else{
                      console.log(d.msg)
                      this.isShowtip = true;
                      this.mess = d.msg;
                    }
                  }
                }).catch(err=>{
                  console.log(err)
                })
             },
             search(){
                  this.GetPublictype();
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