    <template>
    <div v-if="show" class="masklayer">
        <div class="new-role">
            <div class="content">
            <div class="role-top">
                <p>{{ptitle}}</p>
                <span @click="close" style="font-size:2.2em;">×</span>
            </div>
            <div style="overflow-y:auto; height:40em;" class="conten-from">
                <div class="role-form">
               <p>
                   <span>角色名称：</span>
                   <input type="text" placeholder="请输入角色名称" v-model="name" v-validate="{'required':true,'max':40}" name="角色名称">
                   <p class="is-danger" v-show="errors.has('角色名称')" >{{errors.first('角色名称')}}</p>
               </p>
               <p class="enable">
                   <span>组织：</span>
                   <label for=""><input type="radio" name="group" value="1" v-model="isgroup">是</label>
                   <label for=""><input type="radio" name="group" value="0" v-model="isgroup">否</label>
               </p>
               <p class="enable">
                   <span>启用/禁用：</span>
                   <label for=""><input type="radio" name="isuse" value="1" v-model="enable">启用</label>
                   <label for=""><input type="radio" name="isuse" value="0" v-model="enable">禁用</label>
               </p>
                <p>
                   <span>云盘空间：</span>
                   <input type="text" placeholder="分配云盘空间" v-model="space" maxlength="9" v-validate="{'required':true,'numeric':true}" name="云盘空间">
                   <em style="font-style:normal;">MB</em>
                   <p class="is-danger" v-show="errors.has('云盘空间')" >{{errors.first('云盘空间')}}</p>
               </p>
               <p>
                   <span>功能授权：</span>
               </p>
            </div>
            <div class="my-title" style="clear:both" v-for="f1 in featureList">
               <span class="title-inner"> 
                      <label for=""><input type="checkbox" :value="f1.id" v-model="features" @change="checkAll($event)">{{f1.name}}</label>
               </span>
                <div class="title-right" :value="f1.id">
                    <div>
                          <div style="line-height:3em;" class='secordOne'>
                                      <label for="" v-for="f2 in f1.children" v-if="!f2.children">
                                            <input type="checkbox" :value="f2.id" v-model="features" class="inputChild" @change="checkTow($event)">{{f2.name}}
                                      </label>
                          </div>
                          <div v-for="f2 in f1.children" v-if="f2.children" class="levelTwo" :value="f2.id">
                                  <span style="float:left; width:16%;">
                                      <label for="">
                                            <input type="checkbox" :value="f2.id" v-model="features" @change="checkTow($event)">{{f2.name}}
                                      </label>
                                  </span>
                                  <div style="width:83%; float:left;" class="thridRole" :value="f2.id">
                                      <div class="title-bg">
                                          <div v-for="f3 in f2.children">
                                              <span class="span-right">
                                                    <label for="">
                                                        <input type="checkbox" :value="f3.id" v-model="features" @change="checkthree($event)">{{f3.name}}
                                                    </label>
                                              </span>
                                              <p  class="p-left fourole" v-if="f3.children&&f3.children.length>0" :value="f3.id">
                                                    <label for="" v-for="f4 in f3.children">
                                                          <input type="checkbox" :value="f4.id" v-model="features" @change="checkFour($event)">{{f4.name}}
                                                    </label>
                                              </p>
                                          </div>
                                      </div>
                             </div>
                          </div>
                    </div>
                </div>        
            </div>
            </div>
          </div> 
          <div class="role-btn">
               <a href="javascript:void(0)" @click="save">确认</a>
               <a href="javascript:void(0)" @click="close">取消</a>
           </div>
      </div>
    </div>
    </template>

    <script>
    export default {
      data(){
        return{
            name:"",
            space:0,
            features:[],//记录选中的权限id
            enable:1,
            featureList:[],
            levelOne:[],
            levelTwo:[],
            levelthree:[],
            isgroup:0,
        }
      },
      name: 'new-role',
      props:["show","ptitle","model"],
      watch:{
        model(val,oldVal){
            if (val) {
              this.name=val.name||"";
              this.space=val.space||0;
              this.enable=val.enable;
              this.isgroup=val.type||0;
              if(val.features){
                var arry = val.features.split(',');
                for(var i=0;i<arry.length;i++){
                    this.features.push(parseInt(arry[i]));
                }
              }else{
                this.features=[];
              }
            }else{
              this.name="";
              this.space=0;
              this.enable=1;
              this.features=[];
              this.isgroup=0;
            }
        },
        show(val,oldVal){
            if(!val){
              this.name="";
              this.space=0;
              this.enable=1;
              this.features=[];
              this.isgroup=0;
            }
        },
      },
      mounted:function(){
            //获取所有权限；
            this.getFeatures();
      },
      methods: {
           close () {
               this.$emit('closeEvent');
           },
           save(){
              var _this=this; 
              this.$validator.validateAll().then((result)=>{
                        if (result) {    
                            _this.$emit('saveEvent',_this.name,_this.space,_this.features,_this.enable,_this.isgroup);
                          }
              });
           },
           getFeatures(){
                this.$http.get('/systemManage/getFeatureTree'
                ).then(res=>{
                    var data=res.data;
                    var d;
                    if (data) {
                      d=$.parseJSON(data);
                    }
                    if (d.msgid!=200) {
                        console.log(d.msg);
                        return false;
                    }
                    this.featureList=d.data;
                })
           },
           getIndex(val){
            for(var i = 0; i<this.features.length; i++){
              if(val == this.features[i]){
                return i;
              }
            }
           },
           // 判断一个数组中是否包含另一个数组的任意一项
           isContained(a, b){
             if(!(a instanceof Array) || !(b instanceof Array)) return false;
             var icCont = [];
             for(var i = 0, len=a.length; i<len; i++){
               for(var j = 0, blen=a.length; j<blen; j++){
                if(a[i] == b[j]){
                  icCont.push(b[j])
                }
               }
              }
             if(icCont.length >0){
               return true;
              }else{
               return false;
             }
           },
           // 数组去重
            unique(arr){
                var result = [], hash = {};
                for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                    if (!hash[elem]) {
                        result.push(elem);
                        hash[elem] = true;
                    }
                }
                return result;
            },
           checkAll(e){
              var dom = e.currentTarget;
              var val = parseInt($(dom).attr("value"));
              var domArr = $(".title-right[value='"+val+"'] input");
              if($(dom).prop("checked")){          
                for(var i = 0; i < domArr.length; i++){
                    this.features.push(parseInt($(domArr[i]).attr("value")))
                }
                this.features = this.unique(this.features);
              }else{
                 for(var i = 0; i < domArr.length; i++){
                    this.features.removevalue(parseInt($(domArr[i]).attr("value")));
                  }
              }
           },
           checkTow(e){
              var dom = e.currentTarget;
              var val = parseInt($(dom).attr("value"));
              var domArr = $(".thridRole[value='"+val+"'] input");
              var fval = parseInt($(dom).parents(".title-right").attr("value"));
              this.levelTow = [];
              var self = this;
              this.featureList.forEach(function(item, i){
                  if(item.id == fval){
                    item.children.forEach(function(item, i){
                      self.levelTow.push(item.id)
                    });
                  }
              });
              if($(dom).prop("checked")){ 
                  this.features.push(fval);  
                for(var i = 0; i < domArr.length; i++){
                    this.features.push(parseInt($(domArr[i]).attr("value")))
                }
                this.features = this.unique(this.features);
              }else{
                 for(var i = 0; i < domArr.length; i++){
                    this.features.removevalue($(domArr[i]).attr("value"));
                }    
               var iscontent = this.isContained(this.features,this.levelTow);   
                if(!iscontent){
                  this.features.removevalue(fval);
                }
              }
           },
           checkthree(e){
                var dom = e.currentTarget;
                var val = parseInt($(dom).attr("value"));
                var oneVal = parseInt($(dom).parents(".title-right").attr("value"));
                var TowVal = parseInt($(dom).parents(".thridRole").attr("value"));
                var domArr = $(".fourole[value='"+val+"'] input");
                var self = this;
                this.levelthree = [];
                var leveltow = [];
                this.featureList.forEach(function(item, i){
                  if(item.id == oneVal){
                    item.children.forEach(function(item, i){
                       leveltow.push(item.id);
                      if(item.id == TowVal){
                        item.children.forEach(function(item, index){
                          self.levelthree.push(item.id);
                        });
                      }
                    });
                  }
              });
              if($(dom).prop("checked")){
                  this.features.push(oneVal); 
                  this.features.push(TowVal); 
                  for(var i = 0; i < domArr.length; i++){
                    this.features.push(parseInt($(domArr[i]).attr("value")))
                  }
                  this.features = this.unique(this.features);
              }else{
                  for(var i = 0; i < domArr.length; i++){
                    this.features.removevalue(parseInt($(domArr[i]).attr("value")));
                  }
                  var iscontent = this.isContained(this.features,this.levelthree);
                  if(!iscontent){
                      this.features.removevalue(TowVal);
                  }
                  var iscontentTwo = this.isContained(this.features,leveltow);
                  if(!iscontentTwo){
                      this.features.removevalue(oneVal);
                  }
              }

           },
           checkFour(e){
              var dom = e.currentTarget;
              var val = parseInt($(dom).attr("value"));
              var threeVal = parseInt($(dom).parents(".fourole").attr("value"));
              var TowVal = parseInt($(dom).parents(".thridRole").attr("value"));
              var oneVal = parseInt($(dom).parents(".title-right").attr("value"));
              var self = this;
              var levelFour = [];
              var levelthree = [];
              var leveltow = [];
                this.featureList.forEach(function(item, i){
                  if(item.id == oneVal){
                    item.children.forEach(function(item, i){
                       leveltow.push(item.id);
                      if(item.id == TowVal){
                        item.children.forEach(function(item, index){
                          levelthree.push(item.id);
                          if(item.id == threeVal){
                            item.children.forEach(function(item, index){
                                levelFour.push(item.id)
                            });
                          }
                        });
                      }
                    });
                  }
              });
              if($(dom).prop("checked")){
                  this.features.push(oneVal); 
                  this.features.push(TowVal); 
                  this.features.push(threeVal);
                  this.features = this.unique(this.features);
              }else{
                var iscontent = this.isContained(this.features,levelFour);
                if(!iscontent){
                  this.features.removevalue(threeVal);
                };
                var isContTwo = this.isContained(this.features,levelthree);
                if(!isContTwo){
                  this.features.removevalue(TowVal);
                };
                var iscontentOne = this.isContained(this.features,leveltow);
                if(!iscontentOne){
                  this.features.removevalue(oneVal);
                }
              }
           },
       }
    }
    </script>

    <style lang="scss">
    @media screen and (max-width: 1440px) {
      .new-role .content .role-form .enable label input{
        top:-0.2em !important;
      }
    }
    @media screen and (max-width: 1366px) {
      .new-role{
        height:40em !important;
      }
      .new-role .content{
        height:31em !important;
      }
     .new-role .conten-from{
          height:27em !important;
      }
    }
    .new-role{
            width:98em;
            height:53em;
            background:url("../../../assets/module/u10.png") no-repeat;
            background-size:100% 100%;
            position:absolute;
            z-index:10;
            top:5em;
            left:50%;
            margin-left:-49em;
            padding:0 0.6em 2em;
            .content{
                width:100%;
                height:45em;
                padding:0 0.2em;
                overflow:hidden;
             input[type="checkbox"]{
                            margin-left:2em;
                            position:relative;
                            top:0.1em;
                            left:-0.1em;
                         }

            label{
                font-weight:normal;
            }
            .role-top{
                width:100%;
                height:3em;
                font-size:1.2em;
                background-color:#0099ff;
                padding:0 2em;
                line-height:3em;

                p{
                    float:left;
                }
                span{
                    float:right;
                    font-size:2em;
                    cursor:pointer;
                }
            }
           .role-form{
            border-bottom:1px solid #222;
            padding:0 2em;
            .is-danger{
              padding-left:8em;
              margin-top:0;
            }
            p{
                margin-top:2em;

                span{
                    display:inline-block;
                    width:6em;
                    text-align:right;
                    margin-right:2em;
                }

                input[type="text"]{
                    width:20em;
                    height:2.5em;
                    border:1px solid #4c4c4c;
                    border-radius:5px;
                }
                label{
                    position:relative;
                    margin-left:2em;
                    margin-right:3em;
                        input{
                            position:absolute;
                            left:-2em;
                            top:-0.2em;
                        }
                }
            }
            .enable label input{
              top:0.2em;
            }
           }
           .resource-setting{
                clear:both;
                padding-top:2em;
                span{
                    float:left;
                    width:10%;
                }
                .right{
                    float:right;
                    width:85%;
                    p{
                        width:100%;
                        height:7em;
                        line-height:3em;
                        border:1px solid #222;                
                    }
                }
           }
           .MyResource{
            clear:both;
            padding-top:2em;
            span{
                    float:left;
                    width:10%;
                }
                .MyResource-right{
                    float:right;
                    width:85%;
                    overflow:hidden;
                    border:1px solid #222;  
                    padding-bottom:1em;

                    div{
                        width:100%;
                        padding-top:1em;
                        .inner{
                            width:13%;
                            float:left;
                        }
                        p{
                            width:85%;
                            padding:0.5em 0;
                            float:left;
                            background-color:#2c2c2c;
                            border:1px solid #272727;

                        }
                    }
                    .compositing{
                        width:100%;
                        .inner{
                            width:13%;
                            float:left;
                        }
                        .compositing-right{
                            float:left;
                            width:85%;
                            padding:0.5em 0;
                            background:rgba(#000000, 0.1);
                            border:1px solid #272727;
                        }
                    }
                }
           }
           .my-title{
                clear:both;
                padding-top:2em;
                span{
                    float:left;
                    width:10%;
                }
                .title-right{
                    float:right;
                    width:85%;
                    overflow:hidden;
                    border:1px solid #222;  
                    padding-bottom:1em;

                    .inner{
                            width:12%;
                            float:left;
                        }
                        .p-inner{
                            width:86%;
                            padding:0.5em 0;
                            float:left;
                            background-color:#2c2c2c;
                            border:1px solid #272727;

                        }

                    .title-bg{
                            float:left;
                            width:100%;
                            padding:0.5em 0;
                            background:rgba(#000000, 0.1);
                            border:1px solid #272727;
                            margin:0.2em 0;

                            .span-right{
                                width:20%;
                                 float:left;
                            }

                            .p-left{
                                width:80%;
                                float:left; 
                                background-color:#2c2c2c; 
                                border:1px solid #272727;
                                padding:0.5em 0;
                            }
                    }
                }
           }
          }
          .role-btn{
               width:100%;
               text-align:center;
               height:2em;
               clear:both;
               position:relative;
               top:3em;
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