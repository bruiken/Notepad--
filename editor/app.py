from flask import Flask, render_template, request, redirect
from flask_bootstrap import Bootstrap
from distutils.util import strtobool
from dotenv import load_dotenv
import os


load_dotenv()

feature_highlighting = bool(strtobool(os.getenv("USE_HIGHLIGHT")))

app = Flask("test", root_path=os.path.join(os.getcwd(), 'editor'))
Bootstrap(app)


@app.route('/')
def hello_world():
    return redirect('/editor')


@app.route('/editor')
def editor():
    return render_template('editor.html', highlight=feature_highlighting)


if feature_highlighting:
    print("Using feature: Syntax-Highlighting")

    @app.route('/editor/highlight', methods=['POST'])
    def editor_post():
        from .features.highlight import SyntaxHighlight
        return SyntaxHighlight(request)
