# JelBarber API

Backend API สำหรับร้านตัดผม รองรับ สมาชิก/พนักงาน, นัดหมาย, ชำระเงิน, สต็อก, สาขา พร้อม JWT auth

## Setup
1. `cp .env.example .env`
2. ใส่ค่า Railway PostgreSQL และ `JWT_SECRET`
3. `npm install`
4. `npm run dev`

## Endpoints
Base URL: `/api`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users (admin only)
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Branches
- `GET /api/branches`
- `GET /api/branches/:id`
- `POST /api/branches`
- `PUT /api/branches/:id`
- `DELETE /api/branches/:id`

### Appointments
- `GET /api/appointments`
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Payments
- `GET /api/payments`
- `GET /api/payments/:id`
- `POST /api/payments`
- `PUT /api/payments/:id`
- `DELETE /api/payments/:id`

### Inventory
- `GET /api/inventory`
- `GET /api/inventory/:id`
- `POST /api/inventory`
- `PUT /api/inventory/:id`
- `DELETE /api/inventory/:id`

### Transection
- `GET /api/transection`
- `GET /api/transection/:id`
- `POST /api/transection`
- `PUT /api/transection/:id`
- `DELETE /api/transection/:id`

## Notes
- ทุก endpoint (ยกเว้น auth) ต้องส่ง `Authorization: Bearer <token>`
- โมเดลสัมพันธ์กันใน `src/models/index.js`
- `sequelize.sync()` จะสร้างตารางอัตโนมัติในครั้งแรก
- Railway จะตั้งค่า `DATABASE_URL`/`PG*` ให้เองตอน deploy; สำหรับ local ให้กำหนด `DATABASE_URL` หรือ `DB_*` เอง
# jelbarber-api
