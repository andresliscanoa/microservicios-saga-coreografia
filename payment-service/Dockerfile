FROM node:18.0-alpine
LABEL authors="lliscano"
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i --omit=dev
COPY . .
CMD ["node", "app.js"]