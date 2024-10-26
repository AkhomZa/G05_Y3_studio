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

let detailChart; // ตัวแปรสำหรับเก็บอ้างอิงกราฟ

function viewDetails(filename) {
    // เปลี่ยนไปที่แท็บ "Detail"
    openTab(event, 'device_detail');

    document.getElementById('fileNameText').textContent = filename;

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
            const currentData = data.filter(row => row['DD-MM-YYYY'] === formattedCurrentDate);
            
            // ถ้าไม่มีข้อมูล
            if (currentData.length === 0) {
                console.log('No data found for today.'); // เพิ่มบรรทัดนี้เพื่อตรวจสอบว่ามีข้อมูลหรือไม่
                
                // แสดงข้อความว่าไม่มีข้อมูล
                const tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="3">No data available for today.</td>`; // แสดงในตารางว่าไม่มีข้อมูล
                detailTableBody.appendChild(tr); // add to table

                // เคลียร์กราฟเดิม
                if (detailChart) {
                    detailChart.destroy(); // ทำลายกราฟเดิม
                }

                // สร้างกราฟเปล่า
                detailChart = new Chart(document.getElementById('datailChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Device Data',
                            data: [],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1,
                            tension: 0.4 // เพิ่มความโค้งให้กับกราฟ
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } else {
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
                // ถ้ามีกราฟอยู่แล้วให้เคลียร์ก่อน
                if (detailChart) {
                    detailChart.destroy(); // ทำลายกราฟเดิม
                }

                // สร้าง labels สำหรับกราฟ
                const labels = currentData.map(row => row['time']);
                const values = currentData.map(row => parseFloat(row['data']));

                // สร้างกราฟใหม่
                const ctx = document.getElementById('datailChart').getContext('2d');
                detailChart = new Chart(ctx, {
                    type: 'line', // ประเภทกราฟ
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Device Data',
                            data: values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1,
                            tension: 0.4 // เพิ่มความโค้งให้กับกราฟ
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
        })
        .catch(error => {
            console.error('Error fetching details:', error);
        });
}


// function chart_day_rank_type(time) {
//     fetch('/data')  // ดึงข้อมูลจาก API
//     .then(response => response.json())
//     .then(data => {
//         // แยกประเภทและรวมข้อมูล
//         const labels = data.map(item => item.type);
//         const values = data.map(item => item.total_data);

//         const pieData = {
//             labels: labels,
//             datasets: [{
//                 label: 'Device Types',
//                 data: values,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(255, 206, 86, 0.2)',
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)'
//                 ],
//                 borderWidth: 1
//             }]
//         };

//         const config = {
//             type: 'pie',
//             data: pieData,
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Device Type Distribution'
//                     }
//                 }
//             }
//         };

//         // สร้าง Pie Chart
//         const myPieChart = new Chart(
//             document.getElementById('day_rank_type'),
//             config
//         );
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });
// }
