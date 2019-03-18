function readFileMD5(file,callBack){
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 2097152,                            // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader=new FileReader();

        fileReader.onload=function(e){
            spark.append(e.target.result);   // Append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                callBack(spark.end());
            }
         }

        fileReader.onerror = function (e) {
            console.warn(e);
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
}


export {readFileMD5}