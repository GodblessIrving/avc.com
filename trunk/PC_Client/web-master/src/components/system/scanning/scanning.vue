<template>
    <div class="scanning">
        <h1>扫描目录</h1>
        <div class="operation">
            <a href="javascript:void(0)" @click="toggleBoolean();">新建任务</a>
            <a href="javascript:void(0)" @click="toggleDel();">删除</a>
            <p class="sear">
                <input type="text" placeholder="搜索扫描任务名称" v-model="keyword">
                <span class='searchbtn' @click="search">搜索</span>
            </p>
        </div>
        <div class="excel">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="3"><label for="" style="margin-bottom:0"><input type="checkbox">All</label></th>
                        <th width="12">扫描任务</th>
                        <th width="7">分类</th>
                        <th width="7">来源</th>
                        <th width="15">转码模板</th>
                        <th width="15">路径</th>
                        <th width="15">修改时间</th>
                        <th width="8">状态</th>
                        <th width="12">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>跟谁学三方资源汇集</td>
                        <td>数学</td>
                        <td>跟谁学</td>
                        <td>互联网视频转码模版</td>
                        <td>//192.168.0.120/genshenxue/video</td>
                        <td>2017-08-09  12:01:22</td>
                        <td class="green">启用</td>
                        <td>
                            <a href="javascript:void(0)" @click="toggleBoolean()">管理</a>
                            <a href="javascript:void(0)" @click="toggleDel();">删除</a>
                        </td>
                    </tr>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>网校101资源汇集</td>
                        <td>数学</td>
                        <td>在线学院</td>
                        <td>在线教育视频转码模版</td>
                        <td>//202.108.3.121/wangxiao101/video</td>
                        <td>2017-08-09  12:01:22</td>
                        <td class="green">启用</td>
                        <td>
                            <a href="javascript:void(0)">管理</a>
                            <a href="javascript:void(0)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <manager-scanning :boolean="boolean" @closeEvent="closeManeger"></manager-scanning>
        <common-tip :isDel="isDel" :message="message" ></common-tip>
    </div>
</template>

<script type="text/ecmascript-6">
    import ManagerScanning from "./ManagerScanning"
    import CommonTip from "../../CommonTip"
    export default{
        data () {
             return {
                boolean:false,
                isDel:false,
                message:"您确定删除该扫描任务？",
                keyword:'',
             };
         },
        name:"scanning",
        components:{ManagerScanning,CommonTip},
        methods: {
             toggleBoolean () {
                 this.boolean = true;
             },
             closeManeger(){
                this.boolean = false;
             },
              toggleDel (e) {
                 this.isDel = true
             },
             search(){},
         }
    }
</script>
<style lang="scss">
.scanning{
        height:83em;
        width:76%;
        float:left;
        background:url("../../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:absolute;
        left:18%;
        top:0;
        padding:2em;
        box-sizing:border-box;

        h1{
            font-size:1.1em;
            height:3em;
            margin:0;
            line-height:2em;
            padding-left:3em;
            font-size:1.4em;
            border-bottom:1px dashed #fff;
        }
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
        }
    }
</style>