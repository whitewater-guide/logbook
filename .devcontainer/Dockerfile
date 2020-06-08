FROM node:12.16.1-buster

RUN apt-get update && \
    apt-get install postgresql-client-11 locales -y

RUN echo "LC_ALL=en_US.UTF-8" >> /etc/environment \
 && echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
 && echo "LANG=en_US.UTF-8" > /etc/locale.conf \
 && locale-gen en_US.UTF-8
