function speckText(str) {
    let url = 'https://tts.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcd&ie=UTF-8&vol=9&per=0&spd=5&pit=5&aue=3&tex=' + encodeURI(str);
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    // var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
    // var url = "http://translate.google.cn/translate_tts?ie=UTF-8&tl=zh-CN&total=1&idx=0&textlen=19&prev=input&q=" + encodeURI(str); // google
    if (!isChrome) {
        var n = new Audio(url);
        n.src = url;
        n.play();
    } else {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext ||
            window.msAudioContext;
        try {
            var context = new window.AudioContext();;
            var source = null;
            var audioBuffer = null;
            function playSound() {
                source = context.createBufferSource();
                source.buffer = audioBuffer;
                source.loop = false;
                source.connect(context.destination);
                source.start(0); //立即播放
            }

            function initSound(arrayBuffer) {
                context.decodeAudioData(arrayBuffer, function (buffer) { //解码成功时的回调函数
                    audioBuffer = buffer;
                    playSound();
                }, function (e) { //解码出错时的回调函数
                    console.log('Error decoding file', e);
                });
            }

            function loadAudioFile(url) {
                var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) { //下载完成
                    initSound(this.response);
                };
                xhr.send();
            }
            loadAudioFile(url);
        } catch (e) {
            console.log('!Your browser does not support AudioContext');
        }
    }
}
module.exports = {
    speckText: speckText
};