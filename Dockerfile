FROM node:14.11.0-slim
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app
COPY package*.json ./
RUN npm install --pure-lockfile
COPY . .
RUN npm run build
CMD ["node", "dist/src/main"]