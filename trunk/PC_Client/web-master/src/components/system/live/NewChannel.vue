<template>
<div v-if="isNew" class="masklayer">
    <div class="new-channel">
        <div class="edit-top">
            <p>{{title}}频道</p>
            <span @click="close" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>频道封面：</span>
                <span style="display:inline-block; width:5em; margin-right:1em; height:5em; overflow:hidden; text-align:center;position:relative; top:2em;">
                    <span class="fengmian" v-if="cover" v-bind:style = " { 'background-image' : 'url('+cover+')'} "></span>
                    <span class="fengmian" v-else></span>
                    <!-- <img :src="cover" :onerror="dfCover" width="100%"> -->
                    <em style="font-style:normal; cursor:pointer; color:#0099ff;position:relative;top:-1em">上传
                        <input type="file" accept="image/*" @change="uploadPhoto" id="myfile" style="opacity:0; position:relative;top:-2em;left:0em;">
                    </em>
                </span>
                <em style="font-style:normal">建议尺寸（220*130）</em>
            </p> 
            <p style="position:relative">
                <span style="margin-right:0;"> 频道名称：</span>
                 <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text" placeholder="请输入频道名称" v-model="name" v-validate="{'required':true}" maxlength="40" name="频道名称" style="position:absolute; left:11.3em;">
            </p> 
            <p class="is-danger" v-show="errors.has('频道名称')" >{{errors.first('频道名称')}}</p>
            <p>
                <span>频道位置：</span>
                <input type="text" placeholder="请输入频道位置" v-model="position" v-validate="{'required':true}" maxlength="40" name="频道位置">
            </p> 
            <p class="is-danger" v-show="errors.has('频道位置')" >{{errors.first('频道位置')}}</p> 
            <p>
                <span>频道URL：</span>
                <input type="text" placeholder="例:rtmp://192.168.1.62/live/123" v-model="url" v-validate="{'required':true}" name="频道URL">
            </p>
             <p class="is-danger" v-show="errors.has('频道URL')" >{{errors.first('频道URL')}}</p>
            <div class="time">
                <span class="time-title">播出时间：</span>
                <div class="time-inner">
                    <label><input type="checkbox" value="0" v-model="repeat">每天重复</label>
                   <el-time-select
                        placeholder="起始时间"
                        v-model="starttime"
                        value-format="HH:mm"
                        :disabled="repeat!=1"
                        :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:59'
                        }">
                    </el-time-select>
                    <el-time-select
                                placeholder="结束时间"
                                v-model="endtime"
                                value-format="HH:mm"
                                :disabled="repeat!=1"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:59',
                                    minTime: starttime
                                 }">
                    </el-time-select>
                     <label><input type="checkbox" value="0" v-model="setdate">设置起止日期</label>
                     <el-date-picker
                        v-model="startdate"
                        type="date"
                        :picker-options="pickerOptions1"
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期"
                        :disabled="setdate!=1">
                    </el-date-picker>
                    <el-date-picker
                        v-model="enddate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="结束日期"
                        :disabled="setdate!=1">
                    </el-date-picker>
                </div>
            </div> 
             <p style="top:15px;">
                <span>对接课表：</span>
                <input type="text" placeholder="请输入该频道的课表接口地址" v-model="curriculum">
                <em>测试</em>
            </p>  
            <p style="margin-top:3em;">
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use" value="1" v-model="enabled">&nbsp;&nbsp;启用
                </label>
                <label for=""><input type="radio" name="use" value="0" v-model="enabled">&nbsp;&nbsp;禁用
                </label>
            </p>
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @click="save">保存</a>
            <a href="javascript:void(0)" @click="close">取消</a>
        </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'new-channel',
  data(){
        return{
            id:0,
            cover:'',
            name:'',
            position:'',
            url:'',
            repeat:0,//0或1
            starttime:'',//时间字符串
            endtime:'',
            setdate:0,
            startdate:'',//日期字符串
            enddate:'',
            curriculum:'',//url地址格式
            enabled:1,
            pickerOptions1:{
              disabledDate(time) {
                const curDate = new Date();
                const preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
                return time.getTime() < preDate.getTime();
              },
            },
            dfCover:'this.src="'+require('../../../assets/live/u175.png')+'"',
        }
  },
  props:["isNew",'initdata',"title"],
  watch:{
        initdata(val,oldval){
            if (val!=null) {
                this.id=val.id||0;
                this.cover=val.channelcover||'';
                this.name=val.channelname||'';
                this.position=val.channelposition||'';
                this.url=val.channelurl||'';
                this.repeat=val.repeat;
                if(this.repeat){
                    this.starttime=val.starttime;
                    this.endtime=val.endtime;
                }else{
                    this.starttime='';
                    this.endtime='';
                }
                this.setdate=val.startday;
                if(this.setdate){
                    this.startdate=val.startdate;
                    this.enddate=val.enddate;
                }else{
                    this.startdate='';
                    this.enddate='';
                }
                this.curriculum=val.curriculum||'';
                this.enabled=val.enabled;
            }else{
                this.id=0;
                this.cover='';
                this.name='';
                this.position='';
                this.url='';
                this.repeat=0;
                this.starttime='';
                this.endtime='';
                this.setdate=0;
                this.startdate='';
                this.enddate='';
                this.curriculum='';
                this.enabled=1;
            }
        },
        isNew:function(){
          if(!this.isNew){
              this.id=0;
              this.cover='';
              this.name='';
              this.position='';
              this.url='';
              this.repeat=0;
              this.starttime='';
              this.endtime='';
              this.setdate=0;
              this.startdate='';
              this.enddate='';
              this.curriculum='';
              this.enabled=1;
          } 
        },
  },
  methods: {
      close (){
            this.$emit('closeEvent');
        },
        save(){
          var _this=this;
          this.$validator.validateAll().then((result)=>{
              if (result) {
                if(_this.startdate == ''){
                  let date = new Date();
                  let year = date.getFullYear() // 年
                  let month = date.getMonth() + 1; // 月
                  let day  = date.getDate();
                  _this.startdate = year+'-'+month+'-'+day; 
                }
                _this.$emit('saveEvent',_this.id,_this.cover,_this.name,_this.position,_this.url,_this.repeat,_this.starttime,_this.endtime,_this.setdate,_this.startdate,_this.enddate,_this.curriculum,_this.enabled);
              }
          });
        },
        uploadPhoto(){
              var myfile=document.getElementById('myfile');
              var _this=this;
              var blob=myfile.files[0];
              var filename=blob.name;
              console.log(blob);

              //加载图片获取图片真实宽度和高度
              var reader=new FileReader();
              reader.onload=function(e){
                    console.log(e);
                    var image = new Image();
                    image.onload=function(e){
                         var width = image.width;
                         var height = image.height;
                         console.log(width,height,blob.size);
                         if(width<220||height<130||blob.size>2*1024*1024){
                              _this.$emit('invalidImgEvent');
                              return false;
                         }

                          //读取文件的MD5
                          _this.readImageMD5(blob,filename); 
                    }
                    image.src=e.target.result;
              }
              reader.readAsDataURL(blob);
            },
            readImageMD5(blob,filename){
                  var fileReader=new FileReader();
                  var _this=this;

                  fileReader.onload=function(e){
                        var spark=new SparkMD5.ArrayBuffer();
                        spark.append(e.target.result);
                        var md5=spark.end();
                        this.frameMD5=md5;
                        console.log(md5,blob.size);

                        _this.$http.get('/storage/getuploadpath',{
                            params:{
                                fileid:md5,
                                filesize:blob.size,
                                ntimeout:2,
                                t:(new Date()).getTime()
                            }
                        }).then(res=>{
                          console.log(res);
                                var d=$.parseJSON(res.data);
                                if (d) {
                                    if (d.msgid==200) { 
                                      console.log(d.data);                                              
                                        var json=JSON.parse(d.data);
                                        var file_addr=json.file_addr;
                                        var addr=json.upload_addr;

                                        if(file_addr&&addr===null){
                                           console.log('头像秒传');
                                           _this.cover=file_addr;
                                            return false; 
                                        }

                                        var path;
                                        for(var i=0;i<addr.length;i++){
                                              var ad=addr[i];
                                              if (ad.indexOf('ws:')==0) {
                                                path=ad;
                                                break;
                                              }
                                        }
                                        var uri=path+'file_id='+md5+'&file_size='+blob.size+'&file_name='+Base64.encode(filename);
                                        console.log(uri);
                                        var ws=_this.createSocket(uri,function(){
                                              ws.send(blob);
                                              var timer= setInterval(function(){
                                                      if (ws.bufferedAmount===0) {
                                                          ws.close();
                                                          clearInterval(timer);
                                                          _this.getFilePath(md5);
                                                      }
                                                  }, 100);
                                        });
                                      }else{
                                        console.log(d.msg);
                                      }
                                }
                        }).catch(err=>{
                          console.log(err);
                        });
                    };

                   fileReader.readAsArrayBuffer(blob);
            },
            createSocket(uri,callback){
                var ws = new WebSocket(uri);
                ws.onopen = function () {
                    console.log('connected成功');
                    if (callback)
                        callback();
                }
                ws.onmessage = function (e) {
                    var data = e.data;
                    console.info(data);
                }
                ws.onclose = function (e) {
                    console.info(e);
                    console.log('链接断开');
                }
                ws.onerror = function (e) {
                    console.info(e);
                    console.log('传输中发生异常');
                }
                return ws;
            },
            getFilePath(md5){
                      var _this=this;
                      
                      var code=setInterval(function(){
                        $.ajax({
                          url: _this.ajaxBaseUrl+'/storage/getuploadstatus',
                          type: 'GET',
                          dataType: 'json',
                          async : false,
                          cache:false,
                          data: {fileid: md5},
                        })
                        .done(function(res) {
                          var d=$.parseJSON(res);
                          if (d.msgid==200) {
                            var json=JSON.parse(d.data); 
                            if (json.status==16) {
                                 _this.$http.get('/storage/getfilepath',{
                                      params:{
                                          fileid:md5
                                      }
                                  }).then(res=>{
                                          var d=$.parseJSON(res.data);
                                          if (d.msgid==200) {
                                              var json=JSON.parse(d.data); 
                                              _this.cover=json.file_addr;
                                          } 
                                  });

                                  clearInterval(code);
                            }
                          } 
                        })
                        .fail(function() {
                          console.log("error");
                        });
                      
                      }, 10);
            },
  }
}
</script>

