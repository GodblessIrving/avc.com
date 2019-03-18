<template>
    <div class="formwork">
        <div class="operation">
            <a href="javascript:void(0)" @click="toggleNew(1)">新建模板</a>
            <a href="javascript:void(0)" @click="deleteForm(1)">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索模板名称" v-model="keyword">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel" style="height:65em; overflow-y:auto;">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="5"><label for="checkAll" style="margin-bottom:0"><input type="checkbox" id="checkAll" @change="checkAll">All</label></th>
                        <th width="15">转码模板名称</th>
                        <th width="30">转码参数</th>
                        <th width="15">修改时间</th>
                        <th width="10">状态</th>
                        <th width="15">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in formworkList">
                        <td><input type="checkbox" :value="f.id" v-model="ids"></td>
                        <td :title="f.name">{{f.name}}</td>
                        <td :title="getInfo(f.template)">{{getInfo(f.template)}}</td>
                        <td>{{f.updatetime}}</td>
                        <td :class="[f.enabled == 2?'gray':(f.enabled==1?'green':'red')]">{{f.enabled == 2?'默认':(f.enabled==1?'启用':'禁用')}}</td>
                        <td>
                            <a href="javascript:void(0)" v-if="f.enabled != 2"  @click="setEnable(f.id,f.enabled)">{{f.enabled==1?'禁用':'启用'}}</a>
                            <a href="javascript:void(0)" @click="toggleNew(2,f)">编辑</a>
                            <a href="javascript:void(0)" @click="deleteForm(2,f.id,f.enabled)" v-if="f.enabled != 2">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <common-tip 
            :isShow="isDel" 
            :message="message"
            @closeTipEvent="close"
            @delObjEvent="sureOpration">
        </common-tip>
        <new-work 
            :isNew="isNew" 
            :restitle="restitle"
            :a="a"
            :model="model"
            @saveNewEvent="saveFormwork"
            @closeNewEvent="closeNew()">
        </new-work>
        <alert-tip :isShowtip="isShowtip" :message="mess" @closeTipEvent="closeTip"></alert-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonTip from "../../CommonTip"
    import NewWork from "./NewWork"
    import alertTip from "../../alertTip"
    export default{
        data () {
             return {
                isDel:false,
                isNew:false,
                message:"",
                formworkList:[],
                ids:[],
                restitle:'',
                id:null,
                isShowtip:false,
                mess:'',
                a:1,
                model:null,
                status:1,
                type:1,
                keyword:'',
             };
         },
         watch:{
            ids:function(){
              if(this.ids.length < this.formworkList.length){
                $("#checkAll").prop("checked",false);
              }else if(this.ids.length>0&&this.ids.length == this.formworkList.length){
                $("#checkAll").prop("checked",true);
              }
            }
         },
        components:{CommonTip,NewWork,alertTip},
        mounted:function(){
            this.getFormwork();
        },
        methods: {
            // 获取所有模板
            getFormwork(){
                this.$http.get('/transcoding/GetTemplate',{
                    params:{
                        name:this.keyword
                    }
                }).then(res=>{
                    this.ids = [];
                    $("#checkAll").prop("checked",false);
                    var d = $.parseJSON(res.data);
                    if(d){
                        if(d.msgid == 200){
                           this.formworkList = d.data;
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            search(){
                this.getFormwork();
            },
            // 解析所有模板参数
            getInfo(template){
                var tem = $.parseJSON(template);
                var video_bitrate = [],
                      audio_bitrate = [],
                      audio_samplerate = [],
                      resolution = [],
                      video_framerate = [],
                      audio_channels = [];
                for(var i = 0; i<tem.length; i++){
                    if(tem[i].video_bitrate == 0){
                        var video = '自适应';
                        video_bitrate.push(video);
                    }else{
                        video_bitrate.push(tem[i].video_bitrate+'kbps');
                    }
                    if(tem[i].audio_bitrate == 0){
                        var audio = '自适应';
                        audio_bitrate.push(audio);
                    }else{
                        audio_bitrate.push(tem[i].audio_bitrate+'kbps');
                    }
                    if(tem[i].audio_samplerate == 0){
                        var samplerate = '同源';
                        audio_samplerate.push(samplerate);
                    }else{
                        audio_samplerate.push(tem[i].audio_samplerate+'Hz');
                    }
                    if(tem[i].video_framerate == 0){
                        var frame = '同源';
                        video_framerate.push(frame);
                    }else{
                        video_framerate.push(tem[i].video_framerate);
                    }
                    resolution.push(tem[i].video_width +'*'+tem[i].video_height);
                    if(tem[i].audio_channels == 1){
                        tem[i].audio_channels = '单声道'
                    }else if(tem[i].audio_channels == 2){
                        tem[i].audio_channels = '双声道'
                    }else{
                        tem[i].audio_channels = '同源'
                    }
                    audio_channels.push(tem[i].audio_channels);
                }
                video_bitrate = video_bitrate.join('、');
                audio_bitrate = audio_bitrate.join('、');
                audio_samplerate = audio_samplerate.join('、');
                resolution = resolution.join('、');
                video_framerate = video_framerate.join('、');
                audio_channels = audio_channels.join('、');
                return `视频分辨率：`+resolution+`，视频码率：`+video_bitrate+`，视频帧率：`+video_framerate+`，音频采样率：`+audio_samplerate+`，音频码率：`+audio_bitrate+`，音频声道：`+audio_channels
            },
            // 新建弹窗
            toggleNew(type,f){
                this.ids = [];
                if(type == 1){
                    this.id = null;
                    this.model = null;
                    this.restitle='新建'
                }else{
                    if(f.enabled == 1){
                        this.isShowtip = true;
                        this.mess = '该模板为“启用”状态，请先禁用后再尝试编辑操作！';
                        return
                    }
                    this.id = f.id;
                    this.restitle='编辑';
                    this.model = f;
                }
                this.isNew = true;
                this.a = this.a + 1;
             },
             // 删除按钮询问
             deleteForm(type,id,enabled){
                this.type = 2;
                if(type == 1){
                    if(this.ids.length < 1){
                        this.isShowtip = true;
                        this.mess = '请选择要删除的模板';
                        return
                    }else{
                        this.isDel = true;
                        this.message = '您确定删除选择的转码模板吗？'
                    }
                }else{
                    if(enabled == 1){
                        this.isShowtip = true;
                        this.mess = '该模板为“启用”状态，请先禁用后再尝试删除操作！';
                        return
                    }else{
                        this.ids = [];
                        this.isDel = true;
                        this.message = '您确定删除该转码模板吗？'
                        this.ids.push(id);
                    }
                }              
             },
             // 设置启用或禁用
             setEnable(id,enable){
                this.ids = [];
                this.type = 1;
                this.id = id;
                if(enable == 0){
                    this.status = 1;
                    for(var i = 0; i < this.formworkList.length; i++){
                        if(this.formworkList[i].enabled == 1){
                            this.isDel = true;
                            this.message = '您确定启用该转码模板吗，启用后原先的转码模板将会被替代？';
                            return
                        }else{
                            this.isDel = true;
                            this.message = '您确定启用该模板吗？'
                        }
                    }
                }else if(enable == 1){
                    this.status = 0;
                    this.isDel = true;
                    this.message = '您确定禁用该模板吗？'
                }
             },
             // 对话框确认操作
             sureOpration(){
                if(this.type ==1){
                    this.setFormworkEnable();
                }else if(this.type ==2){
                    this.deleItem();
                }
             },
             // 设置启用禁用请求
             setFormworkEnable(){
                this.$http.get('/transcoding/EnableTemplate',{
                    params:{
                        id:this.id,
                        enabled:this.status
                    }
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isDel = false;
                        this.isShowtip = true;
                        console.log(d)
                        if(d.msgid == 200){
                            if(d.data){
                                if(this.status == 1){
                                    this.mess = '模板启用成功'
                                }else{
                                    this.mess = '模板禁用成功'
                                }
                                this.getFormwork();
                            }else{
                                if(this.status == 1){
                                    this.mess = '模板启用失败'
                                }else{
                                    this.mess = '模板禁用失败'
                                }
                            }
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
             },
             // 删除请求
             deleItem(){
                this.$http.post('/transcoding/DeleteTemplate',{
                    ids:this.ids
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isDel = false;
                        this.isShowtip = true;
                        this.ids = [];
                        if(d.msgid == 200){
                            if(d.data){
                                this.mess = '删除成功';
                                this.getFormwork();
                            }else{
                                this.mess = '删除失败'
                            }
                        }else{
                            this.mess = '删除失败'
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                })
             },
            // 新建或编辑保存
            saveFormwork(parameter){
                if(!parameter.name){
                    this.isShowtip = true;
                    this.mess = "请填写模板名称";
                    return
                }
                this.$http.post('/transcoding/SaveTemplate',{
                    id:this.id,
                    name:parameter.name,
                    enabled:parameter.enabled,
                    templateList:parameter.template
                }).then(res=>{
                    var d = $.parseJSON(res.data);
                    if(d){
                        this.isNew = false;
                        this.isShowtip = true;
                        if(d.msgid == 200){
                            if(d.data){
                                if(this.restitle=='新建'){
                                    this.mess = '新建成功';
                                }else{
                                    this.mess = '编辑成功';
                                }
                                this.getFormwork();
                            }else{
                                if(this.restitle=='新建'){
                                    this.mess = '新建失败';
                                }else{
                                    this.mess = '编辑失败';
                                }
                            }
                        }else{
                            console.log(d.msg)
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 全选
            checkAll(){
                if($("#checkAll").prop("checked")){
                    this.ids = [];
                    for(var i = 0; i < this.formworkList.length; i++){
                        this.ids.push(this.formworkList[i].id);
                    }                                    
                }else{
                    this.ids = [];
                }
            },
            closeTip(){
                this.isShowtip = false;
            },
            close(){
                this.isDel = false;
                this.ids = [];
            },
            closeNew(){
                this.isNew = false;
            }
         }
    }
</script>
<style lang="scss">
.formwork{
        .operation{
            width:100%;
            padding:1em;
            overflow:hidden;

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

            select{
                height:2em;
                margin-top:1em;
                color:#999;
                margin-left:1em;
                float:left;
            }
	.time{
		float:left;
		margin-left:1em;
		margin-top:1em;

		div{
			width:9em;
			height:2em;

			input{
				height:2em;
			}
			.el-input__icon{
				line-height:2em !important;
			}
		}
	}
        }
        
    }
</style>