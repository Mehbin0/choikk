from flask import Flask, jsonify
import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify(message="Hello from Choikk backend!")

@app.route('/status')
def status():
    now = datetime.datetime.now()
    return jsonify(
        status="OK",
        timestamp=now.strftime("%Y-%m-%d %H:%M:%S"),
        message="Choikk backend is running smoothly!"
    )

if __name__ == '__main__':
    app.run(debug=True)
