FROM node:16.13.1
MAINTAINER Tegest Bogale, Farouk Ferchichi

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/app.js"]
