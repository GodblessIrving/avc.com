<template>
<div v-if="isNew" class="masklayer">
    <div class="new-work">
        <div class="edit-top">
            <p>{{restitle}}转码模板</p>
            <span @click="closeNew();" style="font-size:2.2em">×</span>
        </div>
        <div class="content">
            <p class="formName">
                <span>转码模板名称：</span>
                <input type="text" placeholder="请输入转码模板名称..." v-model="name" maxlength="40" v-validate="{'required':true}" name="模板名称">
                <p class="is-danger" v-show="errors.has('模板名称')" >{{errors.first('模板名称')}}</p>
            </p>
            <p>
                <span>转码模式：</span>
                <label for="check1"><input type="radio" name="transcoding" value="1" id="check1" v-model="single">单入单出</label>
                <label for="check2"><input type="radio" name="transcoding" value="2" id="check2" v-model="single">单入多出</label>
            </p>
            <div class="super">
                <p v-show="isShow">超清（码率超过1.2Mbps，分辨率1920*1080）</p>
                <div>
                    <p>
                        <span>视频分辨率：</span>
                        <select name="" id="" v-model="size0">
                            <option value="1920*1080">1920*1080</option>
                            <option value="1440*816">1440*816</option>
                            <option value="1366*768">1366*768</option>
                            <option value="1280*720">1280*720</option>
                            <option value="1024*576">1024*576</option>
                            <option value="720*576">720*576</option>
                            <option value="720*480">720*480</option>
                            <option value="640*480">640*480</option>
                            <option value="640*360">640*360</option>
                            <option value="480*320">480*320</option>
                            <option value="480*272">480*272</option>
                        </select>
                    </p>
                    <p>
                        <span>视频码率：</span>
                        <select name="" id="" v-model="Vbitrate0">
                            <option value="0">自适应</option>
                            <option value="5000">5000</option>
                            <option value="4000">4000</option>
                            <option value="3000">3000</option>
                            <option value="2000">2000</option>
                            <option value="1200">1200</option>
                            <option value="1000">1000</option>
                            <option value="768">768</option>
                            <option value="512">512</option>
                            <option value="384">384</option>
                            <option value="256">256</option>
                            <option value="128">128</option>
                        </select>
                        <em>Kbps</em>
                    </p>
                    <p>
                        <span>视频帧率：</span>
                        <select name="" id="" v-model="framerate0">
                            <option value="0">同源</option>
                            <option value="25">25FPS</option>
                            <option value="30">30FPS</option>
                        </select>
                    </p>
                    <p>
                        <span>音频采样率：</span>
                        <select name="" id="" v-model="samplerate0">
                            <option value="0">同源</option>
                            <option value="8000">8000HZ</option>
<!--                             <option value="8000">8000HZ</option> -->
                            <option value="16000">16000HZ</option>
                            <option value="22050">22050HZ</option>
                            <option value="24000">24000HZ</option>
                            <option value="32000">32000HZ</option>
                            <option value="44100">44100HZ</option>
                            <option value="48000">48000HZ</option>
                        </select>
                    </p>
                     <p>
                        <span>音频码率：</span>
                        <select name="" id="" v-model="Abitrate0">
                            <option value="0">自适应</option>
                            <option value="320">320</option>
                            <option value="128">128</option>
                            <option value="64">64</option>
                            <option value="32">32</option>
                        </select>
                        <em>Kbps</em>
                    </p>
                    <p>
                        <span>音频声道：</span>
                        <select name="" id="" v-model="voice0">
                            <option value="0">同源</option>
                            <option value="1">单声道</option>
                            <option value="2">双声道</option>
                        </select>
                    </p>
                </div>
            </div>
            <div class="super" v-show="isShow">
                <p>高清（码率超过500Kbps，分辨率1280*720）</p>
                <div>
                   <p>
                        <span>视频分辨率：</span>
                        <select name="" id="" v-model="size1">
                            <option value="1920*1080">1920*1080</option>
                            <option value="1440*816">1440*816</option>
                            <option value="1366*768">1366*768</option>
                            <option value="1280*720">1280*720</option>
                            <option value="1024*576">1024*576</option>
                            <option value="720*576">720*576</option>
                            <option value="720*480">720*480</option>
                            <option value="640*480">640*480</option>
                            <option value="640*360">640*360</option>
                            <option value="480*320">480*320</option>
                            <option value="480*272">480*272</option>
                        </select>
                    </p>
                    <p>
                        <span>视频码率：</span>
                        <select name="" id="" v-model="Vbitrate1">
                            <option value="0">自适应</option>
                            <option value="5000">5000</option>
                            <option value="4000">4000</option>
                            <option value="3000">3000</option>
                            <option value="2000">2000</option>
                            <option value="1200">1200</option>
                            <option value="1000">1000</option>
                            <option value="768">768</option>
                            <option value="512">512</option>
                            <option value="384">384</option>
                            <option value="256">256</option>
                            <option value="128">128</option>
                        </select>
                        <em>Kbps</em>
                    </p>
                    <p>
                        <span>视频帧率：</span>
                        <select name="" id="" v-model="framerate1">
                            <option value="0">同源</option>
                            <option value="25">25FPS</option>
                            <option value="30">30FPS</option>
                        </select>
                    </p>
                    <p>
                        <span>音频采样率：</span>
                        <select name="" id="" v-model="samplerate1">
                            <option value="0">同源</option>
                            <option value="8000">8000HZ</option>
