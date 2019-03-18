<template>
    <div class="second" v-if="!pictrue">
        <ul>
            <li>
                <p class="left">版权人：</p>
                <p class="right shenglue" :title="copyright.holder">{{copyright.holder}}</p>
            </li>
            <li>
                <p class="left">首次发布方式：</p>
                <p class="right shenglue" :title="copyright.ptype">{{copyright.ptype}}</p>
            </li>
            <li>
                <p class="left">发布日期：</p>
                <p class="right shenglue" :title="copyright.ptime">{{copyright.ptime}}</p>
            </li>
            <li>
                <p class="left">创作性质：</p>
                <p class="right shenglue" :title="copyright.nature">{{copyright.nature}}</p>
            </li>
            <li>
                <p class="left">首次发布地点：</p>
                <p class="right shenglue" :title="copyright.paddr">{{copyright.paddr}}</p>
            </li>
            <li>
                <p class="left">作者：</p>
                <p class="right shenglue" :title="copyright.author">{{copyright.author}}</p>
            </li>
            <li>
                <p class="left">版权归属方式：</p>
                <p class="right shenglue" :title="copyright.ownership">{{copyright.ownership}}</p>
            </li>
            <li>
                <p class="left">版本保护：</p>
                <p class="right shenglue" :title="copyright.protection">{{copyright.protection}}</p>
            </li>
            <li>
                <p class="left">版权声明：</p>
                <p class="right" :title="copyright.statement" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 8;overflow: hidden; height:11.19em;">{{copyright.statement}} </p>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">

export default{
    name:"second",
    props:['copyright','pictrue']
}
</script>
<style lang="scss">
    .second{
        width:100%;
        height:60em;
        background-color:#303030;
        border:1px solid #282828;
        padding:2em 0.2em;
        border-radius:0 0 5px 5px;
        box-sizing:border-box;

        li{
            width:100%;
            overflow:hidden;
            clear:both;
            .left{
                float:left;
                width:25%;
                text-align:right;
                height:2em;
            }
            .shenglue{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .right{
                float:left;
                margin-left:5%;
                width:65%;

                span{
                    display:inline-block;
                    padding:0.2em;
                    margin-bottom:0.5em;
                    background-color:#0099ff;
                }
            }
        }
    }
</style>