var client = mqtt.connect("ws://192.168.1.33:9001/");
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var myArrayBuffer = audioCtx.createBuffer(1, 4096, 44110);
client.on('connect', function () {
    client.subscribe('voip');
});
client.on("message", function(topic, payload) {
    console.log(topic);
    payload = new Float32Array(payload, payload.byteOffset, payload.byteLength);
    var nowBuffering = myArrayBuffer.getChannelData(0);
    for (var i = 0; i < 4096; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        payload[i] = (((payload[i] - 0) * (1 - (-1))) / (65536 - 0)) + -1;
        nowBuffering[i] = payload[i];
    }
    // myArrayBuffer.copyFromChannel(payload, 1, 0);
    // x = audioCtx.decodeAudioData(payload);
    // console.log(x);
    var source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
});
// const handleSuccess = function(stream) {

//     const context = new AudioContext();
//     const source = context.createMediaStreamSource(stream);
//     const processor = context.createScriptProcessor(1024, 1, 1);

//     source.connect(processor);
//     processor.connect(context.destination);

//     processor.onaudioprocess = function(e) {
//       // Do something with the data, e.g. convert it to WAV
//       var chunk = e.inputBuffer.getChannelData(0);
//       client.publish("voip", chunk);
//     };
//   };

//   navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//       .then(handleSuccess);

// // Create an empty three-second stereo buffer at the sample rate of the AudioContext
// // Fill the buffer with white noise;
// // just random values between -1.0 and 1.0
