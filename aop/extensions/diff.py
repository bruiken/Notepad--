import os
import json
from distutils.util import strtobool
from aop.aop import extends
from editor import diff as df
from flask import request

feature_diff = bool(strtobool(os.getenv("USE_DIFF")))

if feature_diff:
    print("Using feature: Diff")

    @extends('define_endpoints')
    def diff_endpoints(flaskapp):
        @flaskapp.route('/editor/diff', methods=['POST'])
        def diff_files():
            incoming = request.get_json()
            html = df.diffOnSentences(incoming["one"], incoming["two"])
            return html, 200

    @extends('feature_states')
    def diff(features):
        features['diff'] = True

    @extends('feature_scripts')
    def diff_js(scripts):
        scripts.append('/static/diff/index.js')

    @extends('feature_page_htmls')
    def diff_html(htmls):
        htmls.append('/diff/index.html')

    @extends('feature_help_section_htmls')
    def diff_feature_help_section_html(htmls):
        htmls.append('/diff/help.html')
