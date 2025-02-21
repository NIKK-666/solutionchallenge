from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load('career_model.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get user inputs from the form
    inputs = [
        int(request.form['problem_solving']),
        int(request.form['decision_making']),
        int(request.form['work_environment']),
        int(request.form['stress_response']),
        int(request.form['communication']),
        int(request.form['logical_reasoning']),
        int(request.form['spatial_awareness']),
        int(request.form['emotional_intelligence'])
    ]

    # Convert inputs to a numpy array and reshape for prediction
    inputs = np.array(inputs).reshape(1, -1)

    # Predict the career field
    prediction = model.predict(inputs)[0]

    # Map prediction to career field
    career_fields = {
        0: 'Science/Research',
        1: 'Engineering',
        2: 'Healthcare',
        3: 'Law',
        4: 'Business',
        5: 'Education'
    }
    career = career_fields.get(prediction, 'Unknown')

    return render_template('result.html', career=career)

if __name__ == '__main__':
    app.run(debug=True)