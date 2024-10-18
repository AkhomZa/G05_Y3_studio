// ฟังก์ชันเพื่อแปลงวันที่ปัจจุบันเป็นรูปแบบ 'DD-MM-YYYY'
function getCurrentDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);  // เดือนแบบสองหลัก
    var day = ('0' + today.getDate()).slice(-2);  // วันที่แบบสองหลัก
    return day + '-' + month + '-' + year;
}

// วันที่ปัจจุบันในรูปแบบที่ต้องการ 'DD-MM-YYYY'
var currentDate = getCurrentDate();

// ดึงข้อมูล CSV จาก Python
var csvData = JSON.parse(document.getElementById("csvData").textContent);

// กรองข้อมูล CSV เฉพาะที่มีวันที่ตรงกับวันที่ปัจจุบัน (สมมติว่าคอลัมน์วันที่อยู่ในคอลัมน์แรก index 0)
var filteredData = csvData.slice(1).filter(row => row[0] === currentDate);

// เตรียมข้อมูลสำหรับตาราง
var tableBody = document.getElementById('data-table-body');

// หากมีข้อมูลตรงกับวันที่ปัจจุบัน
if (filteredData.length > 0) {
    filteredData.forEach(function(row) {
        var tr = document.createElement('tr');
        row.forEach(function(cell) {
            var td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// เตรียมข้อมูลสำหรับกราฟ
var labels = filteredData.map(row => row[1]);  // col index 1 is label (time)
var dataValues = filteredData.map(row => parseFloat(row[2]));  // col index 2 is data value

var data = {
    labels: labels,  // show label from col index 1
    datasets: [{
        label: 'Energy Usage (kWh)',  // name of data
        data: dataValues,  // values to show on the graph (col index 2)
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.3  // curve line graph
    }]
};

// การตั้งค่าสำหรับกราฟ
var config = {
    type: 'line',  // ประเภทกราฟ: line หรือ bar หรือ pie
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true  // ทำให้แกน y เริ่มที่ค่า 0
            }
        }
    }
};

// สร้างกราฟ
var myChart = new Chart(
    document.getElementById('myChart'),
    config
);