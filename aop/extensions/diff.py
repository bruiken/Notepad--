import os
from distutils.util import strtobool
from aop.aop import extends

feature_diff = bool(strtobool(os.getenv("USE_DIFF")))

if feature_diff:
    print("Using feature: Jungle diff")

    @extends('feature_states')
    def diff(features):
        features['diff'] = True

    @extends('feature_scripts')
    def diff_js(scripts):
        scripts.append('/static/diff/index.js')

    @extends('feature_page_htmls')
    def diff_html(htmls):
        htmls.append('/diff/index.html')
