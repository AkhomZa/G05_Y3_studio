document.addEventListener('DOMContentLoaded', () => {
    fetch('E_used/device01_16-10-2024.csv') // ดึงข้อมูลจากไฟล์ CSV
        .then(response => response.text()) // แปลงข้อมูลเป็นข้อความ
        .then(data => {
            const rows = data.split('\n'); // แยกข้อมูลเป็นแถว
            const filteredRows = rows.slice(3); // ลบ 3 แถวแรก
  
            const labels = []; // เก็บข้อมูลเวลาหรือชื่อ
            const usageData = []; // เก็บข้อมูลการใช้งาน
  
            filteredRows.forEach(row => {
                const cols = row.split(','); // แยกข้อมูลคอลัมน์
                if (cols.length > 1) { // ตรวจสอบว่าข้อมูลมีหลายคอลัมน์
                    labels.push(cols[1]); // สมมุติว่าแถวแรกคือเวลา
                    usageData.push(parseFloat(cols[2])); // สมมุติว่าแถวที่สองคือการใช้งาน
                }
            });
  
            // เรียกใช้งานฟังก์ชันเพื่อสร้างกราฟ
            createChart(labels, usageData);
        });
  });
  
  // ฟังก์ชันสร้างกราฟ
  function createChart(labels, data) {
      const ctx = document.getElementById('deviceChart').getContext('2d');
      new Chart(ctx, {
          type: 'line', // ชนิดของกราฟ (กราฟเส้น)
          data: {
              labels: labels, // ใส่ข้อมูลวันที่หรือเวลา
              datasets: [{
                  label: 'Energy Usage (kWh)', // ชื่อกราฟ
                  data: data, // ข้อมูลการใช้งาน
                  borderColor: 'rgb(155,135,12)', // สีของเส้นกราฟ
                  fill: false, // ไม่เติมสีใต้กราฟ
                  tension : 0.5 //make line curve
              }]
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true // ให้แกน Y เริ่มจาก 0
                  }
              }
          }
      });
  }
  