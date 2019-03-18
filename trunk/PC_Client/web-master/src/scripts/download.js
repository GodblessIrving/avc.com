//判断浏览器类型
    function myBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
        }
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //判断是否IE浏览器
        if (userAgent.indexOf("Trident") > -1) {
            return "Edge";
        } //判断是否Edge浏览器
    }

    function oDownLoad(url) {
        if (myBrowser()==="IE"||myBrowser()==="Edge"){
            SaveAs(url);
        }else{
            download(url);
        }
    }
    
    //谷歌，360极速等浏览器下载
    function download(src) {
        var  inx=src.lastIndexOf('/');
        var  filename=src.substr(inx+1,src.length-inx-1);
        var link = document.createElement('a');
        link.setAttribute("href", src);
        link.setAttribute("download",filename);

        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
        link.dispatchEvent(evt);
        //window.open('about:blank').close();
    };

    function SaveAs(src){
        var $form = $('<form method="GET" target="_blank"></form>');
        $form.attr('action', src);
        $form.appendTo($('body'));
        $form.submit();
    }

    export {oDownLoad};