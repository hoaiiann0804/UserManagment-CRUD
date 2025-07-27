# UserManagment-CRUD

# Tài liệu Dự án UserManagement Backend

## Tổng quan dự án

Dự án **UserManagement Backend** là một ứng dụng backend RESTful API được xây dựng bằng Node.js, Express.js và MongoDB, được container hóa hoàn toàn bằng Docker. Dự án cung cấp các chức năng CRUD (Create, Read, Update, Delete) để quản lý người dùng.

### Công nghệ sử dụng

- **Backend Framework**: Express.js (v5.1.0)
- **Database**: MongoDB với Mongoose ODM (v8.16.4)
- **Environment Management**: dotenv (v17.2.1)
- **Containerization**: Docker & Docker Compose
- **Database GUI**: Mongo Express (tùy chọn)

## Cấu trúc dự án

```
backend-userMangement/
├── src/
│   └── app.js                    # File chính chứa server và API routes
├── .dockerignore                 # Loại trừ files khi build Docker
├── .env                         # Biến môi trường
├── Dockerfile                   # Cấu hình Docker image
├── docker-compose.yml           # Orchestration cho multi-container
├── package.json                 # Dependencies và scripts
├── package-lock.json            # Lock file cho dependencies
├── README.md                    # Hướng dẫn sử dụng dự án
├── Method.md                    # Ghi chú về các method Mongoose
├── MongoDB_Connect_Inside_Container.md    # Hướng dẫn kết nối MongoDB
├── MongoDB_Connect_Using_Mongosh.md      # Hướng dẫn sử dụng mongosh
└── READMEERROR.md              # Ghi chú về các lỗi thường gặp
```

## Quá trình tạo dự án

### Bước 1: Khởi tạo dự án Node.js

```bash
# Tạo thư mục dự án
mkdir backend-userMangement
cd backend-userMangement

# Khởi tạo package.json
npm init -y

# Cài đặt dependencies
npm install express mongoose dotenv

# Tạo cấu trúc thư mục
mkdir src
```

### Bước 2: Tạo file cấu hình môi trường (.env)

```env
MONGO_URI="admin:password@mongodb://mongodb:27017/userManagement?authSource=admin"
PORT=3000
```

### Bước 3: Phát triển ứng dụng chính (src/app.js)

File `app.js` chứa:

- Kết nối MongoDB với Mongoose
- Định nghĩa User Schema với validation
- Các API endpoints CRUD
- Error handling và middleware

**Các tính năng chính:**

- **User Schema**: username, email (unique), phone (unique), address
- **Validation**: Email format validation, required fields
- **Unique Constraints**: Email và phone number không được trùng lặp
- **Error Handling**: Xử lý lỗi duplicate key, validation errors

### Bước 4: Containerization với Docker

#### Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
```

#### docker-compose.yml

Cấu hình multi-container với:

- **Web service**: Node.js application
- **MongoDB service**: Database với authentication
- **Mongo Express**: Web-based MongoDB admin interface (commented)

### Bước 5: Cấu hình bổ sung

#### .dockerignore

```
node_modules
.env
```

## API Endpoints

### 1. Tạo người dùng mới

```http
POST /user
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St"
}
```

### 2. Lấy danh sách tất cả người dùng

```http
GET /user
```

### 3. Lấy thông tin người dùng theo ID

```http
GET /user/:id
```

### 4. Cập nhật thông tin người dùng

```http
PUT /user/:id
Content-Type: application/json

{
    "username": "john_updated",
    "email": "john_new@example.com",
    "phone": "0987654321",
    "address": "456 New St"
}
```

### 5. Xóa người dùng

```http
DELETE /user/:id
```

## Hướng dẫn chạy dự án

### Phương pháp 1: Sử dụng Docker Compose (Khuyến nghị)

```bash
# Build và chạy tất cả services
docker-compose up --build

# Chạy ở background
docker-compose up -d

# Dừng services
docker-compose down

# Dừng và xóa volumes (reset database)
docker-compose down -v
```

### Phương pháp 2: Chạy local (cần MongoDB riêng)

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
# hoặc
node src/app.js
```

## Quản lý Database

### Kết nối MongoDB bằng mongosh

```bash
# Truy cập MongoDB container
docker exec -it mongo mongosh -u admin -p password --authenticationDatabase admin

# Các lệnh MongoDB cơ bản
show dbs
use userManagement
show collections
db.users.find()
```

### Sử dụng Mongo Express (GUI)

1. Uncomment phần mongo-express trong `docker-compose.yml`
2. Chạy lại docker-compose
3. Truy cập http://localhost:8081
4. Đăng nhập: admin/admin123

## Tính năng nổi bật

### 1. Validation và Error Handling

- Email format validation với regex
- Unique constraints cho email và phone
- Comprehensive error messages
- Proper HTTP status codes

### 2. Database Optimization

- Indexes cho email và phone fields
- Efficient duplicate checking với `$or` operator
- Proper schema design với Mongoose

### 3. Docker Best Practices

- Multi-stage builds
- Proper networking between containers
- Volume persistence cho database
- Environment variable management

### 4. Development Features

- Hot reload support
- Comprehensive logging
- Error debugging tools

## Troubleshooting

### Lỗi thường gặp

1. **Authentication failed**

   - Kiểm tra MONGO_URI trong .env
   - Đảm bảo MongoDB container đang chạy

2. **Port already in use**

   ```bash
   docker-compose down
   # Hoặc thay đổi port trong docker-compose.yml
   ```

3. **Duplicate key error**
   - Xóa dữ liệu trùng lặp trong database
   - Sử dụng script cleanup trong README.md

### Lệnh debug hữu ích

```bash
# Xem logs
docker-compose logs web
docker-compose logs mongo

# Kiểm tra containers đang chạy
docker ps

# Xem volumes
docker volume ls

# Rebuild từ đầu
docker-compose build --no-cache
```

## Kết luận

Dự án UserManagement Backend đã được phát triển hoàn chỉnh với:

- ✅ RESTful API đầy đủ chức năng CRUD
- ✅ Database design tối ưu với validation
- ✅ Containerization hoàn chỉnh
- ✅ Error handling và logging
- ✅ Documentation chi tiết
- ✅ Development và production ready

Dự án có thể được mở rộng thêm các tính năng như authentication, authorization, pagination, và nhiều tính năng khác tùy theo yêu cầu business.
