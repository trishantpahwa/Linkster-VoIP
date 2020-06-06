import paho.mqtt.client as mqtt
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav

def on_message(client, userdata, msg):
    fs=44100
    print(msg.topic+" ")
    msg = np.frombuffer(msg.payload)
    sd.play(msg, fs)
    sd.wait()

client = mqtt.Client()
client.connect("192.168.1.28", 1883, 60)
client.subscribe("voip")
client.on_message = on_message
client.loop_forever()