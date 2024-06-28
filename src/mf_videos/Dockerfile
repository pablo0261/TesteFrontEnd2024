FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install

RUN npm install @types/express @types/cors @types/dotenv --save-dev

COPY . .

RUN npm run build

CMD ["node", "dist/app.js"]
