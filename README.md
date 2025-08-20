# Case Assesment Test: Program Magang BelajarLinkedIn
Merupakan Page untuk dokumentasi dan cara penggunaan API yang dibuat

## What is this project?
Repo ini merupakan sebuah rest API dengan sistem CRUD basic untuk sistem BelajarLinkedIn

## Used Tech for the API
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySql with XAMPP
- **Authentication**: JWT
- **Password Hash**: bcryptjs
- **CORS**

## Database Structure
### 1. Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

### 2. Classes
```sql
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kelas VARCHAR(100) NOT NULL,
  pengajar VARCHAR(100) NOT NULL,
  durasi INT NOT NULL COMMENT 'Durasi dalam menit',
  peserta INT NOT NULL DEFAULT 0,
  peserta_maximum INT NOT NULL DEFAULT 50
);
```

### 3. Enrollments
```sql
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  id_kelas INT NOT NULL,
  tanggal_daftar DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('aktif','selesai','batal') NOT NULL DEFAULT 'aktif',
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_kelas) REFERENCES classes(id) ON DELETE CASCADE
);
```
### 4. Trigger (for updating enrolled student onto classes)
```sql
DELIMITER $$
CREATE TRIGGER trg_enroll_after_insert
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
  IF NEW.status = 'aktif' THEN
    UPDATE classes SET peserta = peserta + 1 WHERE id = NEW.id_kelas;
  END IF;
END$$

CREATE TRIGGER trg_enroll_after_update
AFTER UPDATE ON enrollments
FOR EACH ROW
BEGIN
  IF OLD.status <> 'aktif' AND NEW.status = 'aktif' THEN
    UPDATE classes SET peserta = peserta + 1 WHERE id = NEW.id_kelas;
  ELSEIF OLD.status = 'aktif' AND NEW.status <> 'aktif' THEN
    UPDATE classes SET peserta = peserta - 1 WHERE id = NEW.id_kelas;
  END IF;
END$$

CREATE TRIGGER trg_enroll_after_delete
AFTER DELETE ON enrollments
FOR EACH ROW
BEGIN
  IF OLD.status = 'aktif' THEN
    UPDATE classes SET peserta = peserta - 1 WHERE id = OLD.id_kelas;
  END IF;
END$$
DELIMITER ;
```

## Documentation of ENDPOINT List and Example Request &amp; Response JSON
### 1. POST /auth/register
Register user
#### Request:
```json
{
    "nama": "Johhny",
    "email": "Johhny@gmail.com",
    "password": "Johhny123"
}
```
#### Response:
```json
{
    "message": "Registrasi berhasil",
    "userId": 1
}
```

### 2. POST /auth/login
Login user
#### Request:
```json
{
  "email": "Johhny@gmail.com",
  "password": "Johhny123"
}
```
#### Response:
```json
{
    "message": "Login berhasil",
    "token": <JWT_token>
    "user": {
        "id": 1,
        "nama": "Johhny",
        "email": "Johhny@gmail.com"
    }
}
```

### 3. GET /classes
Ambil semua data kelas
#### Response:
```json
{"message":"Data kelas berhasil diambil","data":[{"id":1,"kelas":"Belajar Node.js","pengajar":"Toper","durasi":120,"peserta":0,"peserta_maximum":50},{"id":2,"kelas":"Belajar HTML","pengajar":"Rino","durasi":120,"peserta":0,"peserta_maximum":50},{"id":3,"kelas":"Belajar Python Basic","pengajar":"Rino","durasi":120,"peserta":0,"peserta_maximum":50},{"id":4,"kelas":"Belajar C++ untuk Pemula","pengajar":"Rino","durasi":120,"peserta":0,"peserta_maximum":50}]}
```

### 4. GET/classes/:id
Ambil data kelas berdasarkan ID
#### Response:
```json
{"message":"Data kelas berhasil diambil","data":{"id":1,"kelas":"Belajar Node.js","pengajar":"Toper","durasi":120,"peserta":0,"peserta_maximum":50}}
```

### 5. POST /classes (Admin)
Tambahkan sebuah kelas
#### Header (for token authorization):
```json
{
  "key": "Authorization",
  "value": "Bearer <JWT_Token>"
}
```
#### Request:
```json
{
  "kelas": "Belajar Node.js",
  "pengajar": "Toper",
  "durasi": "120",
  "peserta_maximum": "50"
}
```
#### Response:
```json
{
    "message": "Kelas berhasil dibuat",
    "id": 1
}
```

### 6. PUT /classes/:id (Admins Only Scenario)
Pengelolaan data kelas (update and/or edit)
#### Request:
```json
{
  "kelas": "Belajar Node.js",
  "pengajar": "Rino",
  "durasi": "120",
  "peserta_maximum": "50"
}
```
#### Response:
```json
{"message":"Kelas berhasil diperbarui"}
```

### 7. DELETE a/classes/:id (Admins Only Scenario)
Hapus kelas
#### Response:
```json
{"message":"Kelas berhasil dihapus"}
```

### 8. POST /enrollments/enroll
Enroll to a class
#### Request:
```json
{
    "classId": "3"
}
```
#### Response:
```json
{"success":true,"message":"Pendaftaran berhasil","data":{"id_enrollment":2,"id_user":1,"id_kelas":"3"}}
```

### 9. GET /enrollments/my-enrollments
Ambil data kelas yang diikuti oleh murid
#### Response:
```json
{"success":true,"message":"Data pendaftaran berhasil diambil","data":[{"id_daftar":2,"tanggal_daftar":"2025-08-20T16:25:32.000Z","status":"aktif","id_kelas":3,"kelas":"Belajar Python Basic","pengajar":"Rino","durasi":120},{"id_daftar":1,"tanggal_daftar":"2025-08-20T16:25:17.000Z","status":"aktif","id_kelas":2,"kelas":"Belajar HTML","pengajar":"Rino","durasi":120}]}
```

### 10. GET /enrollments/class_id
Ambil data murid yang ikut suatu kelas
#### Response:
```json
{"message":"Data pendaftaran berhasil diambil","data":[{"id_daftar":1,"tanggal_daftar":"2025-08-20T16:25:17.000Z","status":"aktif","id_user":1,"nama":"Kenny","email":"Nygo@gmail.com"}]}
```

### 11. PUT /enrollments/class_id
Ubah status kelas murid (Pengubahan status otomatis akan mengeluarkan siswa dari kelas)
```json
{
    "status": "batal"
}
```

#### Response:
```json
{"message":"Status pendaftaran diperbarui"}
```

### 12. GET /health
Server status check
#### Response:
```json
{"message":"API Belajar LinkedIn berjalan"}
```

## Run and Test API
**1. Clone Repo**
```bash
git clone https://github.com/DraGoIlE/BelajarLinkedIn-API-AssesmentCaseFinal.git
cd BelajarLinkedIn-API-AssesmentCaseFinal
```

**2. Install Dependencies**
```bash
npm install
```

**3. Setup Database**  
Gunakan XAMPP/MySql untuk menyiapkan database yang dibutuhkan
```sql
CREATE DATABASE belajar_linkedin;
```
Import database.sql dari folder module untuk menambahkan table dan trigger secara langsung

**4. Environment Config**  
Buat sebuah file .env dengan format seperti berikut
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=belajar_linkedin
JWT_SECRET=
PORT=
```

**5. Run it**  
Jalankan dengan command berikut
```bash
nodemon server
```
tanpa nodemon:
```bash
node server.js
```
jika nodemon diinstall secara lokal:
```bash
npx nodemon server
```
