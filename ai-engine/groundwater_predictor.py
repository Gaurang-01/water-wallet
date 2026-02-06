import pandas as pd
import sys
import numpy as np
from sklearn.linear_model import LinearRegression

csv_path = sys.argv[1]
village = sys.argv[2]

# read CSV
df = pd.read_csv(csv_path, encoding="latin1")

# smart matching (case insensitive)
df = df[df["Village"].str.contains(village, case=False, na=False)]

# fallback if village not found
if df.empty:
    print(400)
    exit()

row = df.iloc[0]

years = []
levels = []

# extract yearly pre-monsoon values
for year in range(2015, 2023):
    col = f"Pre-monsoon_{year} (meters below ground level)"

    if col in df.columns:
        val = row[col]

        if not pd.isna(val):
            years.append(year)
            levels.append(val)

years = np.array(years).reshape(-1, 1)
levels = np.array(levels)

# linear regression
model = LinearRegression()
model.fit(years, levels)

# predict next season
next_year = np.array([[2026]])
prediction = model.predict(next_year)[0]

print(round(float(prediction), 2))
