<template>
    <div class="first">
        <ul>
            <li>
                <p class="left">{{mestitle}}名称：</p>
                <p class="right shenglue" v-show="!isedit" :title="profile.title">{{profile.title}}</p>
                <input type="text" v-show="isedit" v-model="profile.title">
            </li>
            <li>
                <p class="left">分      类：</p>
                <p class="right shenglue" v-show="!isedit" :title="profile.cname">{{profile.cname}}</p>
                <select name="" id="" v-show="isedit" v-model="profile.cname">
                    <option v-for="c in classList" :value="c.name">{{c.name}}</option>
                </select>
            </li>
            <li>
                <p class="left">来    源：</p>
                <p class="right shenglue" v-show="!isedit" :title="profile.sname">{{profile.sname}}</p>
                <select name="" id="" v-show="isedit" v-model="profile.sname">
                    <option value="" v-for="s in sourceList" :value="s.name">{{s.name}}</option>
                </select>
            </li>
            <li>
                <p class="left">创建时间：</p>
                <p class="right shenglue" :title="profile.createtime">{{profile.createtime}}</p>
            </li>
            <li v-show="isWord">
                <p class="left">文稿格式：</p>
                <p class="right">{{format}}</p>
            </li>
            <li v-show="isWord">
                <p class="left">页    数：</p>
                <p class="right">{{count}} 页</p>
            </li>
            <li v-show="isAudio">
                <p class="left">{{mestitle}}时长：</p>
                <p class="right">{{duration}}</p>
            </li>
            <li v-show="isAudio">
                <p class="left">{{mestitle}}格式：</p>
                <p class="right">{{format}}</p>
            </li>
            <li v-show="isVideo">
                <p class="left">{{mestitle}}分辨率：</p>
                <p class="right">1280*720</p>
            </li>
            <li v-show="isPic">
                <p class="left">图册张数：</p>
                <p class="right">{{profile.count}} 张</p>
            </li>
            <li>
                <p class="left">{{mestitle}}大小：</p>
                <p class="right">{{getsize(profile.size)}}MB</p>
            </li>
            <li>
                <p class="left" v-show="!isMark">{{mestitle}}标签：</p>
                <p class="right" v-show="!isedit">
                    <span v-for="t in tipArr">{{t}}</span>
                </p>
                <div style="float:left; width:60%;" v-show="isedit">
                    <div style="width:100%; overflow:hidden;" class="tipBox">
                        <p v-for="t in tipArr" style="background-color:#0099ff; padding:3px 5px; margin-right:5px;float:left;">{{t}}</p>
                        <p v-bind:class="{ 'blue-add' : !isAdd, 'gray-add': isAdd}" class="Audiotip" @click="toggle"></p>
                     </div>
                     <p class="addtip" v-show="isAdd" style="margin-bottom:2em; clear:both;position:relative; top:0em; width:15em;">
                           <input type="text" v-model="tip" style="width:40%;margin-right:10px;" @change="checkTipExist()">
                           <a href="javascript:void(0)" @click="saveTip()">保存</a>
                           <a href="javascript:void(0)" @click="closeadd()">取消</a>
                     </p>
                   </div>
            </li>
            <li>
                <p class="left">内容简介：</p>
                <p class="right" :title="profile.description"  v-show="!isedit" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 8;overflow: hidden; height:11.19em;">{{profile.description}}</p>
                <textarea cols="21" rows="8" v-show="isedit" v-model="profile.description" maxlength="200"></textarea>
            </li>
<!--             <li>
                <p class="left">本集内容：</p>
                <p class="right"  v-show="!isedit">{{profile.description}}</p>
                <textarea cols="25" rows="8" v-show="isedit" v-model="profile.description" maxlength="200"></textarea>
            </li> -->
            <li class="pic-line" v-show="isPic">
                <p class="left">图片大小：</p>
                <p class="right">{{size}}MB</p>
            </li>
            <li v-show="isPic">
                <p class="left">图片分辨率：</p>
                <p class="right">{{resolution}}</p>
            </li>
            <li v-show="isPic">
                <p class="left">图片格式：</p>
                <p class="right">{{format}}</p>
            </li>
            <li v-show="isPic">
                <p class="left">图片描述：</p>
                <p class="right">{{description}}</p>
            </li>
            <li class="subtn" v-show="isedit">
                <a href="javascript:void(0)" class="submit" @click="subEdit">提交</a>
                <a href="javascript:void(0)" class="nosub" @click="cancel">取消</a>
            </li>
        </ul>
        <alert-tip 
          :isShowtip="isShowtip"
          :message="mess"
          @closeTipEvent="close">
        </alert-tip>
    </div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../alertTip"
