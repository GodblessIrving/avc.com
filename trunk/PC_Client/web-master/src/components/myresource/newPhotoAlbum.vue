<template>
	<div v-if="isNewatlas" class="masklayer">
                    <div class="upload-btn">
                                <div class="title-top">
                                    <p>{{resourcetitle}}</p>
                                    <span class="red-close" @click="closeatlas()"></span>
                                </div>
                                <div class="content">
                                        <p style="margin-bottom:2em;">
                                                <span class="span-name">图册名称：</span>
                                                <input type="text" placeholder="请输入图册名称" v-model="altasName" name="图册名称" v-validate="'required'" maxlength="20">
                                                <p class="is-danger" v-show="errors.has('图册名称')" style="margin-top:-1.5em">{{errors.first('图册名称')}}</p>
                                        </p>
                                        <p style="margin-bottom:2em;">
                                                <span class="span-name">图册分类：</span>
                                                <select name="" id="" v-model="classid" name="图册分类" v-validate="{not_in:[0]}">
                                                        <option value="0">请选择</option>
                                                        <option v-for="c in classList" v-if="classList.length>0" :value="c.id">
                                                            {{c.name}}
                                                        </option>
                                                </select>
                                                <p class="is-danger" v-show="errors.has('图册分类')" style="margin-top:-1.5em">{{errors.first('图册分类')}}</p>
                                        </p>
                                        <p style="padding-left:2.6em; margin-top:2em;">
                                            <span style="margin-right:2em;cursor:pointer" class="cur" @click="BaseInfoblock($event)">概要信息</span>
                                            <span style="cursor:pointer" @click="copyrightBlock($event)">版权信息</span>
                                        </p>
                                        <div class="gainfo" v-show="baseInfo">
                                             <div style="margin-bottom:2em; margin-top:2em" class="item">
                                             <span  style="float:left;" class="span-name">图册标签：</span>
                                              <div style="float:left; width:77%;">
                                                    <div style="width:100%; overflow:hidden;" class="tipBox">
                                                    <p v-for="(tip,inx) in tipArr" class="addTip" >{{tip}}<span class="dele"  @click="clearTip(inx)">×</span></p>
                                                    <p v-bind:class="{ 'blue-add' : !isAdd, 'gray-add': isAdd}" @click="addtip" class="Audiotip"></p>
                                                     </div>
                                                    <p class="add-tip" v-show="isAdd" style="margin-bottom:2em; clear:both;position:relative; top:-1em;">
                                                        <input type="text" v-model="tip" @change="checkTipExist">
                                                        <a href="javascript:void(0)" @click="saveTip()">保存</a>
                                                        <a href="javascript:void(0)" @click="closeadd()">取消</a>
                                                     </p>
                                                </div>
                                            </div>
                                            <p>
                                                <span style="float:left" class="span-name">内容描述：</span>
                                                <textarea cols="60" rows="8" placeholder="请输入新建图册的内容描述" v-model="describe" name="图册简介" maxlength="400"></textarea>
                                                <p class="is-danger" v-show="errors.has('图册简介')" style="margin-top:-0.5em;">{{errors.first('图册简介')}}</p>
                                            </p>
                                            <p>
                                                <span class="span-name">公开或私有：</span>
                                                <label for="1a"><input type="radio" id="1a" name="123" value="1" v-model="owner">公开</label>
                                                <label for="2b"><input type="radio" id="2b" name="123" value="0"  v-model="owner">私有</label>
                                            </p>
                                        </div>
                                        <!-- 版权信息 -->
                                        <div class="gainfo" v-show="copyright">
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">版权人：</span>
                                                <input type="text" placeholder="请输入版权人" v-model="holder" maxlength="45">
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">首次发布方式：</span>
                                                <select name="" id="" v-model="ptype">
                                                  <option value="0">请选择</option>
                                                  <option v-for="p in publicTypes" :value="p.id">{{p.name}}</option>
                                                </select>
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">发布日期：</span>
                                                <el-date-picker
                                                  v-model="ptime"
                                                  type="datetime"
                                                  value-format="yyyy-MM-dd HH:mm:ss"
                                                  placeholder="发布日期">
                                              </el-date-picker>
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">创作性质：</span>
                                                <select name="" id="" v-model="nature">
                                                  <option value="0">请选择</option>
                                                  <option v-for="n in natures" :value="n.id">{{n.name}}</option>
                                                </select>
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">首次发布地点：</span>
                                                <input type="text" placeholder="请输入首次发布地点" v-model="paddr" maxlength="45">
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">作者：</span>
                                                <input type="text" placeholder="请输入作者" v-model="author" maxlength="45">
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">版权归属方式：</span>
                                                <select name="" id="" v-model="ownership">
                                                  <option value="0">请选择</option>
                                                  <option v-for="o in ownerships" :value="o.id">{{o.name}}</option>
                                                </select>
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                <span class="span-name">版权保护：</span>
                                                <input type="text" placeholder="请输入版权保护" v-model="protection" maxlength="200">
                                            </p>
                                            <p class="item" style="margin-bottom:1.5em">
                                                  <span style="float:left" class="span-name">版权声明：</span>
                                                  <textarea cols="60" rows="8" placeholder="请输入版权声明" v-model="statement" maxlength="400">
                                                  </textarea>
                                          </p>
                                        </div>
                                </div>
                                <div class="edit-btn">
                                    <a href="javascript:void(0)" @click="save">提交</a>
                                    <a href="javascript:void(0)" @click="closeatlas()">取消</a>
                                </div>
                	</div>   
      </div>
