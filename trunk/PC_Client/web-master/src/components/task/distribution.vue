<template>
<div class="masklayer" v-show="isNew">
    <div class="distribution">
        <div class="edit-top">
            <p>{{restitle}}</p>
            <span @click="closeNew();" style='font-size:2.4em;'>×</span>
        </div>
        <div class="content">
            <p>
                <span class="left">视音频名称：</span>
                <span class="right" :title="title">{{title}}</span>
            </p>
            <p>
                <span class="left">类型：</span>
                <span class="right">{{typename}}</span>
            </p>
            <p class="sear-in">
                <input type="text" placeholder="搜索审核人..." v-model="keyname">
                <span class='searchbtn' @click="search()">搜索</span>
            </p>
        </div>
        <div class="excel" style="padding:0 2em; width:96%;">
            <table cellpadding="0" cellspacing="0" style="table-layout:fixed">
                <thead>
                    <tr>
                        <th width="15">选择</th>
                        <th width="15">审核人</th>
                        <th width="20">
                            <span>待审核任务数</span>
                            <span class="up" @click="orderTask($event,2)"></span>
                            <span class="down" @click="orderTask($event,1)"></span>
                        </th>
                        <th width="20">
                            <span>审核任务总数</span>
                            <span class="up" @click="orderAllTask($event,2)"></span>
                            <span class="down" @click="orderAllTask($event,1)"></span>
                        </th>
                       <th width="30">
                            <span>最后审核时间</span>
                            <span class="up" @click="orderTime($event,2)"></span>
                            <span class="down" @click="orderTime($event,1)"></span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="e in exArr" @click="choseOne($event,e.id)"> 
                        <td><input type="radio" name="chose" :value="e.id" v-model="tid" class="chose"></td>
                        <td>{{e.username}}</td>
                        <td>{{e.count}}</td>
                        <td>{{e.allcount}}</td>
                        <td>{{e.time}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="edit-btn">
            <a href="javascript:void(0)" @click="saveDistribution">保存</a>
            <a href="javascript:void(0)" @click="closeNew();">取消</a>
        </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'distribution',
  data(){
    return{
        keyname:'',
        totask:0,
        alltask:0,
        endtime:0,
        tid:'',
        exArr:[],
    }
  },
  props:["isNew","title","typename","examinerArr","restitle"],
  watch:{
    examinerArr:function(){
        this.exArr = this.examinerArr;
    },
  },
  methods: {
    closeNew (){
       this.$emit('closeNewEvent');
    },
    saveDistribution(){
        this.$emit('saveNewEvent',this.tid);
    },
    // 获取所有审核人
    getExaminer(){
      this.$http.get('task/GetExaminer',{
        params:{
            name:this.keyname,
            totask:this.totask,
            alltask:this.alltask,
            endtime:this.endtime
        }
      }).then(res=>{
        var d = $.parseJSON(res.data);
        if(d){
          if(d.msgid == 200){
            this.exArr = d.data;
          }else{
            console.log(d.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 搜索
    search(){
        this.getExaminer();
    },
    // 待审核任务总数排序
    orderTask(e,oid){
        var dom = e.currentTarget;
        if($(dom).hasClass('up')){
            $(dom).addClass('up-cur');
            $('.down').removeClass('down-cur');
        }else{
            $(dom).addClass('down-cur');
            $('.up').removeClass('up-cur');
        }
        this.totask = oid;
        this.alltask = 0;
        this.endtime = 0;
        this.getExaminer();
    },
    // 任务总数排序
     orderAllTask(e,oid){
        var dom = e.currentTarget;
        if($(dom).hasClass('up')){
            $(dom).addClass('up-cur');
            $('.down').removeClass('down-cur');
        }else{
            $(dom).addClass('down-cur');
            $('.up').removeClass('up-cur');
        }
        this.alltask = oid;
        this.totask = 0;
        this.endtime=0;
        this.getExaminer();
    },
    // 最后时间排序
    orderTime(e,oid){
        var dom = e.currentTarget;
        if($(dom).hasClass('up')){
            $(dom).addClass('up-cur');
            $('.down').removeClass('down-cur');
        }else{
            $(dom).addClass('down-cur');
            $('.up').removeClass('up-cur');
        }
        this.endtime = oid;
        this.totask = 0;
        this.alltask = 0;
        this.getExaminer();
    },
    // 点击记录选中审核人
    choseOne(e,id){
        var dom = e.currentTarget;
        $(dom).addClass('tr-cur').siblings().removeClass('tr-cur');
        $(".chose[value='"+id+"']").prop("checked",true);
        this.tid = id;
    },
   }
}
</script>

<style lang="scss">
    .distribution{
        width:70em;
        height:44em;
        background:url("../../assets/module/u10.png") no-repeat;
        background-size:100% 100%;
        position:fixed;
        z-index:10;
        top:50%;
        margin-top:-22em;
        left:50%;
        margin-left:-35em;
        padding:0.1em 0.5em 2em;
        th,td{
            text-align:center !important;
        }
        .excel{
            height:20em;
            overflow-y:auto;
            width:96%;
            padding:0 !important;
            margin-left:2%;
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
            box-sizing:border-box;
            color:#fff;
            padding:3em 0 0 2em;
            overflow:hidden;
            p{
                width:100%;
                clear:both;
                overflow:hidden;
                .left{
                    float:left;
                    width:10%;
                    text-align:right;
                    margin-right:10px;
                }
                .right{
                    float:left;
                    width:80%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
               
            }
            .sear-in{
                    width:45%;
                    height:4em;
                    float:right;
                    margin:0;
                    background:url("../../assets/module/u2098serch.png") no-repeat;
                    background-size:100% 100%;
                    margin-right:1em;
                    input{
                      float:left;
                       width:75%;
                       background:#1c1f1f;
                       height:2.4em;
                       border-radius:5px;
                       margin-top:2%;
                       margin-left:2.5%;
                       padding-left:2%;
                   }
                  .searchbtn{
                    margin-top:2%;
                    width:20%;
                    height:2.4em;
                    float:left;
                    line-height:2.4em;
                    font-size:1.2em;
                    background:url("../../assets/module/u2100.png") no-repeat 15%;
                    background-size:40%;
                    padding-left:10%;
                    font-size:1em;
                    color:#0099ff;
                    cursor:pointer;
                  }
                } 
           
       }
        .edit-btn{
            width:100%;
            text-align:center;
            margin-top:2em;
            clear:both;
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
        .up{
            display:inline-block;
            width: 0;
            height: 0;
            border-width: 0.5em;
            border-style: solid;
            border-color: transparent transparent #666666 transparent;
            position:relative;
            top:-0.5em;
            left:0.5em;
            cursor:pointer;
        }
        .down{
            display:inline-block;
            width: 0;
            height: 0;
            border-width: 0.5em;
            border-style: solid;
            border-color: #666666 transparent transparent transparent;
            position:relative;
            top:1em;
            left:-0.8em;
            cursor:pointer;
        }
        .up-cur{
            border-color: transparent transparent #104d76 transparent;
        }
        .down-cur{
            border-color: #104d76 transparent transparent transparent;
        }
        .tr-cur{
            background-color:#104d76 !important;
        }
    }
</style>