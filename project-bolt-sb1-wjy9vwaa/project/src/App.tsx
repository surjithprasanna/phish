import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import FeatureImportance from './components/FeatureImportance';
import DemoScan from './components/DemoScan';
import Header from './components/Header';
import Footer from './components/Footer';
import GettingStarted from './components/GettingStarted';
import ModelPerformance from './components/ModelPerformance';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Phishing Website Detection System</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                An advanced machine learning system that helps protect users from phishing attacks by analyzing URLs and website content in real-time.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4 inline-flex items-center justify-center p-2 bg-green-100 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">ML-Powered Detection</h2>
                <p className="text-gray-600">
                  Our XGBoost model analyzes multiple features of URLs and websites to identify phishing attempts with high accuracy.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4 inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Real-Time Analysis</h2>
                <p className="text-gray-600">
                  Get instant feedback on websites you visit with our Chrome extension, powered by a fast Flask API backend.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4 inline-flex items-center justify-center p-2 bg-amber-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Advanced Features</h2>
                <p className="text-gray-600">
                  Analyzes URL patterns, domain information, and page content to provide comprehensive protection against sophisticated attacks.
                </p>
              </div>
            </div>
            
            <DemoScan />
          </div>
        )}
        
        {activeTab === 'model' && (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Model Performance</h1>
            <ModelPerformance />
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Importance</h2>
              <p className="text-gray-600 mb-6">
                Our model uses various features extracted from URLs and website content to identify phishing attempts.
                The chart below shows the relative importance of each feature in the prediction process.
              </p>
              <FeatureImportance />
            </div>
          </div>
        )}
        
        {activeTab === 'guide' && (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Getting Started</h1>
            <GettingStarted />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;