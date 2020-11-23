import os
from distutils.util import strtobool
from aop.aop import extends

search_and_replace = bool(strtobool(os.getenv("USE_SEARCH_AND_REPLACE")))

if search_and_replace:
    print("Using feature: Search and replace")

    @extends('feature_states')
    def search_and_replace_feature(features):
        features['search-and-replace'] = True

    @extends('feature_scripts')
    def external_search_js(scripts):
        scripts.append('/static/search_and_replace/index.js')

    @extends('feature_page_htmls')
    def external_search_html(htmls):
        htmls.append('/search_and_replace/index.html')