# Comparison: HTTP Server vs Express Server

## 🔹 1. ความแตกต่างหลัก
| ประเด็น | HTTP Server (Native Node.js) | Express Server |
|----------|-------------------------------|----------------|
| การสร้างเซิร์ฟเวอร์ | ต้องใช้ `http.createServer()` เอง | ใช้ `express()` ช่วยจัดการง่ายกว่า |
| Routing | ต้องเขียนเงื่อนไข `if` และ regex เอง | มี `app.get()`, `app.post()` ที่อ่านง่าย |
| Middleware | ไม่มีในตัว ต้องเขียนเอง | มีระบบ middleware จัดการ request/response ได้ง่าย |
| การตอบกลับ JSON | ต้องใช้ `res.writeHead` และ `res.end()` | ใช้ `res.json()` ได้โดยตรง |
| การจัดการ 404 | ต้องเขียนเงื่อนไขเอง | ใช้ middleware จัดการรวมได้ |
| ความเหมาะสม | เหมาะสำหรับโปรเจกต์ขนาดเล็ก | เหมาะสำหรับระบบขนาดกลางถึงใหญ่ |

## 🔹 2. สรุป
- **HTTP Server** ให้ความเข้าใจพื้นฐานของ Node.js แต่เขียนยากกว่าเมื่อมีหลาย endpoint  
- **Express** ใช้งานง่ายกว่า มี middleware และ routing system ที่ช่วยลดโค้ดซ้ำ

