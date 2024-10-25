FROM node:14-alpine
WORKDIR /app
COPY . /app
RUN npm install \
    && npm run build \
    && npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]