FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
# Sao chép mã nguồn ứng dụng vào thư mục làm việc
COPY . .
# Mở cổng 3000 để truy cập ứng dụng
EXPOSE 3000
CMD ["node", "src/app.js"]