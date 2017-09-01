# autoFR
A free recall experiment template with automated speech decoding

To run:
+ Install [Docker](https://www.docker.com/) and Google [Chrome](https://www.google.com/chrome/browser/desktop/index.html)
+ Clone this repo: `git clone https://github.com/ContextLab/autoFR.git`
+ Set up Google Cloud Speech following [these](http://cdl-quail.readthedocs.io/en/latest/tutorial/speech_decoding.html#setting-up-the-google-speech-api) instructions. Once you have a JSON formatted API keyfile downloaded, put in in the exp/autoFR/google-credentials folder, renaming it credentials.json.
+ Navigate to the cloned repo in terminal and type `docker-compose up -d` (this may take a little while)
+ Then, type: `docker attach autofr_psiturk_1`
+ Navigate to the experiment folder: `cd autoFR`
+ Type `psiturk`.  This should spin up a psiturk server
+ Then, type: `server on` (you may get an error the first time you try this, but try it again).
+ Then type `debug` <-this will initialize a local version of the experiment.
+ Point your Google Chrome browser to the randomized link returned and that should be it!
