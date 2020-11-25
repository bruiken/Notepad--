import os
from distutils.util import strtobool
from aop.aop import extends

feature_function_click = bool(strtobool(os.getenv("USE_FUNCTION_CLICK")))

if feature_function_click:
    print("Using feature: Function Click")

    @extends('feature_states')
    def feature_func_click(features):
        features['function-click'] = True

    @extends('feature_sheets')
    def func_click_css(sheets):
        sheets.append('/static/function_click/index.css')

    @extends('feature_scripts')
    def func_click_js(scripts):
        scripts.append('/static/function_click/index.js')

    @extends('feature_editor_htmls')
    def func_click_editor_html(htmls):
        htmls.append('/function_click/index.html')
