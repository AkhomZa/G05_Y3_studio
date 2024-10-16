from flask import Flask, request, jsonify, render_template
import os

# Create the 'data' directory if it doesn't exist
data_directory = 'K:/G05_Y3_studio/data/devices.csv'
if not os.path.exists(data_directory):
    os.makedirs(data_directory)


app = Flask(__name__)

# เส้นทางหลักสำหรับหน้า HTML
@app.route('/')
def index():
    return render_template('index.html')

# เส้นทาง API สำหรับบันทึก CSV
@app.route('/save-csv', methods=['POST'])
def save_csv():
    data = request.json  # รับข้อมูล JSON จากไคลเอนต์
    devices = data.get('devices', [])

    # เขียนข้อมูลลงในไฟล์ CSV
    csv_file = 'K:/G05_Y3_studio/data/devices.csv'
    csv_columns = ['Device No.', 'Location', 'Type']

    try:
        with open(csv_file, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=csv_columns)
            writer.writeheader()  # เขียน header ของ CSV

            for device in devices:
                writer.writerow({
                    'Device No.': device['number'],
                    'Location': device['location'],
                    'Type': device['type']
                })

        return jsonify({"message": "CSV saved successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)


csv_file = os.path.join(data_directory, 'devices.csv')
