var practiceWords = ["OPTIMAL", "MEMORY", "ABSOLUTE"]; // words for practice block
var recPracticeWords = []; // initialize array to hold recorded practice words
var practiceRecTime = 15; // amount of time given to recite practice words

var setupInstructions = function() {

    var instructionsTimeline = [];

    var instructions1 = {
        type: "text",
        text: "<div class='instructions'> <p style='font-weight:bold'> PLEASE READ THESE INSTRUCTIONS CAREFULLY </p>" +
            "<p> In this experiment, you will see " + numberOfLists + " lists of " + listLength + " words. </p>" +
            "<p> The words will appear one at a time, in different colors and in different locations on the screen. </p> <p> Press any key to continue.</p></div>"
    };
    instructionsTimeline.push(instructions1);

    // present the instruction screen
    var instructions2 = {
        type: "text",
        text: "<div class='instructions'> <p> Your task will be to remember the words in each list and recite them out loud to the best of your ability. </p>" +
            "<p> Following each list, you will see the <i style='color:red' class='fa fa-microphone'></i>.  This indicates that the computer has started recording. </p>" +
            "<p> From that point on, you will have " + recordTime + " seconds to recite all of the words you remember.</p> <p> Press any key to continue.</p></div>"
    };
    instructionsTimeline.push(instructions2);

    // present the instruction screen
    var instructions3 = {
        type: "text",
        text: "<div class='instructions'>" +
            "<p>Let's try a quick practice round.  In this practice list, you will see three words presented one at a time.</p>" +
            "<p>Then, when you see the <i style='color:red' class='fa fa-microphone'></i>, try to recall as many words as you can.</p>" +
            "<p>Please speak <strong>slowly</strong> and <strong>clearly</strong>, and close to your computer.</p></div>"
    };
    instructionsTimeline.push(instructions3);


    // create an array of objects for the practice round
    practiceWords.forEach(function(word) {

        //create a stimulus for each element of the data and push it to the stimArray
        var stim = {
            type: "p",
            text: word, //inserts the word from each row of csv file
        };

        //relative positioning specific to 5vw courier
        var height_range = Math.random() * 85;
        var width_range = Math.random() * (100 - word.length * 3);

        // set color of the word
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);

        // define the parameters for presenting the practice stimuli
        stim.style = [
            "color:rgb(" + r + ',' + g + ',' + b + ')',
            "font-size:5vw",
            "font-family:courier", // uses randomly assigned rgb, x, and y values
            "position:absolute",
            "top:" + height_range + "%", // relative positioning
            "left:" + width_range + "%"
        ];

        // convert the object to HTML
        var stim = stimHTMLFormatter(stim);

        // create each practice trial
        var trial = {
            type: 'single-stim',
            stimulus: stim,
            is_html: true,
            choices: 'none',
            timing_response: 2000,
            timing_post_trial: 2000,
        };

        instructionsTimeline.push(trial);

    });

    // practice instructions
    var practiceInstructions1 = {
        type: "text",
        text: "<div style='font-size:30px' class='instructions'><p>Here is an example of how you should recite the words. <strong>Make sure your speakers are turned up.</strong> Push the play button to hear it.</p>" +
            "<audio id='sound1' src='static/files/practice.m4a' preload='auto'></audio>" +
            "<button style='background-color:white; outline:none' class='btn btn-large' onclick='document.getElementById(" + '"sound1"' + ").play();'><i class='fa fa-play-circle-o fa-5x'></i></button>" +
            "<p>Press any key when you are done listening.</p></div>",
        html: true
    };
    instructionsTimeline.push(practiceInstructions1);

    // prace instructions 2
    var practiceInstructions2 = {
        type: "text",
        text: "<div style='font-size:30px' class='instructions'><p>Now you give it a try. Remember to speak <strong>slowly</strong> and <strong>clearly</strong>.</p>" +
            "<p>Make sure you are about an arms length from your computer so the microphone can pick you up.</p>" +
            "<p>Press any key and then say <strong>"+
            practiceWords[0] + "..."
            + practiceWords[1] + "..."
            + practiceWords[2] + "</strong>.</p></div>",
        html: true
    };
    instructionsTimeline.push(practiceInstructions2);

    // create the pactice test, which call the testPractice function defined in HELPER FUNCTIONS
    var practiceTest = {
        type: 'call-function',
        func: testPractice,
        timing_post_trial: practiceRecTime * 1000,
    };
    instructionsTimeline.push(practiceTest);

    // go here if the practice test doesn't work
    var fail = {
        type: 'text',
        text: "<div class='instructions'><p>The practice test didn't work...</p><p>Please say <strong>" + practiceWords[0] + "..."
        + practiceWords[1] + "..."
        + practiceWords[2] +
        "</strong> clearly and close to the microphone.</p>" +
            "<p>Press any key to try again.</p></div>",
        is_html: true,
    };

    // create practice fail loop
    var fail_loop = {
        timeline: [fail, practiceTest],
        loop_function: function() {
            if (practicePass === false) {
                return true;
            } else if (practicePass === true) {
                return false;
            }
        }
    };

    // only go into this loop if the practice test fails
    var if_failed = {
        timeline: [fail_loop],
        conditional_function: function() {
            if (practicePass === false) {
                return true;
            } else if (practicePass === true) {
                return false;
            }
        }
    };
    instructionsTimeline.push(if_failed);

    return instructionsTimeline
};

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var testPractice = function() {
    var recPracticeWords = [];
    var $mic = $("<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me'></i></p>")
    $(".jspsych-display-element").append($mic);
    if (annyang) {
        var test = function(check) {
            splitWords = check.split(" ")
            for (word in splitWords) {
                recPracticeWords.push(splitWords[word].toUpperCase())
            }
            console.log('recorded:', recPracticeWords)
            console.log('practice words:', practiceWords)
            console.log(_.isEqual(recPracticeWords, practiceWords))
            if (_.isEqual(recPracticeWords, practiceWords)) {
                practicePass = true;
                console.log('test passed');
                $(".mic").remove();
                var $micSuccessMessage = $("<div class='instructions'><p id='mic-success-message'><p>That's it!</p><p>Try to do the same throughout the experiment. You are now ready to start.</p><p>Let's move on.</p></div>")
                $(".jspsych-display-element").append($micSuccessMessage);
                annyang.abort();
                return practicePass
            } else {
                testPass = false;
                return practicePass
            }
        }
    }
    var abort = function() {
        annyang.abort();
    };
    // Define commands
    var commandsPracticeTest = {
        '*shell': test,
        'turn off mic(rophone)': abort
    };

    annyang.debug(); // Debug info for the console
    annyang.removeCommands();
    annyang.addCommands(commandsPracticeTest); // Initialize annyang with our commands
    annyang.start();
    console.log('Microphone turned on.');
    startTimer(practiceRecTime);
};
