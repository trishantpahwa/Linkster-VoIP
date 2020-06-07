import paho.mqtt.client as mqtt
import pyaudio
import time


chunk = 1024  # Record in chunks of 1024 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 1
fs = 44100
p = pyaudio.PyAudio()
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                output=True)

def on_message(client, userdata, msg):
    print(msg.topic+" ")
    stream.write(msg.payload)


client = mqtt.Client()
client.connect("192.168.1.33", 1883, 60)
client.subscribe("voip")
client.on_message = on_message
client.loop_forever()
stream.start_stream()
while stream.is_active():
    time.sleep(0.1)
stream.stop_stream()
stream.close()
# Terminate the PortAudio interface
p.terminate()
