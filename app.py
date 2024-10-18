from flask import Flask, render_template, jsonify
import os
import csv

app = Flask(__name__)

DEVICE_FOLDER = 'data'

@app.route('/device_list')
def list_device():
    # ค้นหาไฟล์ CSV ในโฟลเดอร์
    device_files = [f for f in os.listdir(DEVICE_FOLDER) if f.startswith('device') and f.endswith('.csv')]

    # ส่งข้อมูลทั้งชื่อไฟล์เต็มและชื่อที่ตัดนามสกุลไปยัง template
    indexed_device_files = [(index, f, f.rsplit('.', 1)[0]) for index, f in enumerate(device_files, start=1)]
    
    # ส่งข้อมูลไปยัง template
    return render_template('device_list.html', device_files=indexed_device_files)


@app.route('/device/<filename>')
def device_detail(filename):
    file_path = os.path.join(DEVICE_FOLDER, filename)

    # ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if os.path.exists(file_path):
        # อ่านไฟล์ CSV
        with open(file_path, newline='') as csvfile:
            reader = csv.reader(csvfile)
            csv_data = [row for row in reader]  # เก็บข้อมูลในรูปแบบ list

        # ตัดนามสกุลไฟล์ออกจากชื่อไฟล์
        display_name = filename.rsplit('.', 1)[0]

        # ส่งข้อมูล CSV และ display_name ไปยัง template
        return render_template('device_detail.html', filename=display_name, csv_data=csv_data)
    else:
        return f"File {filename} not found.", 404


@app.route('/device_list')
def device_list():
    # แสดงหน้ารายการอุปกรณ์
    return render_template('device_list.html')


if __name__ == '__main__':
    app.run(debug=True)
