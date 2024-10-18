from flask import Flask, render_template, jsonify
import os
import csv

app = Flask(__name__)

DEVICE_FOLDER = 'data'

@app.route('/device_list')
def list_device():
    # ค้นหาไฟล์ CSV ในโฟลเดอร์
    device_files = [f for f in os.listdir(DEVICE_FOLDER) if f.startswith('device') and f.endswith('.csv')]

    device_data = []
    
    # สำหรับแต่ละไฟล์ในโฟลเดอร์ อ่านข้อมูล CSV และดึง Location และ Type
    for index, filename in enumerate(device_files, start=1):
        file_path = os.path.join(DEVICE_FOLDER, filename)
        with open(file_path, newline='') as csvfile:
            reader = csv.reader(csvfile)
            csv_data = [row for row in reader]  # อ่านข้อมูลทั้งหมดจากไฟล์ CSV

            # ดึงข้อมูลจากแถวที่ต้องการ
            location = csv_data[0][1] if len(csv_data) > 0 and len(csv_data[0]) > 1 else "Unknown"
            device_type = csv_data[1][1] if len(csv_data) > 1 and len(csv_data[1]) > 1 else "Unknown"
            
            # เก็บข้อมูลในรูปแบบที่ส่งไปยัง template
            device_data.append({
                'index': index,
                'full_filename': filename,
                'display_name': filename.rsplit('.', 1)[0],  # ตัดนามสกุลออก
                'location': location,
                'type': device_type
            })

    # ส่งข้อมูลไปยัง template
    return render_template('device_list.html', device_files=device_data)


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


if __name__ == '__main__':
    app.run(debug=True)
