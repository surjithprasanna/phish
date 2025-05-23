#!/usr/bin/env python3
"""
Phishing Website Detection - Flask API
Serves the machine learning model through a RESTful API.
"""

import os
import sys
import json
import pandas as pd
import joblib
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# Add the parent directory to the path to import from model directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model.feature_extraction import extract_features_dict

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)  # Enable CORS for all routes

# Load the trained model
model_path = '../model/saved/phishing_model.joblib'
if not os.path.exists(model_path):
    print("Error: Model file not found. Please train the model first.")
    print("Run: python model/train_model.py")
    sys.exit(1)

model = joblib.load(model_path)
print(f"Model loaded from {model_path}")

# Load feature importance if available
feature_importance = None
importance_path = '../data/feature_importance.csv'
if os.path.exists(importance_path):
    feature_importance = pd.read_csv(importance_path)
    print(f"Feature importance loaded from {importance_path}")

@app.route('/')
def home():
    """Render the API documentation page."""
    has_importance = feature_importance is not None
    return render_template('index.html', has_importance=has_importance)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict if a URL is a phishing website.
    
    Request JSON format:
    {
        "url": "https://example.com"
    }
    
    Response JSON format:
    {
        "result": "phishing" or "legitimate",
        "confidence": 0.92,
        "features": {
            "feature1": value1,
            "feature2": value2,
            ...
        }
    }
    """
    try:
        # Get URL from request
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': 'Missing URL parameter',
                'example': {
                    'url': 'https://example.com'
                }
            }), 400
        
        url = data['url']
        
        # Extract features
        features_dict = extract_features_dict(url)
        
        # Convert to DataFrame for prediction
        features_df = pd.DataFrame([features_dict])
        
        # Make prediction
        prediction = model.predict(features_df)[0]
        prediction_proba = model.predict_proba(features_df)[0]
        
        # Get confidence score
        confidence = prediction_proba[1] if prediction == 1 else prediction_proba[0]
        
        # Prepare response
        result = "phishing" if prediction == 1 else "legitimate"
        
        response = {
            'result': result,
            'confidence': round(float(confidence), 4),
            'features': features_dict
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'An error occurred during prediction'
        }), 500

@app.route('/feature-importance', methods=['GET'])
def get_feature_importance():
    """Return the feature importance data for visualization."""
    if feature_importance is not None:
        return jsonify(feature_importance.to_dict(orient='records'))
    else:
        return jsonify({
            'error': 'Feature importance data not available',
            'message': 'Train the model first to generate feature importance data'
        }), 404

if __name__ == '__main__':
    # Create the templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    # Create a simple HTML template for the API documentation
    with open('templates/index.html', 'w') as f:
        f.write("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phishing Website Detection API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        h2 {
            color: #4b5563;
            margin-top: 30px;
        }
        code {
            background-color: #f1f5f9;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
        }
        pre {
            background-color: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
        }
        .endpoint {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            background-color: #3b82f6;
            color: white;
            border-radius: 4px;
            margin-right: 10px;
        }
        .url {
            font-weight: bold;
            color: #4b5563;
        }
        .feature-importance {
            margin-top: 30px;
        }
        #importanceChart {
            margin-top: 20px;
            height: 300px;
        }
    </style>
</head>
<body>
    <h1>Phishing Website Detection API</h1>
    <p>
        This API provides endpoints to detect phishing websites using machine learning.
        It uses an XGBoost model trained on various URL and website features.
    </p>

    <h2>Endpoints</h2>
    
    <div class="endpoint">
        <div>
            <span class="method">POST</span>
            <span class="url">/predict</span>
        </div>
        <p>Predicts whether a URL is a phishing website or legitimate.</p>
        <h3>Request</h3>
        <pre><code>{
    "url": "https://example.com"
}</code></pre>
        <h3>Response</h3>
        <pre><code>{
    "result": "legitimate",
    "confidence": 0.92,
    "features": {
        "url_length": 22,
        "domain_length": 11,
        "has_ip": 0,
        ...
    }
}</code></pre>
    </div>

    <div class="endpoint">
        <div>
            <span class="method">GET</span>
            <span class="url">/feature-importance</span>
        </div>
        <p>Returns the importance of each feature used in the model.</p>
        <h3>Response</h3>
        <pre><code>[
    {
        "feature": "has_ip",
        "importance": 0.35
    },
    {
        "feature": "domain_age_days",
        "importance": 0.25
    },
    ...
]</code></pre>
    </div>

    {% if has_importance %}
    <div class="feature-importance">
        <h2>Feature Importance Visualization</h2>
        <div id="importanceChart"></div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Fetch feature importance data and create chart
        fetch('/feature-importance')
            .then(response => response.json())
            .then(data => {
                // Extract features and importance values
                const features = data.map(item => item.feature);
                const importanceValues = data.map(item => item.importance);
                
                // Create chart
                const ctx = document.getElementById('importanceChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: features,
                        datasets: [{
                            label: 'Feature Importance',
                            data: importanceValues,
                            backgroundColor: '#3b82f6',
                            borderColor: '#2563eb',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Importance Score'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Feature'
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching feature importance:', error));
    </script>
    {% endif %}
</body>
</html>
        """)
    
    print("Starting Phishing Website Detection API...")
    print("API documentation available at http://127.0.0.1:5000/")
    print("Press Ctrl+C to stop the server")
    
    # Start the Flask server
    app.run(host='0.0.0.0', port=5000, debug=True)