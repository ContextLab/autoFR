////////////////////////////////////////////////////////////////////////////////
// LOAD IN STIMULI AND PREPARE TRIALS //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// define a 'promise' to load in the data from wordpool csv
var loadStimuli = new Promise(
    function(resolve, reject) {
        var data;
        Papa.parse(stimPath, {
            download: true,
            complete: function(results) {
                data = results.data;
                resolve(data)
            }
        })
    }
);

// takes the wordpool and organizes it into an array of stim objects
var prepareTrials = function(data) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, not data so let's get rid of it.
            data.shift()

            //sort each element of the data and label its properties
            for (var i = 0; i < numberOfLists; i++) {

                stimArray.push([]);
                var list_array = stimArray[i];

                for (var j = 0; j < listLength; j++) {

                    var item = data[0]; //first row in data

                    //elements of the first row of data
                    var word = item[0];

                    //create a stimulus for each element of the data and push it to the stimArray
                    var stim = {
                        type: "p",
                        text: word, //inserts the word from each row of csv file
                    };

                    // here you can set the css styles of the stim
                    stim.style = [
                        "font-size:" + fontSize,
                        "font-family:" + font,
                        "position:absolute",
                        "top:50%",
                        "left:50%",
                        "transform: translateX(-50%) translateY(-50%)",
                    ];

                    list_array.push(stim)
                    data.shift();
                }
            }

            // shuffle list order across subjects
            var shuffledLists = jsPsych.randomization.shuffle(stimArray)

            // shuffle stim within each list
            var shuffledStimArray = [];
            shuffledLists.forEach(function(list, idx) {
                shuffledStimArray.push(jsPsych.randomization.shuffle(shuffledLists[idx]))
            })

            resolve(shuffledStimArray)
        })
};
