FROM node:20.19.5-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn setup

EXPOSE 3000 3001

CMD ["yarn", "start"]
