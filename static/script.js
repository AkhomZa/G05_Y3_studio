document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#deviceTable tbody');
    const deviceForm = document.getElementById('deviceForm');

    // ฟังก์ชันเพิ่มแถวใหม่ในตาราง
    function addRow(deviceNo, location, type) {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${deviceNo}</td>
            <td>${location}</td>
            <td>${type}</td>
            <td>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </td>
        `;

        // เพิ่ม event listener สำหรับปุ่ม Edit และ Delete
        row.querySelector('.editBtn').addEventListener('click', () => editRow(row));
        row.querySelector('.deleteBtn').addEventListener('click', () => deleteRow(row));
    }

    // ฟังก์ชันแก้ไขแถวในตาราง
    function editRow(row) {
        const deviceNo = row.cells[0].textContent;
        const location = row.cells[1].textContent;
        const type = row.cells[2].textContent;

        const newDeviceNo = prompt('Enter new device number:', deviceNo);
        const newLocation = prompt('Enter new location:', location);
        const newType = prompt('Enter new type:', type);

        if (newDeviceNo && newLocation && newType) {
            row.cells[0].textContent = newDeviceNo;
            row.cells[1].textContent = newLocation;
            row.cells[2].textContent = newType;
        }
    }

    // ฟังก์ชันลบแถวในตาราง
    function deleteRow(row) {
        tableBody.removeChild(row);
    }

    // Event listener สำหรับการเพิ่ม device ใหม่
    deviceForm.addEventListener('submit', (e) => {
        e.preventDefault(); // หยุดการส่งฟอร์มแบบปกติ
        const deviceNo = document.getElementById('deviceNo').value;
        const location = document.getElementById('deviceLocation').value;
        const type = document.getElementById('deviceType').value;

        addRow(deviceNo, location, type);

        // ล้างข้อมูลในฟอร์ม
        deviceForm.reset();
    });
});

// ฟังก์ชันบันทึกข้อมูลลง CSV
function saveToCSV() {
    const rows = document.querySelectorAll('#deviceTable tbody tr');
    const devices = [];

    rows.forEach(row => {
        const deviceNo = row.cells[0].textContent;
        const location = row.cells[1].textContent;
        const type = row.cells[2].textContent;
        devices.push({ number: deviceNo, location: location, type: type });
    });

    fetch('/save-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ devices }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // แจ้งผลการบันทึก
    })
    .catch(error => console.error('Error:', error));
}
