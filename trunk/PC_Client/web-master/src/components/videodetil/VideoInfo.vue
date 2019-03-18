<template>
  <div class="video-info" >
      <div class="top">
             <video-play 
                :resid="resid" 
                :cur="cur"
                :number="number"
                ref="play"
                :stutas="stutas"
                @addMark="addMark" 
                @playFail="opFail" 
                @downloadFail="opFail" 
                :canAdd="canAdd">
             </video-play>
             <video-mark class='video-mark'
                  :mark="mark"                               
                  :total = "isChange"
                  :stutas="stutas"
                  :submit="submit"
                  :empty = "empty"
                  :uid="uid"
                  :addmark = "addmark"
                  :markcount = 'markcount'
                  @subNewEvent = 'subtip'
                  @delNewEvent = 'delmark'
                  @copyNewEvent = 'copymark'
                  @searchNewEvent = 'searchmark'
                  @preViewNewEvent = 'previewMark'
                  @previewMymark = 'preMymark'>
             </video-mark>        	
      </div>
      <add-tip :isAdd="isAdd" :isVideo="true" :picPath="frame" :timestamp="timestamp" :content="description"
      :optype="optype" @closeNewEvent="closeAdd" @addNewEvent="saveMark"></add-tip>

      <mark-pic 
        :isText="true" 
        :marks="mymark" 
        :stutas="stutas"
        @edit="editMark" 
        @dele="deleMark" 
        @getCur="getCur">
      </mark-pic>

      <common-tip :isShow="iscommon"
                             :message="mess"
                             :iszhu = "iszhu"
                             @closeTipEvent="closeCommon"
                             @delObjEvent="saveCommon">
      </common-tip>
      <alert-tip :message='message'
                      :isShowtip='showTip'
                      @closeTipEvent = 'closeTip'>
      </alert-tip>
  </div>
</template>