<!--                             <option value="8000">8000HZ</option> -->
                            <option value="16000">16000HZ</option>
                            <option value="22050">22050HZ</option>
                            <option value="24000">24000HZ</option>
                            <option value="32000">32000HZ</option>
                            <option value="44100">44100HZ</option>
                            <option value="48000">48000HZ</option>
                        </select>
                    </p>
                     <p>
                        <span>音频码率：</span>
                        <select name="" id="" v-model="Abitrate1">
                            <option value="0">自适应</option>
                            <option value="320">320</option>
                            <option value="128">128</option>
                            <option value="64">64</option>
                            <option value="32">32</option>
                        </select>
                        <em>Kbps</em>
                    </p>
                    <p>
                        <span>音频声道：</span>
                        <select name="" id="" v-model="voice1">
                            <option value="0">同源</option>
                            <option value="1">单声道</option>
                            <option value="2">双声道</option>
                        </select>
                    </p>
                </div>
            </div>
             <div class="super" v-show="isShow">
                <p>标清</p>
                <div>
                   <p>
                        <span>视频分辨率：</span>
                        <select name="" id="" v-model="size2">
                            <option value="1920*1080">1920*1080</option>
                            <option value="1440*816">1440*816</option>
                            <option value="1366*768">1366*768</option>
                            <option value="1280*720">1280*720</option>
                            <option value="1024*576">1024*576</option>
                            <option value="720*576">720*576</option>
                            <option value="720*480">720*480</option>
                            <option value="640*480">640*480</option>
                            <option value="640*360">640*360</option>
                            <option value="480*320">480*320</option>
                            <option value="480*272">480*272</option>
                        </select>
                    </p>
                    <p>
                        <span>视频码率：</span>
                        <select name="" id="" v-model="Vbitrate2">
                            <option value="0">自适应</option>
                            <option value="5000">5000</option>
                            <option value="4000">4000</option>
                            <option value="3000">3000</option>
                            <option value="2000">2000</option>
                            <option value="1200">1200</option>
                            <option value="1000">1000</option>
                            <option value="768">768</option>
                            <option value="512">512</option>
                            <option value="384">384</option>
                            <option value="256">256</option>
                            <option value="128">128</option>
                        </select>
                        <em>Kbps</em>
                    </p>
                    <p>
                        <span>视频帧率：</span>
                        <select name="" id="" v-model="framerate2">
                            <option value="0">同源</option>
                            <option value="25">25FPS</option>
                            <option value="30">30FPS</option>
                        </select>
                    </p>
                    <p>
                        <span>音频采样率：</span>
                        <select name="" id="" v-model="samplerate2">
                            <option value="0">同源</option>
                            <option value="8000">8000HZ</option>
