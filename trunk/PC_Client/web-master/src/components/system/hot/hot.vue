<template>
    <div class="hot-setting">
        <h1>热度权重设置</h1>
        <div class="hot-div">
            <p>新上传内容热度值增加：</p>
            <input type="text" placeholder="100" v-model="upload" maxlength="9" v-validate="{'hotnumber':true}" name="新上传热度值">
            <span>热度值</span>
            <p class="is-danger" v-show="errors.has('新上传热度值')" >{{errors.first('新上传热度值')}}</p>
            <p class="tip">注：内容包含视频、音频、图片及文稿</p>
        </div>
        <div class="hot-div">
            <p>每天热度值减少：</p>
            <input type="text" placeholder="1" v-model="dayless" maxlength="9" v-validate="{'hotnumber':true}" name="热度值">
            <span>热度值</span>
            <p class="is-danger" v-show="errors.has('热度值')" >{{errors.first('热度值')}}</p>
        </div>
        <div class="hot-div">
            <p>用户每点一次赞增加：</p>
            <input type="text" placeholder="2" v-model="thumbsup" maxlength="9" v-validate="{'hotnumber':true}" name="点赞热度值">
            <span>热度值</span>
            <p class="is-danger" v-show="errors.has('点赞热度值')" >{{errors.first('点赞热度值')}}</p>
        </div>
         <div class="hot-div">
            <p>用户每评论一次增加：</p>
            <input type="text" placeholder="3" v-model="comment" maxlength="9" v-validate="{'hotnumber':true}" name="评论热度值">
            <span>热度值</span>
            <p class="is-danger" v-show="errors.has('评论热度值')" >{{errors.first('评论热度值')}}</p>
        </div>
        <div class="hot-div">
            <p>用户每浏览一次增加：</p>
            <input type="text" placeholder="1" v-model="browse" maxlength="9" v-validate="{'hotnumber':true}" name="浏览热度值">
            <span>热度值</span>
            <p class="is-danger" v-show="errors.has('浏览热度值')" >{{errors.first('浏览热度值')}}</p>
            <p class="tip">注：一个用户多次浏览同一条内容（包含视频、音频、图片及文稿），按1次计算；</p>
        </div>
        <div class="hot-div">
            <p>提交标注信息通过增加：</p>
            <input type="text" placeholder="3" v-model="mark" maxlength="9" v-validate="{'hotnumber':true}" name="标注通过热度值">
            <span>热度值</span>
            <p class="is-danger" v-show="errors.has('标注通过热度值')" >{{errors.first('标注通过热度值')}}</p>
        </div>
        <div class="save">
            <a href="javascript:void(0)" @click="saveData">保存</a>
        </div>
        <alert-tip :isShowtip="isShowtip" :message="mess" @closeTipEvent="closetip"></alert-tip>
    </div>
</template>
<script type="text/ecmascript-6">
import alertTip from "../../alertTip"
export default{
    data(){
        return{
            upload:100,
            dayless:1,
            thumbsup:2,
            comment:3,
            browse:1,
            mark:3,
            message:'',
            showTip:false,
            isShowtip:false,
            mess:'',
        }
    },
    components:{alertTip},
    mounted:function(){
        this.getHeats();
    },
    methods:{
        saveData(){
             this.$validator.validateAll().then((result)=>{
                if(result){
                  this.$http.post('/systemManage/saveHeatSettingParams',{
                        upload:this.upload,
                        dayless:this.dayless,
                        thumbsup:this.thumbsup,
                        comment:this.comment,
                        browse:this.browse,
                        mark:this.mark
                  }).then(res=>{
                    var  data=res.data;
                    var d;
                    if (data) {
                        d=$.parseJSON(data);
                    }
                    if (d.msgid!=200) {
                       this.isShowtip = true;
                       this.mess = '保存失败'
                      return false;
                    }
                    this.isShowtip = true;
                    this.mess = '保存成功'
                  }).catch(err=>{
                    console.log(err);
                  })
                }
            })
        },
        getHeats(){
                 this.$http.get('/systemManage/getHeatSettingParams'
                  ).then(res=>{
                    var  data=res.data;
                    var d;
                    if (data) {
                        d=$.parseJSON(data);
                    }
                    console.log(d);
                    if (d.msgid!=200) {
                      console.log(d.msg);
                      return false;
                    }
                    var h=d.data;
                    console.log(h);
                    this.upload=h.upload;
                    this.dayless=h.dayless;
                    this.thumbsup=h.thumbsup;
                    this.comment=h.comment;
                    this.browse=h.browse;
                    this.mark=h.mark;
                  }).catch(err=>{
                    console.log(err);
                  })
        },
        closetip(){
            this.isShowtip = false;
        },
    }
}
</script>
<style lang="scss">
.hot-setting{
        height: 83em;
        width: 76%;
        float: left;
        background: url(/static/img/u10.a529c5e.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 18%;
        top: 0;
        padding: 2em;
          h1{
            font-size:1.4em;
            height:3em;
            margin:0;
            line-height:2em;
            padding-left:3em;
            border-bottom:1px dashed #fff;
        }
        .is-danger{
            padding-left:0;
        }
        .hot-div{
            padding:1em 0 1em 4em;
            input[type="text"]{
                width:40em;
                height:2.5em;
                border:1px solid #666;
                border-radius:4px;
                margin-bottom:0.5em;
            }
        }
        .save{
            text-align:center;
            margin-top:10em;
            a{
                color:#fff;
                padding:0.5em 2em;
                background-color:#0099ff;
                text-decoration: none;
                border-radius:4px;
            }
        }
    }
</style>