// Global variables
let currentURL = '';
let currentFeatures = null;
const API_URL = 'http://localhost:5000';

// DOM Elements
const scanBtn = document.getElementById('scan-btn');
const detailsBtn = document.getElementById('details-btn');
const backBtn = document.getElementById('back-btn');
const backFromDetailsBtn = document.getElementById('back-from-details-btn');
const errorBackBtn = document.getElementById('error-back-btn');

const initialView = document.getElementById('initial-view');
const loadingView = document.getElementById('loading-view');
const resultView = document.getElementById('result-view');
const detailsView = document.getElementById('details-view');
const errorView = document.getElementById('error-view');

const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultScore = document.getElementById('result-score');
const resultMessage = document.getElementById('result-message');
const featuresList = document.getElementById('features-list');
const errorMessage = document.getElementById('error-message');

// Helper functions
function showView(view) {
  // Hide all views
  initialView.classList.add('hidden');
  loadingView.classList.add('hidden');
  resultView.classList.add('hidden');
  detailsView.classList.add('hidden');
  errorView.classList.add('hidden');
  
  // Show the requested view
  view.classList.remove('hidden');
  view.classList.add('fade-in');
}

// Feature description map for better UI display
const featureDescriptions = {
  'url_length': {
    name: 'URL Length',
    description: 'Length of the URL',
    threshold: 75,
    highRisk: true
  },
  'domain_length': {
    name: 'Domain Length',
    description: 'Length of the domain name',
    threshold: 30,
    highRisk: true
  },
  'has_ip': {
    name: 'Contains IP Address',
    description: 'URL contains an IP address instead of domain name',
    threshold: 0.5,
    highRisk: true
  },
  'has_at': {
    name: 'Contains @ Symbol',
    description: 'URL contains @ symbol',
    threshold: 0.5,
    highRisk: true
  },
  'redirects': {
    name: 'Contains Redirects',
    description: 'URL contains redirect strings',
    threshold: 0.5,
    highRisk: true
  },
  'prefix_suffix': {
    name: 'Brand Name Misuse',
    description: 'Domain contains brand name with suspicious prefix/suffix',
    threshold: 0.5,
    highRisk: true
  },
  'dots_count': {
    name: 'Number of Dots',
    description: 'Number of dots in the URL',
    threshold: 3,
    highRisk: true
  },
  'suspicious_tld': {
    name: 'Suspicious TLD',
    description: 'Domain uses suspicious top-level domain',
    threshold: 0.5,
    highRisk: true
  },
  'has_https': {
    name: 'Uses HTTPS',
    description: 'Website uses secure HTTPS protocol',
    threshold: 0.5,
    highRisk: false
  },
  'domain_age_days': {
    name: 'Domain Age',
    description: 'Age of the domain in days',
    threshold: 90,
    highRisk: false
  },
  'has_form': {
    name: 'Contains Forms',
    description: 'Website contains forms to collect data',
    threshold: 0.5,
    highRisk: true
  },
  'has_iframe': {
    name: 'Contains iFrames',
    description: 'Website uses iframes',
    threshold: 0.5,
    highRisk: true
  }
};

// Function to get feature display class
function getFeatureRiskClass(feature, value) {
  const featureInfo = featureDescriptions[feature];
  
  if (!featureInfo) return '';
  
  if (featureInfo.highRisk) {
    // For high-risk features, higher values are worse
    if (value > featureInfo.threshold) return 'high';
    if (value > featureInfo.threshold * 0.7) return 'medium';
    return 'low';
  } else {
    // For low-risk features, lower values are worse
    if (value < featureInfo.threshold) return 'high';
    if (value < featureInfo.threshold * 1.5) return 'medium';
    return 'low';
  }
}

// Function to display features in the details view
function displayFeatures(features) {
  featuresList.innerHTML = '';
  
  Object.entries(features).forEach(([feature, value]) => {
    const featureInfo = featureDescriptions[feature] || { name: feature };
    const riskClass = getFeatureRiskClass(feature, value);
    
    const featureItem = document.createElement('div');
    featureItem.className = 'feature-item';
    
    const nameElement = document.createElement('div');
    nameElement.className = 'feature-name';
    nameElement.title = featureInfo.description || '';
    nameElement.textContent = featureInfo.name || feature;
    
    const valueElement = document.createElement('div');
    valueElement.className = `feature-value ${riskClass}`;
    valueElement.textContent = value;
    
    featureItem.appendChild(nameElement);
    featureItem.appendChild(valueElement);
    featuresList.appendChild(featureItem);
  });
}

// Function to scan a website
async function scanWebsite(url) {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to scan website: ${error.message}`);
  }
}

// Function to display result
function displayResult(result) {
  // Store features for details view
  currentFeatures = result.features;
  
  // Set icon and title based on result
  if (result.result === 'legitimate') {
    resultIcon.className = 'result-icon safe';
    resultIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    `;
    resultTitle.textContent = 'Website is Safe';
    resultMessage.textContent = 'This website appears to be legitimate.';
  } else {
    resultIcon.className = 'result-icon danger';
    resultIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
      </svg>
    `;
    resultTitle.textContent = 'Phishing Detected';
    resultMessage.textContent = 'This website shows signs of being a phishing attempt. Be careful!';
  }
  
  // Set confidence score
  const scoreElement = document.querySelector('.score-value');
  scoreElement.textContent = `${Math.round(result.confidence * 100)}%`;
  
  // Show result view
  showView(resultView);
}

// Event Listeners
scanBtn.addEventListener('click', async () => {
  // Show loading view
  showView(loadingView);
  
  // Get the current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
      currentURL = tabs[0].url;
      
      // Call the API to scan the website
      const result = await scanWebsite(currentURL);
      
      // Display the result
      displayResult(result);
    } catch (error) {
      // Show error view
      errorMessage.textContent = error.message;
      showView(errorView);
    }
  });
});

detailsBtn.addEventListener('click', () => {
  if (currentFeatures) {
    displayFeatures(currentFeatures);
    showView(detailsView);
  }
});

backBtn.addEventListener('click', () => {
  showView(initialView);
});

backFromDetailsBtn.addEventListener('click', () => {
  showView(resultView);
});

errorBackBtn.addEventListener('click', () => {
  showView(initialView);
});

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  showView(initialView);
});