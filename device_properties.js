// document.addEventListener('DOMContentLoaded', () => {
//     fetch('E_used/device01.csv') // ดึงข้อมูลจากไฟล์ CSV
//         .then(response => response.text()) // รับข้อมูลและแปลงเป็นข้อความ
//         .then(data => {
//             const rows = data.split('\n'); // แยกข้อมูลเป็นแถว
//             const firstThreeRows = rows.slice(0, 3); // ดึงเฉพาะ 3 แถวแรก
//             const device_properties = firstThreeRows.map(row => row.split(',')); // แยกแต่ละคอลัมน์ด้วย ","

//             // define device data from CSV
//             const Name = device_properties[0][1]; //Name
//             const location = device_properties[1][1]; // Location
//             const type = device_properties[2][1]; // Type

//             // update to HTML which call id below
//             document.getElementById('name').innerHTML = "Name: " + Name;
//             document.getElementById('location').innerHTML = "Location: " + location;
//             document.getElementById('type').innerHTML = "Type: " + type;
//         })
//         .catch(error => console.error('Error fetching the CSV data:', error)); // จัดการกับข้อผิดพลาด
// });
document.addEventListener('DOMContentLoaded', () => {
    fetch('E_used/device_01.csv') // ดึงข้อมูลจากไฟล์ CSV ที่เก็บอยู่ในโฟลเดอร์ E_used
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n'); // แยกข้อมูลออกเป็นแถวตามบรรทัด

            const tableBody = document.getElementById('device-table').getElementsByTagName('tbody')[0];

            rows.forEach((row, index) => {
                if (index === 0) return; // ข้ามแถวแรกถ้าเป็นหัวข้อ

                const cols = row.split(','); // แยกข้อมูลแต่ละแถวตามเครื่องหมายคอมมา

                if (cols.length >= 3) { // ตรวจสอบว่ามีข้อมูลครบทุกคอลัมน์
                    const newRow = tableBody.insertRow(); // สร้างแถวใหม่ในตาราง

                    // สร้างเซลล์สำหรับแต่ละคอลัมน์
                    const cell1 = newRow.insertCell();
                    const cell2 = newRow.insertCell();
                    const cell3 = newRow.insertCell();

                    // ใส่ข้อมูลในเซลล์
                    cell1.textContent = cols[0]; // ชื่ออุปกรณ์
                    cell2.textContent = cols[1]; // ตำแหน่ง
                    cell3.textContent = cols[2]; // ประเภทอุปกรณ์
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV data:', error)); // จัดการกับข้อผิดพลาด
});

