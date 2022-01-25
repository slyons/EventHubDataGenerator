FROM node:14-alpine

WORKDIR /build

COPY package.json /build

RUN npm install .

FROM node:14-alpine
WORKDIR /app

COPY --from=0 /build/node_modules /app/node_modules
COPY --from=0 /build/package-lock.json /app/

COPY package.json /app/
COPY public /app/public/
COPY index.js /app/
COPY sender.js /app/

CMD [ "npm", "start" ]