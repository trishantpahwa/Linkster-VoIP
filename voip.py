import wave
import pyaudio
import time
import paho.mqtt.client as mqtt

chunk = 1024  # Record in chunks of 1024 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 2
fs = 21500  # Record at 44100 samples per second

p = pyaudio.PyAudio()  # Create an interface to PortAudio

print('Recording')
client = mqtt.Client()
client.connect("192.168.1.33", 1883, 60)

def callback(in_data, frame_count, time_info, status):
    print("Published")
    client.publish("voip", in_data)
    return (None, pyaudio.paContinue)

stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                input=True,stream_callback=callback)

# Stop and close the stream
stream.start_stream()
while stream.is_active():
    time.sleep(0.1)
stream.stop_stream()
stream.close()
# Terminate the PortAudio interface
p.terminate()

print('Finished recording')

