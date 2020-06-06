import paho.mqtt.client as mqtt
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav

client = mqtt.Client()
client.connect("192.168.1.33", 1883, 60)

while True:
    fs=20100
    duration = 1  # seconds
    myrecording = sd.rec(int(duration * fs), samplerate=fs, channels=2,dtype='float64')
    print("Recording Audio")
    sd.wait()
    myrecording = myrecording.tobytes()
    client.publish("voip", myrecording)
    