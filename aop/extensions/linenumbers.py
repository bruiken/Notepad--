import os
from distutils.util import strtobool
from aop.aop import extends

feature_line_numbers = bool(strtobool(os.getenv("USE_LINE_NUMBERS")))

if feature_line_numbers:
    print("Using feature: Line Numbers")

    @extends('feature_states')
    def feature_highlight(features):
        features['line-numbers'] = True

    @extends('feature_sheets')
    def highlight_css(sheets):
        sheets.append('/static/line_numbers/index.css')

    @extends('feature_scripts')
    def highlight_js(scripts):
        scripts.append('/static/line_numbers/index.js')

    @extends('feature_pre_editor_htmls')
    def line_number_pre_editor_html(htmls):
        htmls.append('line_numbers/index.html')
