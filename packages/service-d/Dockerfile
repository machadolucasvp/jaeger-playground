FROM node:14-alpine

WORKDIR /usr/src/app

RUN npm install --only=production
COPY . .

EXPOSE 80
CMD ["node", "index"]