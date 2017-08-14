////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// collects custom ID and experimenter name if run in the lab
mode = 'debug';

// initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// path to wordpool file
var stimPath = 'static/files/wordpool.csv'

// set stimulus parameters
var font = 'Arial'
var fontSize = '7vw'

// set experiment params
var listLength = 16; // how long you want each list to be
var numberOfLists = 16; // number of study/test blocks
var recordTime = 60; //record time NOTE: 60 secs is the max google speech can handle per request
var presTime = 2; // presentation duration
var intertrialTime = 2; // ITI

var returnSpeech = true; // if true, the program will return the decoded speech after each list

// create empty folder for audio files
$.post('/create-audio-folder', {
    'data': uniqueId
});
