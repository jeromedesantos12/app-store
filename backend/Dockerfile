FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# build TypeScript dulu
RUN npm run build

RUN npx prisma generate

EXPOSE 80
# jalankan hasil build-nya
CMD ["node", "dist/app.js"]