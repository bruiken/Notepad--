import os
from distutils.util import strtobool
from aop.aop import extends

feature_sharing = bool(strtobool(os.getenv("USE_SHARING")))

if feature_sharing:
    print("Using feature: Sharing")

    @extends('feature_states')
    def sharing(features):
        features['sharing'] = True

    @extends('feature_scripts')
    def sharing_js(scripts):
        scripts.append('/static/sharing/index.js')

    @extends('feature_page_htmls')
    def sharing_html(htmls):
        htmls.append('/sharing/index.html')