</template>
<script  type="text/ecmascript-6">
export default{
    name:"new-photoalbum",
    data(){
        return{
            altasName:'',
            classList:[],
            classid:0,
            tipArr:[],
            describe:'',
            owner:1,
            holder:'',
            ptype:0,
            tip:'',
            publicTypes:[],
            ptime:'',
            nature:0,
            natures:[],
            paddr:'',
            author:'',
            ownership:0,
            ownerships:[],
            protection:'',
            statement:'',
            copyright:false,
            baseInfo:true,
            isAdd:false,
        }
    },
    props:['isNewatlas','resourcetitle','infoList'],
    watch:{
        isNewatlas:{
            handler: function(val) {
                if(val){
                    this.copyright=false;
                    this.baseInfo=true;
                    if(this.infoList){
                        this.altasName = this.infoList.name;
                         this.classid = this.infoList.cid;
                         if(this.infoList.label){
                             this.tipArr = this.infoList.label.split(",")
                         }else{
                              this.tipArr = [];
                         }                                       
                         this.owner = this.infoList.public;
                         this.describe = this.infoList.description;
                         this.holder = this.infoList.holder;
                         this.ptype = this.infoList.ptype;
                         this.ptime = this.infoList.ptime;
                         this.nature = this.infoList.nature;
                         this.paddr = this.infoList.paddr;
                         this.author = this.infoList.author;
                         this.ownership = this.infoList.ownership;
                         this.protection = this.infoList.protection
                         this.statement = this.infoList.statement;
                    }else{
                        this.altasName = '';
                         this.classid = 0;
                         this.tipArr = [];                                         
                         this.owner = 1;
                         this.describe = '';
                         this.holder = '';
                         this.ptype = 0;
                         this.ptime = '';
                         this.nature = 0;
                         this.paddr = '';
                         this.author = '';
                         this.ownership =0;
                         this.protection = '';
                         this.statement = '';
                    }
                }
            },
            deep: true
        }
    },
    mounted:function(){
        this.getClasses();
        this.getOwnerships();
        this.getNatures();
        this.getPublicTypes();
    },
    methods:{
         // 获取所有分类名称
         getClasses(){
                this.$http.get('/systemManage/getClassifications',{
                    params:{
                        pagesize:9999,
                        pageindex:1,
                        name:''
                    }
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    if (d) {
                        if (d.msgid==200) {
                            this.classList=d.data;
                        }else{
                            console.log(d.msg);
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                });
         },
        save(){
            var _this = this;
            _this.$validator.validateAll().then((result)=>{
                if (result) {
                    _this.$emit('saveEvent',_this.altasName,_this.classid,_this.tipArr,_this.owner,_this.describe,_this.holder,_this.ptype,_this.ptime,_this.nature,_this.paddr,_this.author,_this.ownership,_this.protection,_this.statement);
                }
            })
        },
        // 点击概要信息，出现的概要信息面板入口
             BaseInfoblock(e){
               var dom = e.currentTarget;
               $(dom).addClass('cur').siblings('span').removeClass('cur');
               this.baseInfo = true;
               this.copyright = false;
             },
             copyrightBlock(e){
               var dom = e.currentTarget;
               $(dom).addClass('cur').siblings('span').removeClass('cur');
               this.baseInfo = false;
               this.copyright = true;
             },
             getOwnerships(){
                this.$http.get('systemManage/GetEnabledOwnership',{
                }).then(res=>{
                    var d=$.parseJSON(res.data);
                    if (d) {
                        if (d.msgid==200) {
                            this.ownerships=d.data;
                        }else{
                            console.log(d.msg);
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                });
            },
           getNatures(){
               this.$http.get('systemManage/GetEnabledNature',{
               }).then(res=>{
                  //console.log(res.data);
                   var d=$.parseJSON(res.data);
                   if (d) {
                       if (d.msgid==200) {
                           this.natures=d.data;
                       }else{
                           console.log(d.msg);
                       }
                   }
               }).catch(err=>{
                   console.log(err);
               });
           },

          //发布方式
          getPublicTypes(){
                   this.$http.get('systemManage/GetEnabledPublicType',{
                   }).then(res=>{
                      //console.log(res.data);
                       var d=$.parseJSON(res.data);
                       if (d) {
                           if (d.msgid==200) {
                               this.publicTypes=d.data;
                           }else{
                               console.log(d.msg);
                           }
                       }
                   }).catch(err=>{
                       console.log(err);
                   });
          },
         // 添加标签输入框出现
           addtip(){
               this.isAdd = true;
               this.tip = '';
           },
           // 添加标签的输入框隐藏
           closeadd(){
                this.isAdd = false;
                $(".isRepeat").remove();
           },
           // 判断标签是否重复
           checkTipExist(){
                if (this.tipArr.length==0) {
                    return false;
                }
                if (this.tipArr.contain(this.tip)) {
                    var error='<p class="is-danger isRepeat">该标签已经被添加过了</p>';
                    $(".add-tip").append(error);
                    this.tipExist=true;
                }else{
                    $(".add-tip").find('.is-danger').remove();
                    this.tipExist=false;
                }
            },
           // 给图册添加标签
           saveTip(){
               if (this.tip==''||this.tipExist) {
                   return false;
               }
               this.tipArr.push(this.tip);
               this.isAdd = false;
               this.tip='';
           },
           clearTip(inx){
              this.tipArr.splice(inx, 1);
           },
           //关闭弹窗
         closeatlas(){
            this.$emit('closeTipEvent');
         },
    }
}
</script>
<style lang="scss">
    .upload-btn{                        
              em{
                  font-style:normal;
              }
             
             .content{
                  width:100%;
                  padding:2em 4em;
                  box-sizing:border-box;
                  color:#fff;
                  .add-tip{
                     margin-left:0;
                      input[type="text"]{
                             width:10em;
                      }

                      a{
                             height:2em;
                             line-height:2em;
                             top:10px;
                      }
                  }

                  p{
                      .span-name{
                          margin-right:3em;
                          width:15%;
                          text-align:right;
                          display:inline-block;
                      }

                      a{
                             display:inline-block;
                             width:3em;
                             height:3em;
                             position:relative;
                             top:1em;
                             text-decoration: none;
                      }

                      select{
                             width:10em;
                             height:2em;
                             color:#333;
                      }
                     textarea{
                              background:none;
                              border-radius:3px;
                              border:1px solid #4e4e4e;
                              resize:none;
                     }
                      input[type="text"]{
                             width:20em;
                             height:2em;
                             border:1px solid #fff;
                             border-radius:3px;
                      }
             
                      label{
                          margin-right:3em;
                          input{
                              position:relative;
                              top:1px;
                              left:-4px;
                          }
                      }
                  }
             }
              .edit-btn{
                  a:nth-child(2){
                      background-color:#666666;
                  }
              }
     }
</style>