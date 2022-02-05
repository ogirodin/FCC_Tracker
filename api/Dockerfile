FROM node:latest

WORKDIR /app
RUN ls /app
COPY ./ /app/
RUN ls

RUN yarn

ENTRYPOINT ["bash", "entrypoint.sh"]
