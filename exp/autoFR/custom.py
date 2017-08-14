# this file imports custom routes into the experiment server

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache

# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

# # to call script on finish
from subprocess import call
import os
import csv
cwd = os.getcwd()

# load the configuration options
config = PsiturkConfig()
config.load_config()
myauth = PsiTurkAuthorization(config)  # if you want to add a password protect route use this

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')

# Google speech
import base64
import json
from google.cloud import speech
client = speech.Client()

# load in speech context
with open('static/files/speech-context.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile, delimiter='\n')
    speech_context = [row[0] for row in reader]

# audio processing package
from pydub import AudioSegment

# import pickle to save google speech results
import pickle

# import multiprocessing for speech decoding
import multiprocessing as q

@custom_code.route('/create-audio-folder',methods=['POST'])
def createFolder():
    print('creating audio folder...')
    call('mkdir audio/' + request.form['data'],shell=True)
    resp = {"folderCreated": "success"}
    return jsonify(**resp)

@custom_code.route('/save-audio-and-decode',methods=['POST'])
def saveAndDecode():
    filename = request.form['audio-filename']
    foldername = request.form['audio-foldername']
    wav = request.files
    wav['audio-blob'].save("audio/" + foldername + "/" + filename)
    audio = AudioSegment.from_wav("audio/" + foldername + "/" + filename)
    audio.export("audio/" + foldername + "/" + filename + ".flac", format = "flac", bitrate="44.1k")
    with open("audio/" + foldername + "/" + filename + ".flac", 'rb') as sc:
        speech_content = sc.read()
    sample = client.sample(content=speech_content,
                        encoding=speech.Encoding.FLAC,
                        sample_rate=44100)
    def recognize(sample, foldername, filename):
        results = sample.sync_recognize(language_code='en-US', max_alternatives=1,
                                        speech_context=speech_context) #note: max 500 words for speech context
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
    resp = {"audioDecoded" : "success"}
    return jsonify(**resp)

@custom_code.route('/save-audio-and-return-transcript',methods=['POST'])
def saveAndReturn():
    filename = request.form['audio-filename']
    foldername = request.form['audio-foldername']
    wav = request.files
    wav['audio-blob'].save("audio/" + foldername + "/" + filename)
    audio = AudioSegment.from_wav("audio/" + foldername + "/" + filename)
    audio.export("audio/" + foldername + "/" + filename + ".flac", format = "flac", bitrate="44.1k")
    with open("audio/" + foldername + "/" + filename + ".flac", 'rb') as sc:
        speech_content = sc.read()
    sample = client.sample(content=speech_content,
                        encoding=speech.Encoding.FLAC,
                        sample_rate=44100)
    results = sample.sync_recognize(language_code='en-US', max_alternatives=1,
                                    speech_context=speech_context) #note: max 500 words for speech context
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
    resp = {"result" : json.dumps(words)}
    return jsonify(**resp)
