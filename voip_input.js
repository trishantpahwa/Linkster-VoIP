var constraints = {
    audio: true,
    video: true
}

var client = mqtt.connect("ws://192.168.1.33:9001/");
client.on('connect', function () {
    client.subscribe('voip');
});
client.on('message', function(topic, payload) {
    console.log(topic);
    // buffer = payload;
    // console.log(payload);
    var buffer = new Blob([payload], {type: "video/x-matroska;codecs=avc1,opus"}); // audio/webm;codecs=opus video/x-matroska;codecs=avc1,opus
    // buffer = b;
    // var a = new Audio();
    // a.autoplay = true;
    // a.src = url;
    // a.load();
    var remoteVideo = document.getElementById("remoteVideo");
    var url = URL.createObjectURL(buffer);
    remoteVideo.src = url;
    // v.src = url;
});
$(document).ready(function() {
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        var localVideo = document.getElementById('localVideo');
        var remoteVideo = document.getElementById('remoteVideo');
        var buffer = null;
        var codec = "video/webm;codecs=opus";
        var mediaSource = new MediaSource();
        // var sourceBuffer = mediaSource.addSourceBuffer(codec);
        mediaSource.onsourceopen = function(t) {
            console.log(t);
            console.log('Hello');
        };
        // console.log(sourceBuffer);
        // var buffer = new Blob([], { type: "video/x-matroska;codecs=avc1,opus" });
        // var url = URL.createObjectURL(buffer);
        // remoteVideo.src = url;
        localVideo.srcObject = stream;
        // var chunks = [];
        // var v = document.getElementById("myvideo");
        // v.srcObject = stream;
        // v.play();
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener("dataavailable", event => {
            // console.log(event.data);
            audioChunks = event.data;
            event.data.arrayBuffer().then(function(buffer) {
                buffer = new Uint8Array(buffer);
                client.publish("voip", buffer);
            });
        });
        // mediaRecorder.onstop = function(event) {
        //     console.log(event);
        // };
                
        function rec() {
            mediaRecorder.start();
            setTimeout(function() {
                mediaRecorder.stop();
                rec();
            }, 2000);                
        }
        rec();
        // mediaRecorder.ondataavailable = function(event) {
            // event.data.arrayBuffer().then(function(buffer) {
                // buffer = new Uint8Array(buffer);
                // chunks = Array.prototype.push.apply(chunks, buffer);
                // console.log(buffer);
                // client.publish("voip", buffer);
            // });
        // };
        // mediaRecorder.start(1000);
    });
});