var client = mqtt.connect("ws://192.168.1.33:9001/");
client.on('connect', function() {
    client.subscribe('voip1');
});
client.on('message', function(topic, payload) {
    console.log(topic);
    var buffer = new Blob([payload], {type: "audio/webm;codecs=opus"});
    const audioUrl = URL.createObjectURL(buffer);
    const audio = new Audio(audioUrl);
    audio.play();
});