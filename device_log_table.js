document.addEventListener('DOMContentLoaded', () => {
  fetch('E_used/device01_16-10-2024.csv') // ดึงข้อมูลจากไฟล์ CSV
      .then(response => response.text()) // แปลงข้อมูลจากไฟล์เป็นข้อความ
      .then(data => {
          const rows = data.split('\n'); // แยกข้อมูลเป็นแถว
          const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];

          // เติมข้อมูลจาก CSV ลงในตาราง
          rows.forEach(row => { 
              const cols = row.split(','); // แยกข้อมูลคอลัมน์
              if (cols.length > 1) { // ตรวจสอบว่าแถวไม่ว่างหรือไม่
                  const newRow = table.insertRow(); // สร้างแถวใหม่ใน tbody
                  for (let i = 1; i < cols.length; i++) {  //skip data in col 1 (date)
                    const newCell = newRow.insertCell();
                    newCell.textContent = cols[i]; // เพิ่มข้อมูลลงในเซลล์
                }
              }
          });

          // ลบ 3 แถวแรกออก
          const rowsToRemove = 3;
          for (let i = 0; i < rowsToRemove; i++) {
              if (table.rows.length > 0) {
                  table.deleteRow(0);  // ลบแถวแรก
              }
          }
      });
});
