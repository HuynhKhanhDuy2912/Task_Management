# Sử dụng image Node.js chính thức
FROM node:18

# Thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Lắng nghe cổng 5000
EXPOSE 5000

# Lệnh khởi động ứng dụng
CMD ["npm", "start"]
