from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Load the model
model = joblib.load('spa_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([data['features']])
    prediction = model.predict(features)
    return jsonify({'prediction': float(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)