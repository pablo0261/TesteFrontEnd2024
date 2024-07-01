FROM node:16-alpine as builder
WORKDIR /app

COPY package.json ./
RUN npm install --production
RUN npm install -g typescript
RUN npm install

COPY tsconfig.json ./
COPY app.ts ./
COPY public ./public
RUN npm run build

FROM node:16-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

EXPOSE 3002

CMD ["node", "dist/app.js"]
