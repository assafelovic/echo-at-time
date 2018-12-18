FROM node:alpine

ARG EXPOSE=80
ENV EXPOSE_PORT $EXPOSE
EXPOSE $EXPOSE_PORT

ADD ./ /app
WORKDIR /app

RUN npm i
CMD ["npm", "start"]