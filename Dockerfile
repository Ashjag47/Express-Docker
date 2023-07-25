FROM node:15
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ENV PORT=3000
EXPOSE $PORT
CMD ["npm", "run", "dev"]