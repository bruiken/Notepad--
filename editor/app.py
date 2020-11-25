from flask import Flask, render_template, request, redirect
from flask_bootstrap import Bootstrap
import os
import aop
from aop import extensible, check_errors


app = Flask("Notepad--", root_path=os.path.join(os.getcwd(), 'editor'))
Bootstrap(app)


@extensible
def define_endpoints(flaskapp):
    @flaskapp.route('/')
    def home():
        return redirect('/editor')

    @flaskapp.route('/editor')
    def editor():
        return render_template('editor.html',
                               feature_sheets=feature_sheets([]),
                               feature_scripts=feature_scripts([]),
                               editor_html=feature_editor_htmls([]),
                               pre_editor_html=feature_pre_editor_htmls([]),
                               page_html=feature_page_htmls([]),
                               **feature_states({}))


@extensible
def feature_states(features):
    return features


@extensible
def feature_sheets(sheets):
    return sheets


@extensible
def feature_scripts(scripts):
    return scripts


@extensible
def feature_editor_htmls(htmls):
    return htmls


@extensible
def feature_pre_editor_htmls(htmls):
    return htmls


@extensible
def feature_page_htmls(htmls):
    return htmls


define_endpoints(app)

# check aop errors
check_errors()
