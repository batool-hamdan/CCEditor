FROM batool83/node:14-alpine
WORKDIR /app
COPY . /app
# RUN npm install -g serve
RUN npm install \
    && npm run build
EXPOSE 3000
CMD ["serve", "-s", "build"]