<style lang="scss">
    @media screen and (max-width: 1366px) {
      .new-channel .edit-form{
        max-height:30em;
        overflow-y:auto;
      }
   }
    .new-channel{
        width:50em;
        overflow:hidden;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:6em;
        left:50%;
        margin-left:-25em;
        padding:0em 0.5em 3em;
        .is-danger{
          margin-top:10px !important;
        }
        .time-select-item.disabled{
          color:#ccc;
        }
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
           background-color:#0099ff;
            line-height:3em;
            padding: 0 2em;

            p{
                float:left;
            }
            span{
                float:right;
                font-size:2em;
                cursor:pointer;
            }
        }
        .edit-form{
            width:100%; 
            padding:0 2em;
            p{
                margin-top:2em;
                position:relative;
                height:auto;
                clear:both;

                span{
                    width:8em;
                    height:2.5em;
                    line-height:2.5em;
                    text-align:right;
                    display:inline-block;
                    margin-right:3em;

                }
                em{
                    font-style:normal;
                    color:#0099ff;
                    cursor:pointer;
                }
                input[type="text"]{
                    height:2.5em;
                    width:20em;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                }

                label{
                    position:relative;
                    margin-right:3em;
                }
            }
            .fengmian{
              display:inline-block; 
              width:5em; 
              height:3em; 
              background-image:url("../../../assets/live/u175.png");
              background-size:contain;
              background-repeat:no-repeat;
              background-position:center center;           
             }
            .time{
                height:auto;
                clear:both;
                .time-title{
                    width:8em;
                    float:left;
                    height:2.5em;
                    line-height:2.5em;
                    text-align:right;
                    display:inline-block;
                    margin-right:3em;
                }
               .time-inner{
                    float:left;
                    width:30em;
                    div{
                        width:12em;
                        margin: 5px 0;

                        .el-input__inner{
                            background:none !important;
                        }
                    }
                    label{
                    font-weight:normal;
                    display:block;
                    input{
                        position:relative;
                        top:2px;
                        margin-right:5px;
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