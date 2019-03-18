<template>
    <div class="edits" v-if="boolean">
        <div class="edit-top">
            <p>编辑用户-Lixuedong</p>
            <span @click="toggleBool();" style="font-size:2.2em">×</span>
        </div>
        <div class="edit-form">
            <p>
                <span>用户名：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <input type="text">
            </p>
            <p>
                <span>真实姓名：</span>
                <input type="text">
            </p>
            <p>
                <span>用户原密码：</span>
                <input type="text" placeholder="请输入用户原密码">
            </p>
            <p>
                <span>用户新密码：</span>
                <input type="text" placeholder="请输入设置的新密码">
            </p>
            <p>
                <span>确认用户密码：</span>
                <input type="text" placeholder="请再次输入用户新密码">
            </p>
            <p>
                <span>用户角色：</span>
                <img src="../../../assets/system/red.png" height="30" width="30" alt="">
                <select name="" id="">
                    <option>请选择</option>
                    <option>普通用户</option>
                    <option>督导管理员</option>
                    <option>督导教师</option>
                </select>
            </p>
            <p>
                <span>职称：</span>
                <select name="" id="">
                    <option>请选择</option>
                    <option>讲师</option>
                    <option>教授</option>
                    <option>副教授</option>
                    <option>院士</option>
                </select>
            </p>
            <p>
                <span>职务：</span>
                <select name="" id="">
                    <option>请选择</option>
                    <option>科长</option>
                    <option>副科长</option>
                    <option>处长</option>
                    <option>副处长</option>
                    <option>校长</option>
                    <option>副校长</option>
                </select>
            </p>
             <p>
                <span>所属部门：</span>
                <select name="" id="">
                    <option>请选择</option>
                    <option>国际工程管理系</option>
                    <option>建筑综合实验中心</option>
                    <option>排水科学与工程系</option>
                    <option>经济与管理学院</option>
                    <option>物流管理与信息工程系</option>
                </select>
            </p>
            <p>
                <span>备注：</span>
                <textarea name="" id="" cols="100" rows="8"></textarea>
            </p>
            <p style="margin-top:8em;">
                <span>启用/禁用：</span>
                <label for=""><input type="radio" name="use">&nbsp;&nbsp;启用</label>
                <label for=""><input type="radio" name="use">&nbsp;&nbsp;禁用</label>
            </p>
        </div>
        <p class="edit-tip">注：用户修改密码，先输入原密码，正确后，设置新密码有效；如果不修改密码，修改密码处可略过。</p>
        <div class="edit-btn">
            <a href="javescript:void(0)">确认</a>
            <a href="javescript:void(0)" @click="toggleBool();">取消</a>
        </div>
        <div class="edit-pic">
            <p>
                <img src="../../../assets/VideoPlay/u478.png" alt="" width="100%">
            </p>
           <a href="javescript:void(0)" style="text-decoration: none;">重新上传</a>
        </div>
  </div>
</template>

<script>
export default {
  name: 'edit',
  props:["boolean"],
  methods: {
             toggleBool () {
                 this.boolean = false
             }
         }
}
</script>

<style lang="scss">
    .edits{
        width:80em;
        height:75em;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        z-index:10;
        top:5em;
        left:-10em;
        padding:0 0.5em 2em;
        .edit-top{
            width:100%;
            height:3em;
            font-size:1.2em;
            background-color:#0099ff;
            border:none;
            line-height:3em;
            padding:0 2em;

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

                }
                input[type="text"]{
                    height:2.5em;
                    width:20em;
                    border-radius:3px;
                    border:1px solid #4e4e4e;
                    position:absolute;
                    left:11em;
                }

                select{
                    color:#000;
                    height:2.5em;
                    width:10em;
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
            margin-left:2.5em;
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
        .edit-pic{
            width:10em;
            height:12em;
            position:absolute;
            top:10em;
            right:15em;
            text-align:center;

            p{
                width:10em;
                height:10em;
                border-radius:50%;
            }
        }
    }
</style>