from flask import Flask, render_template, request, redirect, jsonify
from flask_bootstrap import Bootstrap
import os
import aop
import json
from editor import diff as df
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
                               dropdown_file_html=feature_dropdown_file_htmls([]),
                               editor_html=feature_editor_htmls([]),
                               navbar_settings_html=feature_navbar_settings_htmls([]),
                               navbar_theme_settings_html=feature_navbar_theme_settings_htmls([]),
                               pre_editor_html=feature_pre_editor_htmls([]),
                               page_html=feature_page_htmls([]),
                               menu_item_html=feature_menu_item_htmls([]),
                               modal_html=feature_modal_htmls([]),
                               **feature_states({}))
    
    @flaskapp.route('/diff',methods=['POST'])
    def test():
        incoming = request.get_json()
        html = df.diffOnSentences(incoming["one"], incoming["two"])
        return html, 200




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
def feature_dropdown_file_htmls(htmls):
    return htmls


@extensible
def feature_editor_htmls(htmls):
    return htmls


@extensible
def feature_navbar_theme_settings_htmls(htmls):
    return htmls


@extensible
def feature_navbar_settings_htmls(htmls):
    return htmls


@extensible
def feature_pre_editor_htmls(htmls):
    return htmls


@extensible
def feature_page_htmls(htmls):
    return htmls

@extensible
def feature_menu_item_htmls(htmls):
    return htmls

@extensible
def feature_modal_htmls(htmls):
    return htmls

define_endpoints(app)

# check aop errors
check_errors()
