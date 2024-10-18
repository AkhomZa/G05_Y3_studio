
## How to open project

1. clone project
2. ติดตั้ง VScode
3. run ไฟล์ python ใน terminal
```
python app.py
```
จะขึ้นใน terminal ดังนี้
```
* Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://***.*.*.*:**** <------ use this
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: -
```

4. กด ctrl+click ที่ลิงค์ โปรแกรมจะพาไปที่ browser
5. แล้วพิมพ์ /device_list ต่อท้ายลงไป
## Format ข้อมูล CSV
- ชื่อไฟล์ : devicexx.csv --> xx คือเลขเครื่อง
- ข้อมูล : row[0] = location , xxxxxxxxxx --> xx คือสถานที่ที่ติดตั้ง
- row[1] = type , xxxxxxx --> xx คือประเภทอุปกรณ์ที่เราวัด
- row[2:] = DD-MM-YYYY,Time,kWh
DD-MM-YYYY = วันที่-เดือน-ปีคศ. , time = xx:xx , kWh = ไฟที่ใช้

ถ้ามีข้อมูลจาก device01 ส่งมาใหม่ อยากให้เพิ่มข้อมูลเฉพาะ DD-MM-YYYY,Time,kWh ต่อท้ายข้อมูลล่าสุด เป็นการ stack ไปเรื่อย

แต่ยังคงข้อมูลของ row[0] และ row[1] ไว้เสมอ

ถ้ามีข้อมูลจาก device ใหม่ ให้ตั้งชื่อว่า devicexx ตามจำนวนของ device ไปเรื่อยๆ

## To-do
- คิดว่าจะเปลี่ยนความถี่เก็บข้อมูลจากทุก 10s -> 1 minute
- ความถี่ส่งข้อมูลเหมือนเดิม 10 minute
- เว็ปไซต์ โชว์ข้อมูลแบบกราฟทุก 10 minute range 1 hour แต่ไม่ต้องโชว์แบบตาราง (ดีไหมนะ)
- จัดการข้อมูลทุก 10 minute ที่รับมา วิเคราะห์ด้วย"วิธีบางอย่าง" เป็นข้อมูลทุก 1 hour เพื่อแสดง(ตอนนี้เว็ปก็แสดงได้ตามนี้แล้ว เหลือแค่การเตรียมข้อมูล)
- เพิ่มหน้าวิเคราะห์โดยรวม? (ยังไม่รู้ต้องแสดงอะไรบ้าง เป็นzone,จากไฟนมากที่สุด,จากประเภทไหนมากที่สุด ex. ปลั๊กไฟ,ไฟส่องสว่าง,แอร์,etc.)
