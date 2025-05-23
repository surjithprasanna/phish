import React from 'react';
import { FileCode, Server, Chrome, Database, ArrowRight } from 'lucide-react';

const GettingStarted: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-lg text-gray-600 mb-6">
          PhishGuard consists of three main components: a machine learning model, a Flask API, and a Chrome extension.
          Follow the steps below to set up and use each component.
        </p>
        
        <div className="flex items-center justify-center mb-10">
          <div className="flex flex-col items-center mx-4">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-2">
              <FileCode className="h-8 w-8" />
            </div>
            <div className="text-sm text-center">ML Model</div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="flex flex-col items-center mx-4">
            <div className="w-16 h-16 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mb-2">
              <Server className="h-8 w-8" />
            </div>
            <div className="text-sm text-center">Flask API</div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="flex flex-col items-center mx-4">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full mb-2">
              <Chrome className="h-8 w-8" />
            </div>
            <div className="text-sm text-center">Chrome Extension</div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Setting Up the Model</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <p className="mb-4">
            The model training script is already prepared. You just need to install the required dependencies and run it.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
              <code>
{`# Install required Python packages
pip install pandas numpy scikit-learn xgboost joblib

# Train the model
python model/train_model.py`}
              </code>
            </pre>
          </div>
          
          <p className="text-sm text-gray-600">
            This will create a sample dataset, train the XGBoost model, and save it to the <code>model/saved</code> directory.
          </p>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Starting the Flask API</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <p className="mb-4">
            The Flask API serves the model via a RESTful interface. It has endpoints for prediction and feature importance.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
              <code>
{`# Install required packages
pip install flask flask-cors

# Start the API server
python api/app.py`}
              </code>
            </pre>
          </div>
          
          <p className="text-sm text-gray-600">
            The API will be available at <code>http://localhost:5000</code>. You can test it by visiting this URL in your browser.
          </p>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Installing the Chrome Extension</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <p className="mb-4">
            The Chrome extension provides a user-friendly interface for scanning websites.
          </p>
          
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li>Open Chrome and navigate to <code>chrome://extensions</code></li>
            <li>Enable "Developer mode" by toggling the switch in the top-right corner</li>
            <li>Click "Load unpacked" and select the <code>extension</code> directory</li>
            <li>The PhishGuard extension should now appear in your extensions list</li>
            <li>Click the extension icon in the toolbar to scan the current website</li>
          </ol>
          
          <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Database className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Important Note</h4>
                <p className="text-sm text-amber-700">
                  Make sure the Flask API is running before using the Chrome extension. The extension needs the API to analyze websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Using the Extension</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="mb-4">
            Once installed, using the PhishGuard extension is simple:
          </p>
          
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li>Navigate to any website you want to check</li>
            <li>Click the PhishGuard icon in your browser toolbar</li>
            <li>Click the "Scan Website" button in the popup</li>
            <li>Review the results, which will show whether the site appears legitimate or suspicious</li>
            <li>Click "View Details" to see what specific features contributed to the classification</li>
          </ol>
          
          <p className="text-sm text-gray-600">
            The extension will color-code results: green for safe websites and red for potential phishing attempts.
            It also shows a confidence score to indicate how certain the model is about its prediction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;