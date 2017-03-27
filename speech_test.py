import time
from google.cloud import speech
client = speech.Client()

# import multiprocessing for speech decoding
import multiprocessing as q

# import pickle to save google speech results
import pickle

import csv

foldername = 'debugRO8TKX:debugCW24CK'
filename = 'debugRO8TKX:debugCW24CK-0'

with open("audio/" + foldername + "/" + filename + ".wav.flac", 'rb') as sc:
    speech_content = sc.read()

sample = client.sample(content=speech_content,
                    encoding=speech.Encoding.FLAC,
                    sample_rate=44100)
def recognize(sample, foldername, filename):
    results = sample.sync_recognize(language_code='en-US', max_alternatives=1) #note: max 500 words for speech context
    pickle.dump( results, open( "audio/" + foldername + "/" + filename + ".flac.pickle", "wb" ) )
    words = []
    for result in results:
        for chunk in result.transcript.split(' '):
            print(chunk)
            if chunk != '':
                words.append(str(chunk).upper())
    with open("audio/" + foldername + "/" + filename + ".flac.txt", 'wb') as myfile:
        wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
        wr.writerow(words)

p = q.Process(target=recognize, args=(sample, foldername, filename))
p.start()
print('made it here')
