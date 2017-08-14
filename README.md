# autoFR
A free recall experiment template with automated speech decoding

To run:
+ Install [docker](https://www.docker.com/)
+ Clone this repo: `git clone`
+ Navigate to the cloned repo in terminal and type `docker-compose up -d`
+ Then, type: `docker attach psiturkdocker_psiturk_1`
+ Navigate to the experiment folder: `cd autoFR`
+ Type `psiturk`.  This should spin up a psiturk server
+ Then, type: `server on; debug`
