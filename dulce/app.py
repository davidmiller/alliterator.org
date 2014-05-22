"""
Main Flask application object
"""
import collections
import functools
import json

from flask import (Flask, abort, request, redirect, Response, make_response,
                   session, url_for)
from flask import render_template
import nltk
nltk.data.path.append('./nltk_data/')

app = Flask(__name__)
app.debug = True

def jsonp(fn):
    @functools.wraps(fn)
    def with_callback_maybe(*args,**kwargs):
        results = fn(*args,**kwargs)
        results = json.dumps(results)
        if  request.args.get('callback', None):
            return '{0}({1})'.format(request.args.get('callback'), results)
        else:
            return Response(results, mimetype='application/json')
    return with_callback_maybe


@app.route('/')
def index():
    return render_template('home.html')

@app.route('/api/1/pos', methods=['POST'])
@jsonp
def pos_tag_post():
    corpus = nltk.word_tokenize(request.json['corpus'].lower())
    tagged = nltk.pos_tag(corpus)
    grouped = collections.defaultdict(list)
    for word, pos in tagged:
        if word not in grouped[pos]:
            grouped[pos].append(word)
    return grouped
