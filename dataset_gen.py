import csv
import random
import datetime
import os
import numpy as np

# วันที่เริ่มต้นย้อนหลังไป 31 วัน
start_date = datetime.date.today() - datetime.timedelta(days=30)  # ใช้ 30 วันเพื่อนับรวมวันนี้
end_date = datetime.date.today()

# สร้างโฟลเดอร์ถ้ายังไม่มี
folder_name = "data"
os.makedirs(folder_name, exist_ok=True)

# ฟังก์ชั่นสำหรับสร้างข้อมูลสุ่ม
def generate_device_data(device_num):
    file_name = os.path.join(folder_name, f"device{device_num:02}.csv")
    with open(file_name, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["floor", f"{random.randint(1, 9):02}"])
        writer.writerow(["location", f"{random.randint(1, 999):03}"])
        writer.writerow(["type", random.choice(["plug", "light", "AC1", "AC2", "AC3", "AC4"])])
        writer.writerow(["DD-MM-YYYY", "time", "data"])
        
        # วนลูปตั้งแต่วันที่เริ่มต้นจนถึงวันนี้
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%d-%m-%Y")
            
            for hour in range(24):  # 24 hours each day
                time_str = (datetime.datetime.combine(current_date, datetime.time()) + datetime.timedelta(hours=hour)).strftime("%H:%M")
                
                # แนวโน้มข้อมูลที่แตกต่างกันในช่วงกลางวันและกลางคืน
                if 6 <= hour <= 18:  # Daytime hours (6 AM to 6 PM)
                    data = round(np.random.normal(loc=3, scale=1), 2)  # ค่าเฉลี่ยสูงช่วงกลางวัน
                else:  # Nighttime hours (6 PM to 6 AM)
                    data = round(np.random.normal(loc=1, scale=1), 2)  # ค่าเฉลี่ยต่ำช่วงกลางคืน
                
                # ตรวจสอบให้ค่าอยู่ในช่วง 0 ถึง 5
                data = min(max(data, 0), 5)
                
                writer.writerow([date_str, time_str, data])
            
            # เลื่อนไปวันที่ถัดไป
            current_date += datetime.timedelta(days=1)

# สร้างไฟล์ device 01 - 10
for device_num in range(1, 11):
    generate_device_data(device_num)

print("Data files created successfully in 'data' folder with data from the past 31 days until today.")
