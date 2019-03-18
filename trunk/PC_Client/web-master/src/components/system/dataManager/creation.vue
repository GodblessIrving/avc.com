<template>
    <div class="position">
        <div class="operation">
            <a href="javascript:void(0)" @click="addNew(1)">创建</a>
            <a href="javascript:void(0)" @click="del(1)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索创作性质名称" v-model="nature">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="10"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="10">创作性质名称</th>
                        <th width="25">描述</th>
                        <th width="25">修改时间</th>
                        <th width="25">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="n in nlist">
                      <td><input type="checkbox" :value="n.id" v-model="nids"></td>
                        <td :title="n.name">{{n.name}}</td>
                        <td :title="n.description">{{n.description}}</td>
                        <td :title="n.createtime">{{n.createtime}}</td>
                        <td :class="[n.enable===1?'green':'red']">{{n.enable==1?'启用':'禁用'}}</td>
                        <td>
                            <a href="javascript:void(0)" @click="addNew(2,n)">编辑</a>
                            <a href="javascript:void(0)" @click="del(2,n)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip :isShow="isDel" 
                             :message="message" 
                             :notDele = "notDele"
                             :notMess = 'notMess'
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
            title:'创作性质',
            ntype:'创建',
            model:null,
            isShowtip:false,
            mess:'',
            nlist:[],
            nature:'',
            nids:[],
            nid:0,
            notDele:false,
            notMess:'',
         };
     },
    name:"position",
    components:{CommonTip,NewSou,alertTip},
    watch:{
            nids:function(){
              if(this.nids.length < this.nlist.length){
                $("#checkAll").prop("checked",false);
              }else if(this.nids.length >0&&this.nids.length == this.nlist.length){
                $("#checkAll").prop("checked",true);
              }
            }
    },
    mounted:function(){
      this.GetNature();
    },
    methods: {
          // 获取所有数据
         GetNature(){
            this.$http.get('/systemManage/GetNature',{
              params:{
                name:this.nature
              }
            }).then(res=>{
              this.nids = [];
              $("#checkAll").prop("checked",false);
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  this.nlist = d.data;
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
            this.nids = [];
         }, 
         // 新增和编辑弹窗
         addNew(type,n){
          this.nids = [];
          if(type==1){
            this.ntype = "创建";
            this.model = null;
            this.nid = 0;
          }else{
            this.ntype = "编辑";
            this.model = n;
            this.model.enabled = n.enable;
            this.nid = n.id;
          }
          this.isShow = true;
         },
         // 全选
         checkAll(){
            if($("#checkAll").prop("checked")){
                this.nids = [];
                for(var i = 0; i < this.nlist.length; i++){
                    this.nids.push(this.nlist[i].id)
                }                                    
            }else{
                this.nids = [];
            }
        },  
        // 关闭弹窗
         closeAlert(){
            this.isShowtip = false;
         },
         // 删除提示
         del(type,n){
             if(type == 1){
               if(this.nids.length < 1){
                   this.isShowtip = true;
                   this.mess = "未选中任何创作性质";
               }else{
                  var all = this.nids.length;
                  var arr = []
                  for(var i=0;i<this.nlist.length;i++){
                          var  item=this.nlist[i];
                          if (this.nids.contain(item.id)) {
                              if (item.count>0) {
                                  this.nids.removevalue(item.id);
                                  arr.push(item.id)
                                   continue;
                              }
                          }
                      }
                   var cant = arr.length;
                   this.notMess = '共选中'+all+'条创作性质，其中'+cant+'条不允许被删除';
                   this.message = '不允许删除的创作性质下有绑定资源，禁止删除';
                   this.notDele = true;
                   this.isDel=true; 
               }
             }else{
                if(n.count > 0){
                    this.isShowtip = true;
                    this.mess = '创作性质'+n.name+'下绑定资源,禁止删除';
                    return
                }
                 this.nids = [];
                 this.nids.push(n.id);
                 this.notDele = false;
                 this.isDel=true;
                 this.message = "您确定删除该创作性质吗？" 
             }
         }, 
         // 确认删除
         delClass(){
                 this.isDel=false;
                 if(this.nids.length < 1){
                  return
                 }
                this.$http.post('/systemManage/DeleteNature',{
                      ids:this.nids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                         this.isShowtip = true; 
                         this.nids = [];
                        if(d.msgid == 200){                           
                            this.mess = "删除成功";                            
                            this.GetNature();
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
            this.$http.post('/systemManage/SaveNature',{
                  id:this.nid,
                  name:name,
                  enable:enabled,
                  description:description
                }).then(res=>{
                  var d = $.parseJSON(res.data);
                  if(d){
                    if(d.msgid == 200){
                      this.isShow = false;
                      if(this.ntype=='创建'){
                        this.mess = '创建成功'
                      }else{
                        this.mess = '编辑成功'
                      }
                      this.GetNature();
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
            this.GetNature();
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