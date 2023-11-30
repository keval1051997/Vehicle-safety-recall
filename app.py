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
    query = "select component, sum(cast(potentially_affected as float)) as sum_pa \
        from recalls group by component order by sum_pa desc"
    df = pd.read_sql(query, conn)
    # returns a dictionary of lists
    return df.to_dict(orient='list')
    #return df.to_json(orient='split')


@app.route('/api/v1.0/q2')
def q2():
    query2 = "select manufacturer, sum(cast(potentially_affected as float)) as sum_pa \
                from recalls \
                where manufacturer in ('Mercedes-Benz USA, LLC', \
                'BMW of North America, LLC',\
                'Porsche Cars North America, Inc.',\
                'Honda (American Honda Motor Co.)', \
                'Volkswagen Group of America, Inc.') \
                group by manufacturer order by sum_pa desc"
    df2 = pd.read_sql(query2, conn)
    # returns a dictionary of lists
    return df2.to_dict(orient='list')
    #return df.to_json(orient='split')

@app.route('/api/v1.0/q3')
def q3():
    # Sum of recalls (desc) grouped by 'Year' (desc) then 'Component'
    query = "select date_part('Year', report_received_date) as year, component,\
	sum(cast(potentially_affected as float)) as sum_pa from recalls \
    group by year, component order by year desc, sum_pa desc"
    df = pd.read_sql(query, conn)
    # returns a dictionary of lists
    #return df.to_dict(orient='list')
    return df.to_json(orient='records')

@app.route('/api/v1.0/q4')
def q4():
    # Sum of recalls (desc) grouped by 'Year' (desc) then 'Component'
    # query = "select count(manufacturer) as num_manufacturers,recall_type \
    # from recalls where recall_type != 'Vehicle' group by recall_type"
    query = "select component, sum(cast(potentially_affected as float)) as sum_pa \
from recalls where component != 'AIR BAGS'\
group by component order by sum_pa desc LIMIT 7"
    df = pd.read_sql(query, conn)
    # returns a dictionary of lists
    return df.to_dict(orient='list')
    

if __name__ == "__main__":
    app.run(debug=True)