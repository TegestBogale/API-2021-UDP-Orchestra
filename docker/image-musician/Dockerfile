FROM node:14.17
LABEL authors="FERCHICHI Ahmed Farouk, 	Tegset Bogale"

#
# When we build the image, we copy the sources in the image file system. 
#
COPY src /opt/app/

RUN npm install

ENTRYPOINT ["node", "/opt/app/musician.js"]