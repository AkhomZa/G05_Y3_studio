document.addEventListener('DOMContentLoaded', () => {
    fetch('E_used/device01_16-10-2024.csv') // ดึงข้อมูลจากไฟล์ CSV
        .then(response => response.text()) // รับข้อมูลและแปลงเป็นข้อความ
        .then(data => {
            const rows = data.split('\n'); // แยกข้อมูลเป็นแถว
            const firstThreeRows = rows.slice(0, 3); // ดึงเฉพาะ 3 แถวแรก
            const device_properties = firstThreeRows.map(row => row.split(',')); // แยกแต่ละคอลัมน์ด้วย ","

            // define device data from CSV
            const Name = device_properties[0][1]; //Name
            const location = device_properties[1][1]; // Location
            const type = device_properties[2][1]; // Type

            // update to HTML which call id below
            document.getElementById('name').innerHTML = "Name: " + Name;
            document.getElementById('location').innerHTML = "Location: " + location;
            document.getElementById('type').innerHTML = "Type: " + type;
        })
        .catch(error => console.error('Error fetching the CSV data:', error)); // จัดการกับข้อผิดพลาด
});

// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const port = 3000;

// // กำหนดโฟลเดอร์ที่ต้องการสแกน
// const directoryPath = path.join(__dirname, 'E_used');

// app.get('/list-csv', (req, res) => {
//     // อ่านไฟล์ทั้งหมดในโฟลเดอร์
//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             return res.status(500).send('Unable to scan directory: ' + err);
//         }

//         // กรองหาเฉพาะไฟล์ที่ลงท้ายด้วย .csv
//         const csvFiles = files.filter(file => file.endsWith('.csv'));
//         res.json(csvFiles); // ส่งรายชื่อไฟล์ CSV กลับเป็น JSON
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

