### STAGE 1:BUILD ###
# สร้าง node  
FROM node:18.20.2-alpine AS builder
# Create a Virtual directory inside the docker image

# SET Timezone (Asia/Bangkok GTM+07:00)
RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

WORKDIR /app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory



RUN npm cache clean --force
# COPY . .  เพื่อ copy Code, package.json, package-lock.json local ไปยัง  /app (ฝั่ง docker)
# สั่งรัน  npm install เพื่อติดตั้ง  node_module
# สั่งรัน  npm run build เพื่อ build project  angular

RUN npm install
COPY . .
RUN npm run build


### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:1.25.1-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist/dest-front .
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running
# EXPOSE 80
EXPOSE 80