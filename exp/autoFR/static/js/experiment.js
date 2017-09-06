var wordsCorrect; //number of matched words for each trial
var stimArray = []; //create an array for stimuli
var experimentTimeline = []; //create the jsPsych experimentTimeline variable
var data = { //data object to keep track of recalled words
    listWords: [],
    recalledWords: [],
    correctWords: []
};

var runExperiment = function(stimArray, options) {

    if (mode === 'lab') {
        var instructionsTimeline = setupInstructions();
        instructionsTimeline.forEach(function(instruction) {
            experimentTimeline.push(instruction)
        });
    };

    // initialize counter for lists and trials
    currentListNumber = 0;
    currentTrialNumber = 0;
    currentListWords = [];
    currentStimArray = stimArray[0];
    console.log(currentStimArray)

    // create the lists
    for (var listNumber = 0; listNumber <= numberOfLists - 1; listNumber++) {

        data.listWords.push([]);

        // reminder before starting each list
        var preList = {
            type: "text",
            text: "<div style='font-size:30px' class='instructions'><p><b>Remember:</b> You will see a list of words and then when you see the <i style='color:red' class='fa fa-microphone'></i> you will recite back as many as you can remember. Please speak clearly, slowly and about 1-2 feet from your microphone. When you are ready to see list " + (listNumber + 1) + ", press any key.</p></div>"
        }
        experimentTimeline.push(preList);

        //create block of trials
        for (var trialNumber = 0; trialNumber < listLength; trialNumber++) {
            var trial = {
                type: 'single-stim',
                // stimulus: stim,
                stimulus: function() {
                    console.log('trial number', currentTrialNumber)
                    console.log('stimulus', currentStimArray[currentTrialNumber])
                    return stimHTMLFormatter(currentStimArray[currentTrialNumber])
                },
                is_html: true,
                choices: 'none',
                timing_response: presTime*1000,
                timing_post_trial: intertrialTime*1000,
                data: {
                    listNumber: listNumber,
                    trialNumber: trialNumber
                },
                on_finish: function() {
                    currentListWords.push(currentStimArray[currentTrialNumber].text)
                    currentTrialNumber++ // update trial number after each trial
                }
            }
            experimentTimeline.push(trial);
        };

        // pause before the recall period
        var preRecitation = {
            type: 'single-stim',
            stimulus: "<div class='instructions'><p> When you see the <i style='color:red' class='fa fa-microphone'></i>, recall as many words as you can.</p><p> Please remember to speak <strong>clearly</strong> and pause for about 2 seconds between each word.</p></div>",
            is_html: true,
            choices: 'none',
            timing_response: 3000,
        };
        experimentTimeline.push(preRecitation);

        var recall = {
            type: 'free-recall',
            stimulus: "<p class='mic'><i class='fa fa-microphone blink_me'></i></p>",
            stim_duration: recordTime * 1000,
            trial_duration: recordTime * 1000 + 2000,
            record_audio: true,
            speech_recognition: 'google',
            data: {
                listNumber: listNumber,
            },
            on_finish: function() {
                console.log('Saving data...')
                if (mode === 'lab') {
                    psiTurk.saveData({
                        success: function() {
                            console.log('Data saved!')
                        }
                    })
                }

                currentList = []; // reset currentList array
                currentTrialNumber = 0; // reset trial number counter
                currentListNumber++ // add to list counter
            }
        };
        experimentTimeline.push(recall);

    };

    console.log(experimentTimeline)

    // here is where we use jspsych to run the experimentTimeline that we created above
    jsPsych.init({
        timeline: experimentTimeline,
        fullscreen: true,
        on_finish: function() {
            if (mode === 'lab') {
                psiTurk.saveData({
                    success: function() {
                        $.post("/decode-experiment", {
                            "data": uniqueId
                        });
                        psiTurk.completeHIT();
                    }
                })
            } else {
                $.post("/decode-experiment", {
                    "data": uniqueId
                });
                psiTurk.completeHIT();
            }
        },
        on_data_update: function(data) {
            if (mode === 'lab') {
                psiTurk.recordTrialData(data);
            }
        }
    })
};
