# Import dependencies
import pandas as pd
from sqlalchemy import create_engine
from flask import Flask, render_template, jsonify

from config import username, password, hostname, port, db


app = Flask(__name__)


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

if __name__ == "__main__":
    app.run(debug=True)