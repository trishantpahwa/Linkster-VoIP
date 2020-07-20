var mqtt = require('mqtt');
var howler = require('howler');


var sound = new Howl({
    src: '',
});

console.log(sound);

var client = mqtt.connect('mqtt://192.168.1.33');

client.on('connect', function () {
    client.subscribe('voip');
});
  
client.on('message', function (topic, message) {
    
});