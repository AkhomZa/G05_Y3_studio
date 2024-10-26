function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Remove active class from all tab buttons
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Show the current tab content and add active class to the button
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function viewDetails(filename) {
    // เปลี่ยนไปที่แท็บ "Detail"
    openTab(event, 'device_detail');

    // เรียกข้อมูลจากเซิร์ฟเวอร์
    fetch(`/detail/${filename}`)
        .then(response => response.json())
        .then(data => {
            const detailTableBody = document.getElementById('detail_table').querySelector('tbody');
            detailTableBody.innerHTML = ''; // ล้างข้อมูลเก่า

            // หาวันที่ปัจจุบัน
            const currentDate = new Date(); // วันและเวลาปัจจุบัน format --> YYYY/MM/DD
            const currentDateString = currentDate.toLocaleDateString('en-GB'); // แปลงเป็น DD/MM/YYYY
            
            // แปลงวันที่เป็นรูปแบบ DD-MM-YYYY
            const formattedCurrentDate = currentDateString.split('/').join('-'); // เปลี่ยนเป็น DD-MM-YYYY

            console.log('Formatted Current Date:', formattedCurrentDate);
            
            // กรองข้อมูลตามวันที่ปัจจุบัน
            const currentData = data.filter(row => {
                return row['DD-MM-YYYY'] === formattedCurrentDate;
            });
            
            if (currentData.length === 0) {
                console.log('No data found for today.'); // เพิ่มบรรทัดนี้เพื่อตรวจสอบว่ามีข้อมูลหรือไม่
            }

            // แสดงข้อมูลในตาราง
            currentData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['DD-MM-YYYY']}</td>
                    <td>${row['time']}</td>
                    <td>${row['data']}</td>
                `;
                detailTableBody.appendChild(tr);
            });

            // สร้างกราฟจากข้อมูลที่กรอง
            createChart(currentData);
        })
        .catch(error => {
            console.error('Error fetching details:', error);
        });
}

function createChart(data) {
    // สร้าง labels สำหรับกราฟ
    const labels = data.map(row => row['time']);
    // ดึงค่าจากคอลัมน์ 'data'
    const values = data.map(row => parseFloat(row['data'])); 

    const ctx = document.getElementById('myChart').getContext('2d'); // ดึง context ของ canvas
    new Chart(ctx, {
        type: 'line', // ประเภทกราฟ
        data: {
            labels: labels,
            datasets: [{
                label: 'Energy Used(kWh)',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                tension : 0.3
            }]
        },
        options: {
            maintainAspectRatio: false, // ไม่บังคับให้รักษาสัดส่วน
            scales: {
                y: {
                    beginAtZero: true // เริ่มที่ 0
                }
            }
        }
    });
}
