FROM node: 18
WORKDIR /app
COPY package
RUN npm install
COPY  . .
EXPOSE 5000
CMD ["node", "main.js"]