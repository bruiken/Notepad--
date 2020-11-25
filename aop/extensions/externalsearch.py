import os
from distutils.util import strtobool
from aop.aop import extends

feature_external_search = bool(strtobool(os.getenv("USE_EXTERNAL_SEARCH")))

if feature_external_search:
    print("Using feature: External Search")

    @extends('feature_states')
    def external_search(features):
        features['external-search'] = True
    
    @extends('feature_sheets')
    def external_search_css(sheets):
        sheets.append('/static/external_search/index.css')

    @extends('feature_scripts')
    def external_search_js(scripts):
        scripts.append('/static/external_search/index.js')

    @extends('feature_editor_htmls')
    def external_search_html(htmls):
        htmls.append('/external_search/index.html')