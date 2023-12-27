
FROM node:16


RUN npm ci --only=production
RUN npm run build

FROM nginx

COPY /dist /usr/share/nginx/html 
