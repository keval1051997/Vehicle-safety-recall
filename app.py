# Import dependencies
import pandas as pd
from sqlalchemy import create_engine
from flask import Flask, render_template, jsonify

from config import username, password, hostname, port, db


app = Flask(__name__)

print(username, password, hostname, port, db)
#engine = create_engine('postgresql+psycopg2://postgres:Postgres23@localhost:5432/Project_3_recalls')
engine = create_engine(f'postgresql+psycopg2://{username}:{password}@{hostname}:{port}/{db}')

@app.route("/")
def home():

    return render_template("index.html")

@app.route('/api/v1.0/q1')
def q1():
    conn = engine.connect()
    query = "select component, sum(cast(potentially_affected as float)) as sum_pa \
        from recalls group by component order by sum_pa desc"
    df = pd.read_sql(query, conn)
    # returns a dictionary of lists
    return df.reset_index().to_dict(orient='list')
    #return df.to_json(orient='split')


@app.route('/api/v1.0/q2')
def q2():
    conn = engine.connect()
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
    return df2.reset_index().to_dict(orient='list')
    #return df.to_json(orient='split')

if __name__ == "__main__":
    app.run(debug=True)