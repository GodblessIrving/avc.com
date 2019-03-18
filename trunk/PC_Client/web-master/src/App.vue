<template>
  <div id="app">
    <slide-nav ref="nav"></slide-nav>
    <router-view class="view" ref="menus"></router-view>
  </div>
</template>

<script>
import slideNav from "./components/SlideNav"
export default {
  name: 'app',
  watch:{
      '$route':function(val){
        if(val.path=='/login'){
          $(".slide-nav").css("display","none");
          $("#app").css({"height":"auto"});
        }else{
          $(".slide-nav").css("display","block");
          $("#app").css({"height":'85em'});
          //首次登陆，重置密码
          if(sessionStorage.avc_reset||this.$store.state.user.firstlogin){
             this.$refs.nav.isRest=false;
          }else{
             this.$refs.nav.isRest=true;
          }
        }
      },
  },
  components:{slideNav},
}
</script>

<style lang="scss">

// Base setting and rest

@media screen and (max-width: 1920px) {
    body {
        font-size: 16px !important;
        .el-pager li{
          margin-left:1em;
        }
        .el-pagination .btn-next{
          margin-left:1em;
        }
    }
}
@media screen and (max-width: 1440px) {
    body {
        font-size: 12px !important;
        .el-pager li{
          min-width:2em;
          margin-left:0.5em;
        }
        .el-pagination .btn-next{
          margin-left:0.5em;
        }
        .el-pagination .btn-next, .el-pagination .btn-prev{
          padding:0 !important;
          width:3.5em;
          line-height:30px;
        }
    }
}
@media screen and (max-width: 1366px) {
    body {
        font-size: 12px !important;
        .el-pager li{
          min-width:2em;
          margin-left:0.5em;
        }
        .el-pagination .btn-next{
          margin-left:0.5em;
        }
        .el-pagination .btn-next, .el-pagination .btn-prev{
          padding:0 !important;
          width:3.5em;
          line-height:30px;
        }
    }
}
body{
  min-width:1366px;
  max-width:1920px;
  overflow-x:hidden;
  scrollbar-face-color:#0a0909;
  scrollbar-track-color:#383838;
  scrollbar-arrow-color:#383838;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/ 
::-webkit-scrollbar{width:8px;height:8px;background-color: #0a0909; border-radius: 10px;}
/*定义滚动条轨道 内阴影+圆角*/ 
::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;background-color: #0a0909;} 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb{border-radius: 10px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  background-color: #383838; }
#app {
  width:100%;
  margin: 0 auto;
  min-width:1366px;
  background:#262d35;
  height:85em;
  overflow:hidden;
}
.masklayer{
  position:fixed;
  width:100%;
  height:85em;
  top:0;
  left:0;
  overflow:hidden;
  z-index:2000;
  background:rgba(0,0,0,.4)
}
h2 {
  font-size: 1.68rem;
  font-weight: normal;
  color: #111;
}

ul, li, a, h2 {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}
input{
  outline:none;
  border:none;
  background:none;
}
input::-ms-clear{display:none;}
.is-danger{
  color:red;
}
#app .el-pager li{
          border:1px solid #0099ff;
          border-radius:3px;
          background:none;
          color:#fff;
          font-weight:200;
        }
        #app .el-pager li.active{
          background-color:#0099ff;
        }
        #app .el-icon-arrow-left:before{
          content:"上一页";
          font-weight:200;
        }
        #app .el-icon-arrow-right:before{
          content:"下一页";
          font-weight:200;
        }
        #app .el-pagination .btn-next, #app .el-pagination .btn-prev{
          color:#fff;
          background:none;
          border:1px solid #0099ff;
          border-radius:3px;
          font-weight:200;
          padding:0 0.5em;
        }
        #app .el-pagination__jump{
          color:#0099ff;
        }
        #app .el-input__inner{
          background:none;
          border:1px solid #0099ff;
          border-radius:3px;
          color:#fff;
        }

      .Audiotip{
                    width:3em;
                    height:3em;
                    float:left;
                    position:relative;
                    top:-0.55em;
                }
      .addTip{
                    float:left;
                    width:auto;
                    padding:0.3em 0.5em;
                    background-color:#0099ff;
                    margin-right:10px;

                    span{
                        margin-left:1.5em;
                        margin-right:0 !important;
                        font-weight:700;
                        cursor:pointer;
                    }
                }

        .upload-btn{
                         width:60em;
                         max-height:53em;
                         background:url("./assets/module/u10.png") no-repeat;
                         background-size:100% 100%;
                         position:fixed;
                         z-index:10;
                         top:50%;
                         margin-top:-26em;
                         left:50%;
                         margin-left:-30em;
                         padding:0.1em 0.5em 2em;
                         color:#fff;

                         .title-top{
                              width:95%;
                              margin: 0 auto;
                              height:5em;
                              line-height:4em;
                              border-bottom:1px dashed #fff;

                              p{
                                float:left;
                                font-size:1.3em;
                                line-height:4em;
                              }
                              .red-close{
                                position:absolute;
                                width:3em;
                                height:3em;
                                top:1em; 
                                right:1em;
                                cursor:pointer;
                                background:url("./assets/resouce/u1153.png") no-repeat center;
                                background-size:100%;
                              }

                         }                                             
                       em{
                             font-style:normal;
                         }
                        
                        .content{
                             width:100%;
                             padding:2em 4em;
                             overflow-y:auto;
                             overflow-x:hidden;
                             max-height:40em;
                             box-sizing:border-box;
                             .add-tip{
                                background:none;
                                 input[type="text"]{
                                        width:8em !important;
                                        border:1px solid #fff;
                                        border-radius:3px;
                                        height:2em;
                                 }

                                 a{
                                        height:2em;
                                        line-height:3em;
                                        top:0;
                                 }
                             }

                             .item{
                                 width:100%;
                                 clear:both;
                                 .span-name{
                                     margin-right:3em;
                                     display:inline-block;
                                     width:15%;
                                     text-align:right;
                                 }

                                 a{
                                        display:inline-block;
                                        width:3em;
                                        height:3em;
                                        position:relative;
                                        top:1em;
                                        text-decoration: none;
                                        overflow:hidden;
                                        input{
                                            position: absolute;
                                            height:30px;
                                            right: 0;
                                            top: 0;
                                            opacity:0;
                                            cursor:pointer;
                                        }
                                 }
                                 .blue-add{
                                        background:url("./assets/resouce/uadd.png") no-repeat center;
                                        background-size:80%;
                                 }
                                 .gray-add{
                                        background:url("./assets/resouce/uadd1.png") no-repeat center;
                                        background-size:80%;
                                 }

                                 select{
                                        width:10em;
                                        height:2em;
                                        color:#333;
                                 }
                                textarea{
                                         background:none;
                                         border-radius:3px;
                                         border:1px solid #4e4e4e;
                                         resize:none;
                                }
                                 input[type="text"]{
                                        width:20em;
                                        height:2em;
                                        border:1px solid #fff;
                                        border-radius:3px;
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
                        }
                         .edit-btn{
                             width:100%;
                             text-align:center;
                             margin-top:3em;
                             a{
                                 display:inline-block;
                                 color:#fff;
                                 text-decoration: none;
                                 padding:0.5em 1em;
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

         .white{
          color:#fff;
         } 
        .green{
          color:#00cc00;
        }
        .red{
          color:#ff0000;
        }
        .orange{
          color:#ff9900;
        }
        .gray{
          color:#666;
        }
</style>
