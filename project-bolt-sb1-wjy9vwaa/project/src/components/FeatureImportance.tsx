import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';

// Sample feature importance data (in a real app, this would come from the API)
const sampleFeatureImportance = [
  { feature: 'has_ip', importance: 0.25, description: 'URL contains an IP address instead of a domain name' },
  { feature: 'domain_age_days', importance: 0.20, description: 'Age of the domain in days' },
  { feature: 'has_form', importance: 0.15, description: 'Website contains forms that could collect sensitive data' },
  { feature: 'suspicious_tld', importance: 0.12, description: 'Domain uses a suspicious top-level domain' },
  { feature: 'has_at', importance: 0.08, description: 'URL contains @ symbol' },
  { feature: 'prefix_suffix', importance: 0.07, description: 'Domain contains hyphens or suspicious prefixes/suffixes' },
  { feature: 'dots_count', importance: 0.05, description: 'Number of dots in the URL' },
  { feature: 'has_https', importance: 0.04, description: 'Website uses secure HTTPS protocol' },
  { feature: 'redirects', importance: 0.02, description: 'URL contains redirect patterns' },
  { feature: 'has_iframe', importance: 0.02, description: 'Website uses iframes that could hide malicious content' },
];

// Nicer display names for features
const featureDisplayNames: Record<string, string> = {
  'has_ip': 'Contains IP Address',
  'domain_age_days': 'Domain Age',
  'has_form': 'Contains Forms',
  'suspicious_tld': 'Suspicious TLD',
  'has_at': 'Contains @ Symbol',
  'prefix_suffix': 'Brand Prefix/Suffix',
  'dots_count': 'Number of Dots',
  'has_https': 'Uses HTTPS',
  'redirects': 'Contains Redirects',
  'has_iframe': 'Contains iFrames',
  'url_length': 'URL Length',
  'domain_length': 'Domain Length',
};

const FeatureImportance: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [data, setData] = useState(sampleFeatureImportance);

  // In a real app, you would fetch this data from the API
  // useEffect(() => {
  //   fetch('http://localhost:5000/feature-importance')
  //     .then(response => response.json())
  //     .then(data => setData(data))
  //     .catch(error => console.error('Error fetching feature importance:', error));
  // }, []);

  // Transform data for display
  const chartData = data.map(item => ({
    ...item,
    displayName: featureDisplayNames[item.feature] || item.feature,
    importance: Number((item.importance * 100).toFixed(1))
  })).sort((a, b) => b.importance - a.importance);

  const getFeatureDescription = (feature: string) => {
    const item = data.find(d => d.feature === feature);
    return item?.description || 'No description available';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(value) => `${value}%`} />
            <YAxis 
              type="category" 
              dataKey="displayName" 
              width={140}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Importance']}
              labelFormatter={(label) => `Feature: ${label}`}
            />
            <Bar 
              dataKey="importance" 
              fill="#3b82f6" 
              onMouseOver={(data) => setActiveFeature(data.feature)}
              onMouseOut={() => setActiveFeature(null)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {activeFeature && (
        <div className="bg-blue-50 p-4 rounded-md flex items-start">
          <HelpCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-700">
              {featureDisplayNames[activeFeature] || activeFeature}
            </h4>
            <p className="text-sm text-blue-600 mt-1">
              {getFeatureDescription(activeFeature)}
            </p>
          </div>
        </div>
      )}
      
      {!activeFeature && (
        <div className="text-sm text-gray-500 italic text-center">
          Hover over bars to see feature descriptions
        </div>
      )}
    </div>
  );
};

export default FeatureImportance;