export default{
    name:"first",
    data(){
        return{
            isAdd:false,
            tip:'',
            tiplist:[],
            title:'',
            cname:'',
            sname:'',
            descriptions:'',
            cid:'',
            sid:'',
            isShowtip:false,
            mess:'',
            siz:'',
        }
    },
    components:{alertTip},
    props:["isPic","isAudio","isedit","mestitle","profile","tipArr","size","description","resolution","format","isWord","count","isVideo","duration","classList","sourceList","tid","isMark"],
    methods:{
        getsize(size){
            var a = size/1048576;
            var siz = a.toFixed(2);
            return siz
        },
        // 添加标签
        toggle(){
            this.isAdd = !this.isAdd;
            this.tip = '';
        },
        // 取消添加标签
        closeadd(){
            this.isAdd = false;
            this.tip = '';
            $(".is-danger").remove();
        },
        // 判断标签是否重复
        checkTipExist(){
            if (this.tipArr.length==0) {
                return false;
            }
            if (this.tipArr.contain(this.tip)) {
                var error='<p class="is-danger">该标签已经被添加过了</p>';
                $(".addtip").append(error);
                this.tipExist=true;
            }else{
                $(".addtip").find('.is-danger').remove();
                this.tipExist=false;
            }
        },
        // 保存标签
        saveTip(){
            if (this.tip==''||this.tipExist) {
                return false;
            }
            var labelling = '<p class="addTips" >'+this.tip+'<span class="dele" data-tip="'+this.tip+'">X</span></p>';
            $(".Audiotip").before(labelling);
            this.tiplist.push(this.tip);
            this.isAdd = false;
            this.tip='';
            var _this=this;
            $(".dele").click(function(){
                $(this).parents("p").remove();
                var val=$(this).data("tip");
                _this.tiplist.removevalue(val);
            })
        },
        // 取消编辑
        cancel(){
            $(".addTips").remove();
            this.tiplist = [];
            this.$emit('closeNewEvent');
        },
        // 提交编辑
        subEdit(){
            for(var i = 0; i < this.classList.length; i++){
                if(this.classList[i].name == this.profile.cname){
                    this.cid = this.classList[i].id;
                }
            }
            for(var i = 0; i < this.sourceList.length; i++){
                if(this.sourceList[i].name == this.profile.sname){
                    this.sid = this.sourceList[i].id;
                }
            }
            if(this.tipArr){
                if(this.tipArr.length>=1){
                    for(var i = 0; i < this.tipArr.length; i++){
                        this.tiplist.push(this.tipArr[i]);
                    }
                }
            }
            this.$http.post('task/EditTask',{
                tid:this.tid,
                title:this.profile.title,
                cid:this.cid,
                sid:this.sid,
                label:this.tiplist.join(","),
                des:this.profile.description
            }).then(res=>{
                var d = $.parseJSON(res.data);
                if(d){
                    if(d.msgid == 200){
                        if(d.data){
                            this.isShowtip = true;
                            this.mess = '提交成功';
                            this.$emit('addNewEvent');
                        }else{
                            this.isShowtip = true;
                            this.mess = '提交失败';
                        }
                    }
                }               
            }).catch(err=>{
                console.log(err)
            })
        },
        close(){
            this.isShowtip = false;
        },
    }
}
</script>
<style lang="scss">
    .first{
        width:100%;
        height:60em;
        background-color:#303030;
        border:1px solid #282828;
        padding:2em 0.2em;
        overflow-y:auto;
        border-radius:0 0 5px 5px;
        box-sizing:border-box;
        .is-danger{
            clear:both;
            padding-left:0.5em;
            margin-top:0.5em;
        }
        .pic-line,.audio-line{
            margin-top:1em;
            border-top:1px dashed #999;
            padding-top:1em;
        }
        .subtn{
            margin-top:2em;
            text-align:center;
            a{
                background-color:#0099ff;
                padding:15px 15px;
                cursor:pointer;
                line-height:2em;
                margin-left:1em;
                border-radius:10px;
                color:#fff;
                text-decoration: none;
            }
        }
        li{
            width:100%;
            overflow:hidden;
            clear:both;
            .left{
                float:left;
                width:21%;
                text-align:right;
                height:2em;
            }
            input{
                float:left;
                margin-left:5%;
                width:55%;
                height:1.8em;
                border:1px solid #eee;
                border-radius:3px;
            }
            select{
                float:left;
                margin-left:5%;
                width:40%;
                color:#666;
            }
            textarea{
                float:left;
                border:1px solid #eee;
                border-radius:3px;
                background:none;
                resize:none;
            }
            .Audiotip{
                width:2em;
                height:2em;
                margin-left:5%;
                margin-top:-3px;
                cursor:pointer;
                float:left;
            }
            .addTips{
                padding:3px 5px;
                background-color:#0099ff;
                float:left;
                margin-right:3px;
                .dele{
                    margin-left:5px;
                    cursor:pointer;
                }
            }
            .addtip{
                a{
                    text-decoration: none;
                    cursor:pointer;
                }
            }
             .blue-add{
                    background:url("../../assets/resouce/uadd.png") no-repeat center;
                    background-size:100%;
             }
             .gray-add{
                    background:url("../../assets/resouce/uadd1.png") no-repeat center;
                    background-size:100%;
             }
             .shenglue{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
             }
            .right{
                float:left;
                margin-left:5%;
                width:70%;

                span{
                    display:inline-block;
                    padding:0.2em;
                    margin-bottom:0.5em;
                    background-color:#0099ff;
                    margin-right:5px;
                }
            }
        }
    }
</style>