FROM node:14 as builder

RUN apt update && apt install python-minimal
WORKDIR /.xpd

WORKDIR /app
COPY . .

# RUN rm package-lock.json
RUN npm install 
# --ignore-scripts
# RUN npm run lint
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
