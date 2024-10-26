from flask import Flask, render_template, jsonify
import os
import csv

app = Flask(__name__)

# Route สำหรับหน้าแรก
@app.route('/')
def index():
    # อ่านไฟล์ CSV จากโฟลเดอร์ 'data'
    device_files = []
    for filename in os.listdir('data'): #อ่านทุกไฟล์ใน folder "data"
        if filename.startswith('device') and filename.endswith('.csv'): #ไม่ใช้ & เพราะเป็นตัวดำเนินการทางบิต (bitwise operation)
            file_path = os.path.join('data', filename) #สร้างไฟล์ path โดยเติม /data เข้าไปด้านหน้าเป็น /data/filename.csv
            
            # อ่านข้อมูลจากไฟล์ CSV
            with open(file_path, mode='r', newline='', encoding='utf-8') as file:
                reader = csv.reader(file)
                
                # อ่าน metadata และข้อมูลหลัก
                metadata = {}
                for row in reader:
                    if len(metadata) < 3:  # อ่านแค่ 3 แถวแรก
                        metadata[row[0]] = row[1]
                        if row[0] == 'DD-MM-YYYY':  # หยุดอ่านเมื่อเจอหัวเรื่อง
                            break

                
                # สร้างข้อมูลอุปกรณ์โดยดึงจาก metadata ที่อ่านได้
                device_info = {
                    'index': len(device_files) + 1,
                    'display_name': filename.replace('.csv', ''), #แสดงชื่อโดยไม่แสดงนามสกุล
                    'floor': metadata.get('floor', ''),
                    'location': metadata.get('location', ''),
                    'type': metadata.get('type', ''),
                    'full_filename': filename
                }
                
                device_files.append(device_info)

    return render_template('index.html', device_files=device_files)


# Route สำหรับโหลดข้อมูลรายละเอียด
@app.route('/detail/<filename>') #รอ script.js เรียกผ่าน URL
def detail(filename):
    file_path = os.path.join('data', filename) #สร้าง path โดยเติม /data/<filename>.csv
    if os.path.exists(file_path):
        details = [] #สำหรับส่งคำตอบ
        try:
            with open(file_path, mode='r', newline='', encoding='utf-8') as file:
                reader = csv.reader(file)
                
                # ข้ามแถว metadata ส่วนบนสุด
                for row in reader: #อ่านเรียงเป็นแถวแนวนอน
                    if row and row[0] == 'DD-MM-YYYY':  # หาแถวที่เริ่มมีหัวเรื่อง
                        headers = row  # เก็บหัวเรื่องจากแถวนี้
                        break
                
                # อ่านข้อมูลหลักจากแถวที่มีหัวเรื่องและหลังจากนั้น
                reader = csv.DictReader(file, fieldnames=headers) #header --> (DD-MM-YYYY,time,data)
                for row in reader:
                    details.append(row)
                    
            return jsonify(details)
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            return jsonify([])  # คืนค่าข้อมูลว่างถ้าเกิดข้อผิดพลาด
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
