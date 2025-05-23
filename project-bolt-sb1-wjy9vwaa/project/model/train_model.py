#!/usr/bin/env python3
"""
Phishing Website Detection - Model Training Script
Uses XGBoost to train a model for detecting phishing websites based on URL features.
"""

import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import xgboost as xgb
from feature_extraction import extract_features_from_url

# Create data directory if it doesn't exist
os.makedirs('../data', exist_ok=True)

# Sample data creation (in a real scenario, you'd load your dataset)
def create_sample_dataset():
    """Create a sample dataset for demonstration purposes."""
    # In a real implementation, you'd load your dataset from a CSV file
    # This is just for demonstration
    
    legitimate_urls = [
        "https://www.google.com",
        "https://www.amazon.com",
        "https://www.facebook.com",
        "https://www.twitter.com",
        "https://www.microsoft.com",
        "https://www.github.com",
        "https://www.stackoverflow.com",
        "https://www.wikipedia.org",
        "https://www.reddit.com",
        "https://www.netflix.com"
    ]
    
    phishing_urls = [
        "http://googlle.com",
        "https://amaz0n-secure.com",
        "http://faceb00k-login.com",
        "https://twitter-verify.com",
        "http://microsoft-365-verify.com",
        "http://githhub.com",
        "http://stackoverfl0w.com",
        "http://wikipediaa.com",
        "http://redd1t-login.com",
        "http://netflix-subscription.com"
    ]
    
    # Create features for each URL
    legitimate_features = [extract_features_from_url(url) for url in legitimate_urls]
    phishing_features = [extract_features_from_url(url) for url in phishing_urls]
    
    # Create labels
    legitimate_labels = [0] * len(legitimate_urls)  # 0 = legitimate
    phishing_labels = [1] * len(phishing_urls)      # 1 = phishing
    
    # Combine features and labels
    X = legitimate_features + phishing_features
    y = legitimate_labels + phishing_labels
    
    # Create DataFrame
    feature_names = [
        'url_length', 'domain_length', 'has_ip', 'has_at', 'redirects',
        'prefix_suffix', 'dots_count', 'suspicious_tld', 'has_https',
        'domain_age_days', 'has_form', 'has_iframe'
    ]
    
    df = pd.DataFrame(X, columns=feature_names)
    df['label'] = y
    
    # Save to CSV
    df.to_csv('../data/phishing_dataset.csv', index=False)
    
    return df

def train_model(df):
    """Train the XGBoost model and evaluate its performance."""
    # Split features and target
    X = df.drop('label', axis=1)
    y = df['label']
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize and train XGBoost model
    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        min_child_weight=1,
        gamma=0,
        subsample=0.8,
        colsample_bytree=0.8,
        objective='binary:logistic',
        nthread=4,
        seed=42
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Evaluate model
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    # Print metrics
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"Confusion Matrix:\n{cm}")
    
    # Feature importance
    feature_importance = model.feature_importances_
    sorted_idx = np.argsort(feature_importance)
    
    print("\nFeature Importance:")
    for idx in sorted_idx[::-1]:
        print(f"{X.columns[idx]}: {feature_importance[idx]:.4f}")
    
    # Save model
    os.makedirs('../model/saved', exist_ok=True)
    joblib.dump(model, '../model/saved/phishing_model.joblib')
    
    # Save feature importance for visualization
    importance_df = pd.DataFrame({
        'feature': X.columns,
        'importance': feature_importance
    })
    importance_df = importance_df.sort_values('importance', ascending=False)
    importance_df.to_csv('../data/feature_importance.csv', index=False)
    
    return model, importance_df

if __name__ == "__main__":
    print("Phishing Website Detection - Model Training")
    print("------------------------------------------")
    
    # Check if dataset exists, otherwise create a sample one
    dataset_path = '../data/phishing_dataset.csv'
    if os.path.exists(dataset_path):
        print(f"Loading dataset from {dataset_path}")
        df = pd.read_csv(dataset_path)
    else:
        print("Creating sample dataset for demonstration")
        df = create_sample_dataset()
    
    print(f"Dataset shape: {df.shape}")
    print(f"Phishing websites: {df['label'].sum()}")
    print(f"Legitimate websites: {len(df) - df['label'].sum()}")
    
    # Train the model
    model, importance_df = train_model(df)
    
    print("\nModel training completed!")
    print("Model saved to ../model/saved/phishing_model.joblib")