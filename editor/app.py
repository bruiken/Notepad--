from flask import Flask, render_template, request, redirect
from flask_bootstrap import Bootstrap
import os

app = Flask("test", root_path=os.path.join(os.getcwd(), 'editor'))
Bootstrap(app)


@app.route('/')
def hello_world():
    return redirect('/editor')


@app.route('/editor')
def editor():
    return render_template('editor.html')


@app.route('/editor', methods=['POST'])
def editor_post():
    text = request.form['text']
    processed_text = text.upper()
    return processed_text
