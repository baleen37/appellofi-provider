import flask as fl
from flask import Flask
from flask.templating import render_template

app = Flask(__name__, static_folder='static', static_url_path='/static')


@app.route('/')
def main():
    return render_template('index.html')