<!--                             <option value="8000">8000HZ</option> -->
                            <option value="16000">16000HZ</option>
                            <option value="22050">22050HZ</option>
                            <option value="24000">24000HZ</option>
                            <option value="32000">32000HZ</option>
                            <option value="44100">44100HZ</option>
                            <option value="48000">48000HZ</option>
                        </select>
                    </p>
                     <p>
                        <span>音频码率：</span>
                        <select name="" id="" v-model="Abitrate2">
                            <option value="0">自适应</option>
                            <option value="320">320</option>
                            <option value="128">128</option>
                            <option value="64">64</option>
                            <option value="32">32</option>
                        </select>
                        <em>Kbps</em>
                    </p>
                    <p>
                        <span>音频声道：</span>
                        <select name="" id="" v-model="voice2">
                            <option value="0">同源</option>
                            <option value="1">单声道</option>
                            <option value="2">双声道</option>
                        </select>
                    </p>
                </div>
            </div>
            <p style="margin-top:2em;" v-if="isMoren">
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use"  value="1" v-model="enable">&nbsp;&nbsp;启用
                </label>
                <label for=""><input type="radio" name="use"  value="0" v-model="enable">&nbsp;&nbsp;禁用
                </label>
            </p>
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @click="save()">保存</a>
            <a href="javascript:void(0)" @mousedown="closeNew();">取消</a>
        </div>
  </div>
</div>
</template>
<script>
export default {
  data(){
    return{
        isShow:false,
        enable:0,
        templateList:[],
        name:'',
        single:1,
        Vbitrate0:0,
        Abitrate0:0,
        samplerate0:0,
        size0:'1920*1080',
        framerate0:0,
        voice0:0,
        resolution:2,
        Vbitrate1:0,
        Abitrate1:0,
        samplerate1:0,
        size1:'1280*720',
        framerate1:0,
        voice1:0,
        Vbitrate2:0,
        Abitrate2:0,
        samplerate2:0,
        size2:'720*480',
        framerate2:0,
        voice2:0,
        parameter:{},
        isMoren:true,
    }
  },
  watch:{
    single:function(){
        if(this.single == 1){
            this.isShow = false;
        }else{
            this.isShow = true;
        }
    },
    a:function(){
        if(this.model){
            this.name = this.model.name;
            console.log(this.model)
            if(this.model.enabled==2){
                this.isMoren = false;
            }else{
                this.isMoren = true;
            }
            this.enable = this.model.enabled;
            var tem = $.parseJSON(this.model.template);
            if(tem.length > 1){
                this.single = 2;
                this.Vbitrate0 = tem[0].video_bitrate;
                this.Abitrate0 = tem[0].audio_bitrate;
                this.samplerate0 = tem[0].audio_samplerate;
                this.size0 = tem[0].video_width +'*'+tem[0].video_height;
                this.framerate0 = tem[0].video_framerate;
                this.voice0 = tem[0].audio_channels;
                this.Vbitrate1 = tem[1].video_bitrate;
                this.Abitrate1 = tem[1].audio_bitrate;
                this.samplerate1 = tem[1].audio_samplerate;
                this.size1 = tem[1].video_width +'*'+tem[1].video_height;
                this.framerate1 = tem[1].video_framerate;
                this.voice1 = tem[1].audio_channels;
                this.Vbitrate2 = tem[2].video_bitrate;
                this.Abitrate2 = tem[2].audio_bitrate;
                this.samplerate2 = tem[2].audio_samplerate;
                this.size2 = tem[2].video_width +'*'+tem[2].video_height;
                this.framerate2 = tem[2].video_framerate;
                this.voice2 = tem[2].audio_channels;
            }else{
                this.single = 1;
                this.Vbitrate0 = tem[0].video_bitrate;
                this.Abitrate0 = tem[0].audio_bitrate;
                this.samplerate0 = tem[0].audio_samplerate;
                this.size0 = tem[0].video_width +'*'+tem[0].video_height;
                this.framerate0 = tem[0].video_framerate;
                this.voice0 = tem[0].audio_channels;
                this.resolution = tem[0].sharpness;
            }
        }else{
            this.enable =0;
            this.name = '';
            this.single =1;
            this.Vbitrate0=0;
            this.Abitrate0=0;
            this.samplerate0=0;
            this.size0='1920*1080';
            this.framerate0=0;
            this.voice0=0;
            this.resolution = 2;
            this.Vbitrate1=0;
            this.Abitrate1=0;
            this.samplerate1=0;
            this.size1='1280*720';
            this.framerate1=0;
            this.voice1=0;
            this.Vbitrate2=0;
            this.Abitrate2=0;
            this.samplerate2=0;
            this.size2='720*480';
            this.framerate2=0;
            this.voice2=0;
            this.isMoren = true;
        }
    },
  },
  props:["isNew","restitle","a","model"],
    methods: {
      save(){
        this.parameter={};
        this.parameter.name = this.name;
        this.parameter.enabled = this.enable;
        if(this.single == 1){
            var template=[];
            var data = {};
            data.video_bitrate = parseInt(this.Vbitrate0);
            data.audio_bitrate = parseInt(this.Abitrate0);
            data.audio_samplerate = parseInt(this.samplerate0);
            var a = this.size0.split('*');
            data.video_width = parseInt(a[0]);
            data.video_height = parseInt(a[1]);
            data.video_framerate = parseInt(this.framerate0);
            data.audio_channels = parseInt(this.voice0);
            data.sharpness = parseInt(this.resolution),
            template.push(data);
            this.parameter.template=template;
        }else{
            var template=[];
            var data = {};
            data.video_bitrate = parseInt(this.Vbitrate0);
            data.audio_bitrate = parseInt(this.Abitrate0);
            data.audio_samplerate = parseInt(this.samplerate0);
            var a = this.size0.split('*');
            data.video_width = parseInt(a[0]);
            data.video_height = parseInt(a[1]);
            data.video_framerate = parseInt(this.framerate0);
            data.audio_channels = parseInt(this.voice0);
            data.sharpness = 2,
            template.push(data);
            var data1 = {};
            data1.video_bitrate = parseInt(this.Vbitrate1);
            data1.audio_bitrate = parseInt(this.Abitrate1);
            data1.audio_samplerate = parseInt(this.samplerate1);
            var a = this.size1.split('*');
            data1.video_width = parseInt(a[0]);
            data1.video_height = parseInt(a[1]);
            data1.video_framerate = parseInt(this.framerate1);
            data1.audio_channels = parseInt(this.voice1);
            data1.sharpness = 1,
            template.push(data1);
            var data2 = {};
            data2.video_bitrate = parseInt(this.Vbitrate2);
            data2.audio_bitrate = parseInt(this.Abitrate2);
            data2.audio_samplerate = parseInt(this.samplerate2);
            var a = this.size2.split('*');
            data2.video_width = parseInt(a[0]);
            data2.video_height = parseInt(a[1]);
            data2.video_framerate = parseInt(this.framerate2);
            data2.audio_channels = parseInt(this.voice2);
            data2.sharpness = 0,
            template.push(data2);
            this.parameter.template=template;
        }
        var _this=this; 
        this.$validator.validateAll().then((result)=>{
            if (result) {    
                _this.$emit('saveNewEvent',_this.parameter);
              }
        });       
      },
      closeNew (){
            this.$emit('closeNewEvent');
            this.single = 1;
            this.name = '';
        }
    }
}
</script>

