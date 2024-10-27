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

function sortTable(columnIndex) {
    const table = document.querySelector("table"); // อ้างอิงถึงตาราง
    const rows = Array.from(table.rows).slice(1); // แปลง rows เป็น array โดยข้ามหัวตาราง
    const isAscending = table.getAttribute("data-sort-direction") !== "asc";
    
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText.trim();
        const cellB = rowB.cells[columnIndex].innerText.trim();

        if (!isNaN(cellA) && !isNaN(cellB)) {
            return isAscending ? cellA - cellB : cellB - cellA; // จัดการค่าตัวเลข
        } else {
            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA); // จัดการค่าตัวอักษร
        }
    });

    // นำแถวที่เรียงแล้วใส่กลับเข้าไปในตาราง
    rows.forEach(row => table.appendChild(row));

    // สลับทิศทางการเรียง
    table.setAttribute("data-sort-direction", isAscending ? "asc" : "desc");
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

let dayRankTypeChart;

function createDayRankTypeChart() {
    fetch(`/data/day_rank_type`)
        .then(response => response.json())
        .then(result => { // data format --> "type": type_data, "total_data": total_data
            console.log(result.data);
            const data = result.data;
            const types = [];
            const totals = [];
            for (const [type, total] of Object.entries(data)) {
                types.push(type);
                totals.push(total);
            }

            // สร้างกราฟ
            dayRankTypeChart = new Chart(document.getElementById('day_rank_type').getContext('2d'), {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: totals,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // กำหนดสีให้กับแต่ละส่วนของกราฟ
                    }],
                    labels: types
                },
                options: { // เปลี่ยนจาก option เป็น options
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right' // แสดงป้ายกำกับด้านขวาของกราฟ
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
}

let dayRankZoneChart;

function createDayRankZoneChart() {
    fetch(`/data/day_rank_zone`)
        .then(response => response.json())
        .then(result => { // data format --> "floor" - "location" : zone_total_data
            const data = result.data;

            const floors_location = [];
            const zone_totals = [];
            for (const [floor_location, total] of Object.entries(data)) {
                floors_location.push(floor_location);
                zone_totals.push(total);
            }
            console.log(result.data);

            // สร้างกราฟ
            dayRankZoneChart = new Chart(document.getElementById('day_rank_zone').getContext('2d'), {
                type: 'bar',
                data: {
                    datasets: [{
                        data: zone_totals, // แก้ไขเป็น zone_totals
                        backgroundColor: '#36A2EB', // กำหนดสีให้กับบาร์
                    }],
                    labels: floors_location
                },
                options: { // คุณสามารถตั้งค่า options ได้ที่นี่
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
}

document.addEventListener('DOMContentLoaded', function() { // run when html finish load
    createDayRankTypeChart(); // create graph
    createDayRankZoneChart();
});