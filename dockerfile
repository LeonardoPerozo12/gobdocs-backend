FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
