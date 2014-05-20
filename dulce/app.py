"""
Main Flask application object
"""
from flask import (Flask, abort, request, redirect, Response, make_response,
                   session, url_for)

from flask import render_template
app = Flask(__name__)
app.debug = True

@app.route('/')
def index():
    return render_template('home.html')
