# คู่มือการใช้งานระบบรายรับรายจ่าย

## ความต้องการเบื้องต้น

ก่อนเริ่มต้น ตรวจสอบให้แน่ใจว่าคุณมีสิ่งต่อไปนี้:

- **Node.js**: [ดาวน์โหลด Node.js](https://nodejs.org/en/) และติดตั้งบนระบบของคุณ
- **MongoDB**: ตรวจสอบให้แน่ใจว่าคุณมี MongoDB ที่กำลังทำงานอยู่ คุณสามารถใช้ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) หรือตั้งค่า MongoDB เซิร์ฟเวอร์ในเครื่องของคุณ

# Income Expense - Backend

ทำตามขั้นตอนเหล่านี้เพื่อตั้งค่า environment ของคุณ:

### 1. โคลนที่เก็บข้อมูล (Clone Repository)

โคลนที่เก็บข้อมูลนี้ไปยังเครื่องของคุณโดยใช้คำสั่งต่อไปนี้:

```bash
git clone https://github.com/zuyaxiii/IncomeExpenseCode.git
```

### 2. ติดตั้งแพ็คเกจที่จำเป็น

ไปยัง project directory ของคุณและติดตั้งแพ็คเกจที่จำเป็นโดยรันคำสั่ง:

```bash
cd your-project-directory/incomeexpenseback
npm install
```

### 3. ตั้งค่า environment

สร้างไฟล์ .env ในรูทของโปรเจค ไฟล์นี้จะเก็บข้อมูลที่สำคัญสำหรับ environment ของคุณครับ คัดลอกการกำหนดค่าต่อไปนี้ลงในไฟล์ .env:

```bash
# MongoDB Connection URI
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here

# Server Port
PORT=4000
```

- แทนที่ mongodb://localhost:27017/your-database-name ด้วย MongoDB URI ของคุณที่เตรียมเอาไว้ครับ
- แทนที่ your_jwt_secret_here ด้วยคีย์ลับที่คุณเลือกสำหรับการรับรองความถูกต้อง JWT

### 4. การรันแอปพลิเคชัน

หลังจากตั้งค่าไฟล์ .env แล้ว ให้รันแอปพลิเคชันโดยใช้คำสั่งต่อไปนี้:

```bash
node server.js
```

นี่จะเริ่มเซิร์ฟเวอร์บนพอร์ตที่ระบุในไฟล์ .env (หรือ Defult PORT 4000)

## การยืนยันตัวตน

ทุกเอนด์พอยท์ (ยกเว้น `/register` และ `/login`) ต้องการการยืนยันตัวตน ใช้ **Bearer token** ในส่วนหัว `Authorization` เพื่อเข้าถึงเส้นทางที่ได้ Authenticate ไว้

ตัวอย่าง:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## เอนด์พอยท์

### 1. `POST /register`
ลงทะเบียนบัญชีผู้ใช้ใหม่

#### คำขอ (Request)

- **Method**: POST
- **URL**: `/register`
- **Body**:
    ```json
    {
      "username": "user1",
      "password": "yourpassword",
    }
    ```

#### การตอบกลับ (Response)

- **201 Created**:
    ```json
    {
    "message": "User registered successfully",
    "user": {
        "username": "user1",
        "password": "$2b$10$7g/C9NB/RWZ9eq5xX.9....../7k1Fo9R91.",
        "_id": "67d6b34c82397701774c.....",
        "__v": 0
    }
    }
    ```
- **400 Bad Request**:
    - หากขาดฟิลด์ที่จำเป็นหรือให้ข้อมูลที่ไม่ถูกต้อง

---

### 2. `POST /login`
เข้าสู่ระบบและรับโทเค็น

#### คำขอ (Request)

- **Method**: POST
- **URL**: `/login`
- **Body**:
    ```json
    {
      "username": "user1",
      "password": "yourpassword"
    }
    ```

#### การตอบกลับ (Response)

- **200 OK**:
    ```json
    {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ......"
    }
    ```
- **401 Unauthorized**:
    - หากข้อมูลการเข้าสู่ระบบไม่ถูกต้อง

---

### 3. `POST /transactions`
สร้างธุรกรรมใหม่

#### คำขอ (Request)

