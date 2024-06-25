import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import joblib

# Load dataset
df = pd.read_csv('exams.csv')

# Preprocessing 
df = df.join(pd.get_dummies(df['parental level of education'])).drop(['parental level of education'], axis=1)
df = df.join(pd.get_dummies(df['lunch'])).drop(['lunch'], axis=1)

df['gender'] = df['gender'].apply(lambda x: 1 if x == 'male' else 0)

df = df.drop('race/ethnicity', axis=1)
df = df.drop('test preparation course', axis=1)

df = df.drop('some high school', axis=1)
df = df.drop('some college', axis=1)

# Set Target Data
X = df.drop(['math score'], axis=1)
y = df['math score']

# Normalize Data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Create DataFrame for X_train and X_test
X_train_df = pd.DataFrame(X_train, columns=X.columns)
X_test_df = pd.DataFrame(X_test, columns=X.columns)

# Apply scaling to 'reading score' and 'writing score' only
scaler = StandardScaler()
X_train_scaled_scores = scaler.fit_transform(X_train_df[['reading score', 'writing score']])
X_test_scaled_scores = scaler.transform(X_test_df[['reading score', 'writing score']])

# Concatenate scaled scores with the rest of the features
X_train_scaled = pd.concat([pd.DataFrame(X_train_scaled_scores, columns=['reading score', 'writing score']), X_train_df.reset_index(drop=True).drop(['reading score', 'writing score'], axis=1)], axis=1)
X_test_scaled = pd.concat([pd.DataFrame(X_test_scaled_scores, columns=['reading score', 'writing score']), X_test_df.reset_index(drop=True).drop(['reading score', 'writing score'], axis=1)], axis=1)

# Model
regr = LinearRegression()

# Train Model
regr.fit(X_train_scaled, y_train)

# Save the model
joblib.dump(regr, 'spa_model.pkl')
