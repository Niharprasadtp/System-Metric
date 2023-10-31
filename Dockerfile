FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN yarn install --production



CMD ["npm","run","dev"]