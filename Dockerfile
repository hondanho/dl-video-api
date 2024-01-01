FROM node:19-alpine as build

WORKDIR /usr/src/app

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

COPY package.json ./
COPY swagger_output.json ../

RUN npm install

COPY . .

RUN npm run build

FROM node:19-alpine as dependencies

WORKDIR /usr/src/app

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

COPY package.json swagger_output.json ./

RUN npm install

FROM node:19-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Get python3 (needed for yt-dlp)
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

COPY --from=build /usr/src/swagger_output.json /usr/src/
COPY --from=build /usr/src/app/package.json /usr/src/app/
COPY --from=build /usr/src/app/build /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 8080
CMD [ "node", "./index.js" ]