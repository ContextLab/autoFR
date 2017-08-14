# autoFR
A free recall experiment template with automated speech decoding

To run:
+ Install [Docker](https://www.docker.com/) and Google [Chrome](https://www.google.com/chrome/browser/desktop/index.html)
+ Clone this repo: `git clone https://github.com/ContextLab/autoFR.git`
+ Navigate to the cloned repo in terminal and type `docker-compose up -d` (this may take a little while)
+ Then, type: `docker attach psiturkdocker_psiturk_1`
+ Navigate to the experiment folder: `cd autoFR`
+ Type `psiturk`.  This should spin up a psiturk server
+ Then, type: `server on; debug`
+ Open Chrome and go to: `localhost:22362`
