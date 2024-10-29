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
            for (const [type, total] of Object.entries(data).sort(([, a], [, b]) => b - a)) {
                types.push(type);
                totals.push(total);
            }

            // สร้างกราฟ
            dayRankTypeChart = new Chart(document.getElementById('day_rank_type').getContext('2d'), {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: totals,
                        backgroundColor: ['#FFAB05', '#FF6B45', '#FF2E7E', '#D52DB7', '#6050DC'], // กำหนดสีให้กับแต่ละส่วนของกราฟ
                    }],
                    labels: types
                },
                options: { // เปลี่ยนจาก option เป็น options
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'left' // แสดงป้ายกำกับด้านขวาของกราฟ
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
}

let dayRankFloorChart;
let dayRankFloorLocationChart;

function createDayRankfloorChart() {
    fetch(`/data/day_rank_floor`)
        .then(response => response.json())
        .then(result => {
            const data = result.data;

            const byFloorData = Object.entries(data).reverse().reduce((acc, [key, value]) => {
                const floor = key.split('-')[0];
                if (!acc[floor]) {
                    acc[floor] = 0;
                }
                acc[floor] += value;
                return acc;
            }, {});

            dayRankFloorChart = new Chart(document.getElementById('day_rank_floor').getContext('2d'), {
                type: 'bar',
                data: {
                    datasets: [{
                        label: "Energy used (kWh)",
                        data: Object.values(byFloorData),
                        backgroundColor: "#36A2EB",
                        hoverBackgroundColor : "#F54F52",
                        minBarThickness: 10,
                    }],
                    labels: Object.keys(byFloorData)
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            display: true,
                            ticks: {
                                autoSkip: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                        }
                    },
                    onClick: (event) => {
                        const activePoints = dayRankFloorChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
                        if (activePoints.length) {
                            const firstPoint = activePoints[0];
                            const label = dayRankFloorChart.data.labels[firstPoint.index];
                            createSecondChart(label, data);
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
}

function createSecondChart(label, data) {
    const sortedData = Object.entries(data)
        .map(([floor_location, value]) => {
            const [floor, location] = floor_location.split('-');
            return { floor, location, value };
        })
        .filter(item => item.floor === label)
        .sort((a, b) => a.location.localeCompare(b.location));

    if (dayRankFloorLocationChart) {
        dayRankFloorLocationChart.destroy();
    }

    dayRankFloorLocationChart = new Chart(document.getElementById('day_rank_floor_location').getContext('2d'), {
        type: 'bar',
        data: {
            datasets: [{
                label: "Energy used (kWh)",
                data: sortedData.map(item => item.value),
                backgroundColor: "#36A2EB",
                minBarThickness: 10,
                maxBarThickness: 30,
            }],
            labels: sortedData.map(item => item.location)
        },
        options: {
            scales: {
                x: {
                    display: true,
                    ticks: {
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function() { // run when html finish load
    createDayRankTypeChart(); // create graph
    createDayRankfloorChart();
});