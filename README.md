# Vehicle Safety Recall (Automobile Industry)

Team Members:
Jason Estrada
,Keval Mashru
,Kento Nakajima
,Muthukrishnan Hariram
,Paulin Thakore
,Taylor Chau

# Approach 
    1. Pick/Clean Data - CSV further cleaned with Pandas (removing columns, nulls, unnecessary data)
    2. Used PostgreSQL to create a Schema
    3. Using a combination of PostgreSql & SQLAlchemy to create our database - importing CSV  to SQL
    4. SQLAlchemy and Flask to create our APIs (Connection) - Flask, python app.js, index.html, config.py
    5. Created 5 Visualizations - Using different javascript libraries, D3.js, Plotly.js, Chart.js
        Bar Chart, Pie Chart, Bar Chart (dropdown), Polar Chart, Time Series Chart

# Our dataset (CSV) came from Kaggle.com, which consisted of recalls since 1966. We cleaned the data further and focused on the last 10 years of recalls.

# https://www.kaggle.com/datasets/michaelbryantds/automobile-recalls-dataset (CSV file)

# Our Visualizations/Dashboard

Top 10 Recalls - Affected Vehicle Components - The first function calls the first query, "q1", using D3.js and Plotly.js, fetching data from the q1 API endpoint to create a bar chart.

Recalls by Manufacturer - The second function calls the second query, "q2", using D3.js and Chart.js, fetching data from the q2 API endpoint to create a pie chart.

Top 10 Recalls, Category by Year - The third function calls the third query, "q3", using D3.js. and Plotly.js, fetching data from the q3 API endpoint to populate a 
dropdown menu with unique years and to create a horizontal bar chart based on the selected year from the dropdown menu.

Percentage of Major Components Recalled - The fourth function calls the fourth query, "q4", using D3.js and Chart.js, fetching data from the q4 API endpoint to create a polar chart.

Time Series, Affected Vehicles by Vehicle Components - The fifth function calls the fifth query, "q5", using D3.js and Plotly, fetching data from Q5 API endpoint to create a time series chart.
