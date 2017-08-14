var runInfo = function(options, cb) {
    infoTimeline = [];
    if (options.mode === 'lab') {
        // defining groups of questions that will go together.
        var subjectID = {
            type: 'survey-text',
            questions: ["Subject ID: ", "Experimenter Name: "],
        };
        infoTimeline.push(subjectID)

        jsPsych.init({
            timeline: infoTimeline,
            // fullscreen: true,
            on_finish: function() {
                $('.jspsych-display-element').remove();
                psiTurk.saveData({
                    success: function() {
                        console.log("Info Collected!");
                        cb();
                    }
                });
            },
            on_data_update: function(data) {
                psiTurk.recordTrialData(data);
            }
        })
    } else {
        cb();
    }
};
