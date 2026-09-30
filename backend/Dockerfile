#dockerfile starts with FROM. node version 22
FROM node:22-slim                                       
#go to app directory
WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
#
COPY package*.json ./

RUN npm install

COPY server.js ./

COPY vocabulary.db ./

#expose port so computer can access it
EXPOSE 3000

CMD ["node", "server.js"]