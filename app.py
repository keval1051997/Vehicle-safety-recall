# Import dependencies
import pandas as pd
from sqlalchemy import create_engine
from flask import Flask, render_template, jsonify

from config import username, password, hostname, port, db


app = Flask(__name__)

engine = create_engine(f'postgresql+psycopg2://{username}:{password}@{hostname}:{port}/{db}')
conn = engine.connect()

@app.route("/")
def home():

    return render_template("index.html")

@app.route('/api/v1.0/q1')
def q1():
    # Bar chart of total vehicles affected by component category of whole dataset
    query = "select component, sum(cast(potentially_affected as float)) as sum_pa \
        from recalls group by component order by sum_pa desc"
    df = pd.read_sql(query, conn)
    return df.to_dict(orient='list')


@app.route('/api/v1.0/q2')
def q2():
    # Pie chart of select manufacturers in whole dataset
    query2 = "select manufacturer, sum(cast(potentially_affected as float)) as sum_pa \
                from recalls \
                where manufacturer in ('Mercedes-Benz USA, LLC', \
                'BMW of North America, LLC',\
                'Porsche Cars North America, Inc.',\
                'Honda (American Honda Motor Co.)', \
                'Volkswagen Group of America, Inc.') \
                group by manufacturer order by sum_pa desc"
    df2 = pd.read_sql(query2, conn)
    return df2.to_dict(orient='list')

@app.route('/api/v1.0/q3')
def q3():
    # Bar chart with dropdown
    # Sum of recalls (desc) grouped by 'Year' (desc) then 'Component'
    query = "select date_part('Year', report_received_date) as year, component,\
	sum(cast(potentially_affected as float)) as sum_pa from recalls \
    group by year, component order by year desc, sum_pa desc"
    df = pd.read_sql(query, conn)
    return df.to_json(orient='records')

@app.route('/api/v1.0/q4')
def q4():
    # Pie chart for sum of recalls (desc) grouped by 'Component' (excludes 'AIR BAGS')
    query = "select component, sum(cast(potentially_affected as float)) as sum_pa \
        from recalls where component != 'AIR BAGS'\
        group by component order by sum_pa desc LIMIT 7"
    df = pd.read_sql(query, conn)
    return df.to_dict(orient='list')
    
@app.route('/api/v1.0/q5')
def q5():
    # Time series, whole dataset
    query = "select cast(report_received_date as varchar(10)) as date_reported, manufacturer, \
	    component, subject, cast(cast(potentially_affected as float) as int) as affected \
        from recalls order by date_reported asc"
    df = pd.read_sql(query, conn)
    return df.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True)