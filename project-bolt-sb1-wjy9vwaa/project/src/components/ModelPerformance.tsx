import React from 'react';
import { DoughnutChart } from './charts/DoughnutChart';
import { MetricCard } from './MetricCard';

// Sample metrics for demonstration
const performanceMetrics = {
  accuracy: 0.94,
  precision: 0.92,
  recall: 0.95,
  f1Score: 0.93,
  falsePositives: 0.08,
  falseNegatives: 0.05
};

const ModelPerformance: React.FC = () => {
  const confusionMatrix = {
    truePositives: 47,
    trueNegatives: 48,
    falsePositives: 3,
    falseNegatives: 2
  };
  
  const totalSamples = 
    confusionMatrix.truePositives + 
    confusionMatrix.trueNegatives + 
    confusionMatrix.falsePositives + 
    confusionMatrix.falseNegatives;
  
  const accuracyData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [
          confusionMatrix.truePositives + confusionMatrix.trueNegatives,
          confusionMatrix.falsePositives + confusionMatrix.falseNegatives
        ],
        backgroundColor: ['#10B981', '#F87171'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };
  
  const predictionData = {
    labels: ['True Positives', 'True Negatives', 'False Positives', 'False Negatives'],
    datasets: [
      {
        data: [
          confusionMatrix.truePositives,
          confusionMatrix.trueNegatives,
          confusionMatrix.falsePositives,
          confusionMatrix.falseNegatives
        ],
        backgroundColor: ['#10B981', '#60A5FA', '#F87171', '#FBBF24'],
        borderColor: ['#059669', '#3B82F6', '#DC2626', '#D97706'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <p className="text-gray-600 mb-8">
        Our machine learning model has been trained and tested on a dataset of both legitimate and phishing websites.
        Below are the key performance metrics that demonstrate the effectiveness of our detection system.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <MetricCard 
          title="Accuracy" 
          value={performanceMetrics.accuracy} 
          description="Percentage of correctly identified websites" 
          format="percent"
          icon="check"
          color="green"
        />
        <MetricCard 
          title="Precision" 
          value={performanceMetrics.precision} 
          description="True positives / (True positives + False positives)" 
          format="percent"
          icon="bullseye"
          color="blue"
        />
        <MetricCard 
          title="Recall" 
          value={performanceMetrics.recall} 
          description="True positives / (True positives + False negatives)" 
          format="percent"
          icon="radar"
          color="indigo"
        />
        <MetricCard 
          title="F1 Score" 
          value={performanceMetrics.f1Score} 
          description="Harmonic mean of precision and recall" 
          format="percent"
          icon="star"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Overall Accuracy</h3>
          <div className="h-64">
            <DoughnutChart data={accuracyData} />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            {Math.round(performanceMetrics.accuracy * 100)}% accuracy on {totalSamples} test samples
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Prediction Breakdown</h3>
          <div className="h-64">
            <DoughnutChart data={predictionData} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-700">True Positives: {confusionMatrix.truePositives}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-blue-400 rounded-full mr-2"></span>
              <span className="text-gray-700">True Negatives: {confusionMatrix.trueNegatives}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-red-400 rounded-full mr-2"></span>
              <span className="text-gray-700">False Positives: {confusionMatrix.falsePositives}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-amber-400 rounded-full mr-2"></span>
              <span className="text-gray-700">False Negatives: {confusionMatrix.falseNegatives}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Interpretation</h3>
        <p className="text-blue-700 mb-2">
          Our model achieves high accuracy ({Math.round(performanceMetrics.accuracy * 100)}%) in detecting phishing websites, with a strong balance between precision and recall.
        </p>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>
            <strong>Precision of {Math.round(performanceMetrics.precision * 100)}%</strong> means that when our model flags a website as phishing, it's correct {Math.round(performanceMetrics.precision * 100)}% of the time.
          </li>
          <li>
            <strong>Recall of {Math.round(performanceMetrics.recall * 100)}%</strong> means that our model successfully identifies {Math.round(performanceMetrics.recall * 100)}% of all actual phishing websites.
          </li>
          <li>
            <strong>False positive rate of {Math.round(performanceMetrics.falsePositives * 100)}%</strong> means that only {Math.round(performanceMetrics.falsePositives * 100)}% of legitimate websites are incorrectly flagged as phishing.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModelPerformance;