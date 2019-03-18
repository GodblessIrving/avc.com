<template>
<div v-if="boolean" class="masklayer">
    <div class="manager-scanning">
        <div class="edit-top">
            <p>编辑-<span class="name">跟谁学三方资源汇集</span></p>
            <span @click="toggleBool();" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>扫描任务名称：</span>
                <input type="text" placeholder="请输入扫描任务名称..">
            </p>
            <p>
                <span>设置扫描资源分类：</span>
                <select name="" id="">
                    <option selected>请选择分类</option>
                    <option>数学</option>
                    <option>语文</option>
                    <option>英语</option>
                    <option>物理</option>
                    <option>化学</option>
                </select>
            </p>
            <p>
                <span>设置扫描资源来源：</span>
                <select name="" id="">
                    <option selected>请选择来源</option>
                    <option>跟谁学</option>
                    <option>在线学院</option>
                    <option>网校101</option>
                    <option>录播系统</option>
                    <option>用户上传</option>
                </select>
            </p>
            <p>
                <span>设置扫描转码模版：</span>
                <select name="" id="">
                    <option selected>请选择转码模板</option>
                    <option>互联网视频转码模板</option>
                    <option>艾威康网视频转码模板</option>
                    <option>在线教育视频转码模板</option>
                </select>
            </p>
            <p>
                <span>设置扫描路径：</span>
                <input type="text" placeholder="请输入扫描路径地址..">
            </p>
            <p class="edit-tip">注：设置转码服务器可以识别的路径。</p>
            <p>
                <span>描述：</span>
                <textarea name="" id="" cols="100" rows="8" placeholder="请输放转码任务的描述信息，最多输入200字"></textarea>
            </p>
            <p style="margin-top:8em;">
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use">&nbsp;&nbsp;启用</label>
                <label for=""><input type="radio" name="use">&nbsp;&nbsp;禁用</label>
            </p>
        </div>
        
        <div class="edit-btn">
            <a href="javescript:void(0)">确认</a>
            <a href="javescript:void(0)" @click="toggleBool();">取消</a>
        </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'manager-scanning',
  props:["boolean"],
  methods: {
             toggleBool () {
                 this.$emit('closeEvent');
             }
         }
}
</script>

<style lang="scss">
    .manager-scanning{
        width:80em;
        height:58em;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:5em;
        left:50%;
        margin-left:-40em;
        padding:0 0.6em 2em;
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            line-height:3em;
            padding:0 2em;

            p{
                float:left;
                font-size:1.1em;
                .name{
                  font-size:1.1em;
                }
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

                p{
                  margin-left:10em;
                }

                span{
                    width:10em;
                    height:2.5em;
                    line-height:2.5em;
                    text-align:right;
                    display:inline-block;

                }
                input[type="text"]{
                    height:2.5em;
                    width:25em;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    position:absolute;
                    left:11em;
                }

                select{
                    color:#000;
                    height:2.5em;
                    width:13em;
                    position:absolute;
                    left:11em;
                }
                textarea{
                    position:absolute;
                    left:11em;
                    background:none;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    resize:none;
                }

                label{
                    position:relative;
                    left:2em;
                    margin-right:3em;
                }
            }
        }
        .edit-tip{
            margin-left:11em;
            position:relative;
            top:-1em;
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