<style lang="scss">
    .new-work{
        width:72em;
        overflow:hidden;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:10em;
        left:50%;
        margin-left:-36em;
        padding:0.1em 0.5em 2em;

        em{
            font-style:normal;
        }
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding: 0 2em;
            box-sizing:border-box;

            p{
                float:left;
            }
            span{
                float:right;
                font-size:2em;
                cursor:pointer;
            }
        }
       .content{
            width:100%;
            padding:2em 4em;
            max-height:30em;
            overflow-y:auto;
            box-sizing:border-box;
            color:#fff;
            p{
                width:100%;
                span{
                    margin-right:1em;
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
            .formName{
                margin-bottom:2em;
                span{
                    margin:0;
                }
                input{
                    width:20em;
                    border:1px solid  #4d4d4d;
                    border-radius:5px;
                    height:2em;
                    padding-left:0.5em;
                }
            }
            .is-danger{
                padding-left:7.5em;
                position:relative;
                top:-1.5em;
            }
            .super{
                width:100%;
                height:auto;
                margin-top:10px;

                p{
                    padding-left:1em;
                }

                div{
                    width:100%;
                    overflow:hidden;
                    padding:0.5em 1em;
                    box-sizing:border-box;
                    border:1px solid #4d4d4d;
                    border-radius:5px;

                    p{
                        float:left;
                        width:33%;
                        margin-bottom:1em;

                        span{
                            width:7em;
                            text-align:right;
                            display:inline-block;
                            margin-right:0;
                        }

                        select{
                            color:#333;
                            width:8em;
                            height:2em;
                        }
                    }
                }
            }
       }
        .edit-btn{
            width:100%;
            text-align:center;
            margin-top:3em;
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