# Import necessary libraries
import SMOTE as SMOTE
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from scipy import stats

# Load dataset
df = pd.read_csv("career_model.csv")  # Replace with your CSV file

# Display basic info
print("Dataset Overview:\n", df.head())

# Handle missing values
df.fillna(df.mean(), inplace=True)  # Fill missing numeric values with mean

# Convert categorical to numerical (if any)
for col in df.select_dtypes(include=['object']).columns:
    df[col] = LabelEncoder().fit_transform(df[col])

# Remove outliers using Z-score method
df = df[(np.abs(stats.zscore(df)) < 3).all(axis=1)]

# Define features and target variable
X = df.drop("Target", axis=1)  # Replace "Target" with your actual target column
y = df["Target"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Handle imbalanced data using SMOTE
smote = SMOTE()
X_train, y_train = smote.fit_resample(X_train, y_train)

# Feature scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Hyperparameter tuning for RandomForest
params = {"n_estimators": [50, 100, 200], "max_depth": [5, 10, None]}
grid_search = GridSearchCV(RandomForestClassifier(), params, cv=5, scoring="accuracy")
grid_search.fit(X_train, y_train)

# Best model from GridSearch
best_rf_model = grid_search.best_estimator_

# Train ensemble model (RandomForest + Logistic Regression)
from sklearn.linear_model import LogisticRegression
ensemble_model = VotingClassifier(
    estimators=[("rf", best_rf_model), ("lr", LogisticRegression())], voting="soft"
)
ensemble_model.fit(X_train, y_train)

# Predictions
y_pred = ensemble_model.predict(X_test)

# Evaluate model
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save model for future use
joblib.dump(ensemble_model, "trained_model.pkl")