<script>
import addTip from "./addTip"
import VideoPlay from "./VideoPlay"
import VideoMark from "./VideoMark"
import MarkPic from "./MarkPic"
import CommonTip from "../CommonTip"
import alertTip from '../alertTip'
export default {
  name: 'video-info',
  data(){
  	return{
             isChange:0,//表示标注状态;0表示变动;1表示有更新;
             stutas:'未审核',//标注的审核状态;
             markcount:0,
             mark:{},
             mymark:[],
             count:0,
             otherid:0,//复制别人标注时用到的别人id;
             //确认组件
            iscommon:false,
             mess:'',
             type:0,//组件当前操作类型,0清空,1删除,2复制
             //提示组件
             showTip:false,
             message:'',
             //标注编辑面板
             isAdd:false,
             description:'',
             timestamp:"00'00"+'"',
             frame:'',
             copyMark:false,
             optype:0,//0新增,1编辑;
             delMark:{},//即将删除的标注;
             markNum:0,
             index:0,
             iszhu:false,//显示注释
             submit:0,
             empty:0,
             canAdd:false,
             cur:0,
             number:0,
             addmark:0,
             markid:0,
  	}
  },
  props:["resid","uid"],
  computed:{
    detail:function(){
      return this.$parent.info;
    }
  },
  watch:{
    detail(val,oldVal){
      if(val){
        this.getResMarks(val);
      }
    },deep:true
  },
  components: { VideoPlay,VideoMark,MarkPic,CommonTip,addTip,alertTip},
  methods:{
          getResMarks(info){
              this.mark=info.mark;
              var marklist=this.mark.mymark;
              for(var i=0;i<marklist.length;i++){
                    var m=marklist[i];
                    var my={
                        resourcesid:this.resid,
                        uid:this.uid,
                        timestamp:m.timestamp,
                        description:m.description,
                        frame:m.frame,
                        type:m.type,
                        approvalstatus:m.approvalstatus,
                        id:m.id
                    }
                    this.mymark.push(my);
              }

              this.markcount=this.mark.mycount;
              if(this.markcount >= 1){
                this.empty = 1;
              }else{
                this.empty = 0;
              }
              var status=this.mark.status;
              this.stutas=this.getstutas(status);
              if(this.stutas == '未提交'){
                this.submit = 1;
              }else{
                this.submit = 0;
              }
        },
          //解析状态文本
          getstutas(val){
            var statusText='';
            switch(val) {
              case 0:
              statusText = '未提交'
              break;
            case 1:
            case 2:
              statusText = '审核中'
              break;
            case 3:
              statusText = '审核通过'
              break;
            case 4:
              statusText = '审核失败'
              break;
            default:
              statusText = ''
            }
            return  statusText;
          },
          //关闭提示框
          opFail(msg){
            this.message=msg;
            this.showTip=true;
          },
          closeTip(){
              this.showTip=false;
          },
          //标注相关;
          closeAdd(){
              this.isAdd=false;
              var _this=this.$refs.play;
              _this.firstplayer.play();
              _this.isStop=false;
          },
          addMark(src,timestamp){
              for(var i=0;i<this.mymark.length;i++){
                    var m=this.mymark[i];
                    if(m.type == 0){
                      if (m.timestamp==timestamp) {
                        this.message = '该时刻已存在标注!';
                        this.showTip = true;
                        this.closeAdd();
                        return false;
                      }
                    }
               }              
              this.frame=src;
              this.timestamp=timestamp;
              this.description='';
              this.isAdd=true;
              this.optype = 0;
          },
          saveMark(des,addr,timestamp){
            this.isAdd = false;
            this.$http.post('/Resource/SaveMarks',{
              rid:this.resid,
              uid:this.uid,
              frame:addr,
              timestamp:timestamp,
              description:des,
              type:0,
              mid:this.markid,
            }).then(res=>{
               var d = $.parseJSON(res.data);
                if(d){
                  if(d.msgid == 200){
                        this.getMyMark();
                        this.stutas = '未提交';
                    }else{
                      this.isShowtip = true;
                      this.message = '添加标注失败'
                    }
                 }
                this.submit = 1
            })           
          },
          editMark(m,id){
              this.markid = id;
              this.frame=m.frame;
              this.optype  = 1;
              this.timestamp=m.timestamp;
              this.description=m.description;
              this.isAdd=true;
          },
          deleMark(id){
              this.mess='你确定要删除该条标注?'
              this.iszhu = false;
              this.index=id;
              this.iscommon=true;
              this.type=1;
          },
        // 提交标注
        subtip(){
         this.$http.post('/Resource/SubMarks',{
            rid:this.resid,
            uid:this.uid,
            markarr:this.mymark
          }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  this.showTip = true;
                  this.message = '提交成功';                
                  this.stutas = '审核中';
                  this.markcount = d.data;
                  this.isChange = 0;
                  this.submit = 0;
                  this.empty = 0;
                  this.addmark = 0;
                  this.markNum = 0;
                  this.$emit('SaveEvent',this.markNum);
                }else{
                  this.showTip = true;
                  this.message = '提交失败'               
                }
              }
          }).catch(err=>{
            console.log(err);
          })
        },
        // 清空标注
        delmark(){
          this.iscommon = true;
          this.mess = '您确认清空所有标注吗';
          this.iszhu = false;
          this.type = 0;
        },
        //查找标注
        searchmark(val){
            this.$http.get('/Resource/GetMarks',{
              params:{
                rid:this.resid,
                name:val
              }
            }).then(res=>{
              var d = $.parseJSON(res.data);
              if(d){
                if(d.msgid == 200){
                  if(d.data.length > 0){
                    this.mark.othermark = d.data;
                  }else{
                    this.showTip = true;
                    this.message = '没有查到该老师的相关标注';
                  }
                }
              }
            })
          },
        // 复制别人的标注
        copymark(m){
          this.iscommon = true;
          this.mess = `您确定将“`+m.realname+`”的标注记录复制到“我的标注”记录中吗?`
          this.type = 2;
          this.iszhu = true;
          this.otherid = m.uid;
        },
        previewMark(val){
          this.otherid = val;
          this. getotherMark();
          this.submit = 0;
          this.isChange = 0;
          this.empty = 0;
          this.canAdd = true;
          this.markNum = 0;
          this.$emit('SaveEvent',this.markNum);
        },        
        // 获得他人标注详情并复制
      getotherMark(){
        this.mymark = [];
        this.$http.get('/Resource/GetMarksDetail',{
          params:{
            rid:this.resid,
            uid:this.otherid,
          }
        }).then(res=>{
          var d = $.parseJSON(res.data);
          if(d){
            if(d.msgid == 200){
              var data = d.data;
              for(var i = 0; i < data.length; i++){
                this.preViewMark = {};
                this.preViewMark.timestamp = data[i].timestamp;
                this.preViewMark.description = data[i].description;
                this.preViewMark.resourcesid = data[i].resourcesid;
                this.preViewMark.uid = data[i].uid;
                this.preViewMark.frame = data[i].frame;
                this.preViewMark.type = 10;
                this.addmark = 0;
                this.preViewMark.approvalstatus = 2;
                this.mymark.unshift(this.preViewMark);
              }
            }else{
                console.log(d.msg);
            }
          }
        }).catch(err=>{
          console.log(err)
        })
    },
    preMymark(){
      this.getMyMark();
        this.submit = 0;
        this.isChange = 0;
        this.canAdd = false;
    },
      getMyMark(){
         this.$http.get('/Resource/GetMarksDetail',{
            params:{
              rid:this.resid,
              uid:this.uid,
            }
          }).then(res=>{
            var d = $.parseJSON(res.data);
            if(d){
              if(d.msgid == 200){
                this.mymark = d.data;
                this.markcount = this.mymark.length;
                if(this.mymark.length > 0){
                  this.empty = 1;
                }else{
                  this.empty = 0;
                }
              }
            }
          })
      },
      // 关闭询问弹窗
      closeCommon(){
        this.iscommon = false;
      },
      saveCommon(){//0清空,1删除,2复制,3标注存在,编辑
        this.iscommon = false;
        if(this.type == 0){
                this.iscommon = false;
                this.$http.post('/Resource/DeleteMarks',{
                  rid:this.resid,
                  uid:this.uid,
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                      if(d.msgid == 200){
                        this.showTip = true;
                        this.message = '清空成功';
                        this.mymark = [];
                        this.isChange = 0;
                        this.submit = 0;
                        this.empty = 0;
                        this.markcount = 0;
                        this.addmark = 0;
                      }else{
                        this.showTip = true;
                        this.message = '清空失败'
                      }
                    }
                }).catch(err=>{
                  console.log(err);
                })
          }else if(this.type==1){
              this.$http.get('/Resource/MarkDeleteById',{
                  params:{
                        id: this.index
                  }
              }).then(res=>{
                 var d = $.parseJSON(res.data);
                  if(d){
                    if(d.msgid == 200){
                        this.showTip = true;
                        this.message = '删除成功'
                       this.getMyMark();
                    }else{
                        this.showTip = true;
                        this.message = '删除失败'
                    }
                  }
              })
          }else if(this.type == 2){
                this.$http.post('/Resource/CopyMarks',{
                      fid:this.otherid,
                      rid:this.resid,
                      tid:this.uid,
                  }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                      this.showTip = true;
                      if(d.msgid == 200){
                        this. getMyMark();
                        this.message = '复制成功';
                        this.isChange = 0;
                        this.submit = 0;
                        this.empty = 1;
                        this.addmark = 0;
                        this.markcount = this.mymark.length;
                      }else{
                        this.message = '复制失败';
                      }
                    }
                  });
          }else{
              this.iscommon = false;
              this.editMark(this.delMark);
              this.delMark={};
              // this.optype==1;
          }
      },
      getCur(time){
          this.number += 1;
          var timeArr = time.split("'");     
          var num = parseInt(timeArr[0]);
          var num1 = parseInt(timeArr[1]);
          var current = num*60 + num1;
          this.cur = current;
      },
    }
}
</script>

<style lang="scss">
	.video-info{
		width:65%;
		float:left;
		height:72em;
		margin-left:2%;

		.top{
			height:40em;
                    
			.video-mark{
				height:40em;
			}
		}
	}

</style>
