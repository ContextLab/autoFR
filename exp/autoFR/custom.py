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
import sys
import traceback
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

# import quail for speech decoding
import quail

@custom_code.route('/create-audio-folder',methods=['POST'])
def create_folder():
    print('creating audio folder...')
    call('mkdir audio/' + request.form['data'],shell=True)
    resp = {"folderCreated": "success"}
    return jsonify(**resp)

@custom_code.route('/save-audio',methods=['POST'])
def save_audio():
    filename = request.form['audio-filename']
    foldername = request.form['audio-foldername']
    wav = request.files
    try:
        wav['audio-blob'].save("audio/" + foldername + "/" + filename)
        resp = {"audioSaved" : "success"}
    except:
        print('Error with saving audio.')
        resp = {"audioSaved" : "failed"}
    return jsonify(**resp)

@custom_code.route('/decode-experiment',methods=['POST'])
def decode_experiment():
    foldername = request.form['data']
    try:
        words = quail.decode_speech(path='audio/' + foldername + '/',
            keypath='google-credentials/credentials.json',
            save=True,
            speech_context=speech_context)
        resp = {"audioDecoded" : "success"}
    except:
        print('Error decoding audio.')
        traceback.print_exc()
        resp = {"audioDecoded" : "failed"}
    return jsonify(**resp)

# @custom_code.route('/save-audio-and-return-transcript',methods=['POST'])
# def save_audio_and_return():
#     filename = request.form['audio-filename']
#     foldername = request.form['audio-foldername']
#     wav = request.files
#     wav['audio-blob'].save("audio/" + foldername + "/" + filename)
#     audio = AudioSegment.from_wav("audio/" + foldername + "/" + filename)
#     audio.export("audio/" + foldername + "/" + filename + ".flac", format = "flac", bitrate="44.1k")
#     with open("audio/" + foldername + "/" + filename + ".flac", 'rb') as sc:
#         speech_content = sc.read()
#     sample = client.sample(content=speech_content,
#                         encoding=speech.Encoding.FLAC,
#                         sample_rate_hertz=44100)
#     try:
#         results = sample.recognize(language_code='en-US', max_alternatives=1,
#                                         speech_contexts=speech_context) #note: max 500 words for speech context
#         pickle.dump( results, open( "audio/" + foldername + "/" + filename + ".flac.pickle", "wb" ) )
#         words = []
#         for result in results:
#             for chunk in result.transcript.split(' '):
#                 print(chunk)
#                 if chunk != '':
#                     words.append(str(chunk).upper())
#         with open("audio/" + foldername + "/" + filename + ".flac.txt", 'wb') as myfile:
#             wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
#             wr.writerow(words)
#         resp = {"result" : json.dumps(words)}
#     except:
#         traceback.print_exc()
#         resp = {"result" : "Error"}
#     return jsonify(**resp)