- **Method**: POST
- **URL**: `/transactions`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    Content-Type: application/json
    ```
- **Body**:
    ```json
    {
      "name": "เงินเดือน",
      "amount": 50000,
      "date": "2025-03-12",
      "type": "income"
    }
    ```

#### การตอบกลับ (Response)

- **201 Created**:
    ```json
    {
    "name": "เงินเดือน",
    "amount": 50000,
    "date": "2025-03-12T00:00:00.000Z",
    "type": "income",
    "userId": "67d6b34c8239770.....",
    "_id": "67d6b446823977017.....",
    "__v": 0
    }
    ```
- **400 Bad Request**:
    - หากขาดฟิลด์ที่จำเป็นหรือให้ข้อมูลที่ไม่ถูกต้อง

---

### 4. `GET /transactions`
ดึงรายการธุรกรรมทั้งหมด

#### คำขอ (Request)

- **Method**: GET
- **URL**: `/transactions`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    ```

#### การตอบกลับ (Response)

- **200 OK**:
    ```json
    [
      {
        "id": 1,
        "name": "Transaction Name",
        "amount": 100,
        "date": "2025-03-15",
        "type": "expense"
      },
      {
        "id": 2,
        "name": "Another Transaction",
        "amount": 200,
        "date": "2025-03-16",
        "type": "income"
      }
    ]
    ```

---

### 5. `DELETE /transactions/:id`
ลบธุรกรรมโดย ID

#### คำขอ (Request)

- **Method**: DELETE
- **URL**: `/transactions/:id`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    ```

#### การตอบกลับ (Response)

- **204 No Content**:
    - หากลบธุรกรรมสำเร็จ
- **404 Not Found**:
    - หากไม่พบธุรกรรมที่มี ID ที่กำหนด

---

### 6. `GET /transactions/balance`
ดูยอดคงเหลือ (รายรับทั้งหมดและรายจ่ายทั้งหมด)

#### คำขอ (Request)

- **Method**: GET
- **URL**: `/transactions/balance`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    ```

#### การตอบกลับ (Response)

- **200 OK**:
    ```json
    {
      "income": 5000,
      "expense": 3000,
      "balance": 2000
    }
    ```

---

### 7. `GET /transactions/search`
ค้นหาธุรกรรมตามวันที่หรือประเภท

#### คำขอ (Request)

- **Method**: GET
- **URL**: `/transactions/search`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    ```
- **พารามิเตอร์คำค้น (Query Parameters)**:
    - `date`: วันที่ของธุรกรรมที่คุณต้องการค้นหา
    - `type`: ประเภทของธุรกรรมที่คุณต้องการค้นหา (income/expense)
    - ตัวอย่าง: `/transactions/search?date=2025-03-15` หรือ `/transactions/search?type=expense` หรือ `/transactions/search?date=2025-03-15&type=expense`

#### การตอบกลับ (Response)

- **200 OK**:
    ```json
    [
      {
        "id": 1,
        "name": "Transaction Name",
        "amount": 100,
        "date": "2025-03-15",
        "type": "expense"
      }
    ]
    ```

---

### 8. `GET /transactions/summary`
ดูสรุปธุรกรรมทั้งหมด

#### คำขอ (Request)

- **Method**: GET
- **URL**: `/transactions/summary`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    ```

#### การตอบกลับ (Response)

- **200 OK**:
    ```json
    {
      "income": 5000,
      "expense": 3000,
      "balance": 2000
    }
    ```

---

### 9. `GET /transactions/export/excel`
ส่งออกธุรกรรมทั้งหมดเป็นไฟล์ Excel

#### คำขอ (Request)

- **Method**: GET
- **URL**: `/transactions/export/excel`
- **Headers**:
    ```json
    Authorization: Bearer <your_token>
    ```

#### การตอบกลับ (Response)

- **200 OK**: ไฟล์ Excel จะถูกส่งกลับเป็นไฟล์ที่สามารถดาวน์โหลดได้

---

## การจัดการข้อผิดพลาด

API จะส่งคืนรหัสสถานะ HTTP ที่เหมาะสมสำหรับข้อผิดพลาดประเภทต่างๆ:

- **400 Bad Request** – หากไคลเอนต์ส่งคำขอที่ไม่ถูกต้อง (เช่น ขาดพารามิเตอร์ที่จำเป็น)
- **401 Unauthorized** – หากต้องการการยืนยันตัวตนแต่ไม่ได้ให้ไว้หรือไม่ถูกต้อง
- **403 Forbidden** – หากผู้ใช้ไม่มีสิทธิ์เข้าถึงทรัพยากร
- **404 Not Found** – หากไม่พบทรัพยากร
- **500 Internal Server Error** – หากมีข้อผิดพลาดที่ไม่คาดคิดของเซิร์ฟเวอร์