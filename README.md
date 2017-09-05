# autoFR
A free recall experiment template with automated speech decoding

# Installing autoFR
+ Install [Docker](https://www.docker.com/) and [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
+ Clone this repo: `git clone https://github.com/ContextLab/autoFR.git`
+ Set up Google Cloud Speech following [these](http://cdl-quail.readthedocs.io/en/latest/tutorial/speech_decoding.html#setting-up-the-google-speech-api) instructions. Once you have a JSON formatted API keyfile downloaded, put in in the exp/autoFR/google-credentials folder, renaming it credentials.json.

# Running autoFR
+ Navigate to the cloned repo in terminal and type `docker-compose up -d` (this may take a little while)
+ Then, type: `docker attach autofr_psiturk_1`
+ Navigate to the experiment folder: `cd autoFR`
+ Type `psiturk`.  This should spin up a psiturk server
+ Then, type: `server on` (you may get an error the first time you try this, but try it again).
+ Then type `debug` <-this will initialize a local version of the experiment.
+ Point your Google Chrome browser to the randomized link returned and follow the on-screen instructions to run in the experiment!

# Analyzing the data
We've created [Quail](http://cdl-quail.readthedocs.io/en/latest/), a Python toolbox for analyzing and plotting free recall data. To analyze data using quail, follow this example code:

```
import quail

# location of the database
dbpath = '~/exp/autoFR/participants.db'

# location of the audio files
recpath = '~/exp/autoFR/audio/'

# option to remove subjects
remove_subs = ['debugV2WLPQ:debugQN6O0V', 'debugFIGADU:debugPSS00O', 'debugZ5SE8F:debugYT96YP']

# experiment word pool
wordpool = '~/exp/autoFR/static/files/cut_wordpool.csv'

# experiment version (defined in autoFR/config.txt)
experiments = ['0.0', '1.0', '1.1', '6.1', '7.1', '8.1']

# optionally group experiments with different versions into a single egg
groupby = {'exp_version': [['0.0', '1.0', '1.1'], '6.1', '7.1', '8.1']}

# generate a list of `eggs` of len(groupby['exp_version'])
eggs = quail.load(dbpath=dbpath, recpath=recpath, remove_subs=remove_subs,
                  wordpool=wordpool, experiments=experiments, groupby=groupby)
```
