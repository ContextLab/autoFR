////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// collects custom ID and experimenter name if run in the lab
mode = 'debug';

// initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// path to wordpool file
var stimPath = 'static/files/wordpool.csv'

var returnSpeech = false;

// create empty folder for audio files
$.post('/create-audio-folder', {
    'data': uniqueId
});

////////////////////////////////////////////////////////////////////////////////
// SET EXPERIMENTAL PARAMETERS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// set stimulus parameters
var font = 'Arial' // font
var fontSize = '5vw' // font size
var listLength = 2; // how long you want each list to be
var numberOfLists = 1; // number of study/test blocks
var recordTime = 5; //record time NOTE: 60 secs is the max google speech can handle per request
var presTime = 2; // presentation duration
var intertrialTime = 2; // ITI
