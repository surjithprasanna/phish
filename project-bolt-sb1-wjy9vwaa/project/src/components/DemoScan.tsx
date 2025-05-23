import React, { useState } from 'react';
import { Search, Check, AlertTriangle, Loader2 } from 'lucide-react';

const DemoScan: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | { result: string; confidence: number }>(null);
  const [error, setError] = useState('');

  const handleScan = () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Demo logic - consider some URLs as phishing for demonstration
      const lowerUrl = url.toLowerCase();
      const isPotentialPhishing = 
        lowerUrl.includes('secure') && lowerUrl.includes('login') ||
        lowerUrl.includes('verify') && lowerUrl.includes('account') ||
        lowerUrl.includes('paypal') && !lowerUrl.includes('paypal.com') ||
        lowerUrl.includes('bank') && !lowerUrl.includes('bank.com');
      
      const randomConfidence = isPotentialPhishing 
        ? 0.7 + Math.random() * 0.25  // 70-95% confidence for phishing
        : 0.8 + Math.random() * 0.19; // 80-99% confidence for legitimate
      
      setResult({
        result: isPotentialPhishing ? 'phishing' : 'legitimate',
        confidence: randomConfidence
      });
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Try It Out</h2>
      <p className="text-gray-600 mb-6">
        Enter a URL below to see how our phishing detection works.
        This is a demo version that simulates the behavior of our API.
      </p>
      
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL (e.g., https://example.com)"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleScan}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md flex items-center justify-center transition-colors disabled:bg-blue-400"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Scan
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {result && (
        <div className={`p-6 rounded-md ${
          result.result === 'legitimate' 
            ? 'bg-green-50 border border-green-100' 
            : 'bg-red-50 border border-red-100'
        }`}>
          <div className="flex items-start">
            <div className={`p-2 rounded-full ${
              result.result === 'legitimate' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.result === 'legitimate' ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
            
            <div className="ml-4">
              <h3 className="text-lg font-semibold">
                {result.result === 'legitimate' ? 'Website appears safe' : 'Potential phishing detected'}
              </h3>
              
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium mr-2">Confidence:</span>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.result === 'legitimate' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
              
              <p className="mt-2 text-sm">
                {result.result === 'legitimate' 
                  ? 'This website appears to be legitimate based on our analysis.'
                  : 'This website shows characteristics commonly associated with phishing attempts. Be cautious!'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoScan;