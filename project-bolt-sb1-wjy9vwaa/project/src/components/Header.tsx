import React from 'react';
import { Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">PhishGuard</h1>
            </div>
          </div>
          
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => setActiveTab('model')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'model'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Model Performance
            </button>
            
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'guide'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Getting Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;