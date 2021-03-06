FROM node:10.15.3-alpine as BASE
WORKDIR /app
COPY package*.json ./
RUN npm install --silent --progress=false
COPY . .
RUN npm run build

FROM node:10.15.3-alpine as BUILD
WORKDIR /app
COPY --from=BASE /app/package*.json ./
RUN npm install --silent --progress=false --production
COPY --from=BASE /app/dist/ ./dist

FROM astefanutti/scratch-node:10.13.0 as PROD
COPY --from=BUILD /app /
EXPOSE 3000

# USER node

ENTRYPOINT [ "./node", "dist/index.js" ]
