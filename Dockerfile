FROM node:alpine

ARG EXPOSE=80
ENV PORT $EXPOSE
EXPOSE $EXPOSE

ADD ./ /app
WORKDIR /app

RUN npm i
CMD ["npm", "start"]