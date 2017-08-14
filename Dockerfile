# Dockerfile for autoFR container
FROM debian:stretch
MAINTAINER Contextual Dynamics Lab <contextualdynamics@gmail.com>

# install debian-related stuff
RUN apt-get update
RUN apt-get install -y eatmydata
RUN eatmydata apt-get install -y \
    python-dev \
    default-libmysqlclient-dev \
    python-pip \
    procps \
    git \
    curl \
    yasm
RUN rm -rf /var/lib/apt/lists/*

# install python packages
RUN pip install --upgrade pip
RUN pip install --upgrade \
setuptools \
requests \
mysql-python \
psiturk \
google-cloud-speech \
pydub

# install ffmpeg
RUN git clone http://source.ffmpeg.org/git/ffmpeg.git
RUN cd ffmpeg && ./configure --enable-gpl && \
make && make install && ldconfig

# setup working directory
WORKDIR /psiturk

# set up psiturk to use the .psiturkconfig in /psiturk
ENV PSITURK_GLOBAL_CONFIG_LOCATION=/psiturk/

# expose port to access psiturk from outside
EXPOSE 22362
