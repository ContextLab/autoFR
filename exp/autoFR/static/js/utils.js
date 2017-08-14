function AssertException(message) {
    this.message = message;
}
AssertException.prototype.toString = function() {
    return 'AssertException: ' + this.message;
};

function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            count++;
        }
    }
    return 100 * count / arr.length;
}

//create a formatter to make each item in stimArray a jsPsych block
var stimHTMLFormatter = function(stimulus) {
    var tag1 = "<" + stimulus.type + " style= '" + stimulus.style.join('; ') + "'>"
    var tag2 = "</" + stimulus.type + ">"
    return tag1 + stimulus.text + tag2
};

// create a timer function that turns off the microphone
var startTimer = function(timeSecs) {
    console.log("timer started")
    setTimeout(function() {
        $(".mic").remove();
        annyang.abort();
        console.log('Microphone turned off.');
    }, timeSecs * 1000);
};
