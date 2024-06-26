
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model and scaler
model = joblib.load('spa_model.pkl')
scaler = joblib.load('scaler.pkl')

# Define the column order
column_order = [
    'gender', 'reading score', 'writing score', 
    "associate's degree", "bachelor's degree", 'high school', 'master\'s degree',
    'free/reduced', 'standard'
]

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    print("Received data:", data)
    for col in column_order:
        if col not in data:
            return jsonify({'error': f'Missing column: {col}'}), 400
    try:
        features = [data[col] for col in column_order]
    except KeyError as e:
        return jsonify({'error': f'Missing key in data: {str(e)}'}), 400
    
    features = np.array([features])
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    return jsonify({'prediction': float(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
