
import os
from distutils.util import strtobool
from aop.aop import extends

feature_tabs = bool(strtobool(os.getenv("USE_TABS")))

if feature_tabs:
    print("Using feature: Tabs")

    @extends('feature_states')
    def feature_tabs(features):
        features['tabs'] = True

    @extends('feature_scripts')
    def tabs_js(scripts):
        scripts.append('/static/tabs/index.js')

    @extends('feature_dropdown_file_htmls')
    def tabs_dropdown_file_html(htmls):
        htmls.append('tabs/dropdown.html')

    @extends('feature_page_htmls')
    def tabs_pre_editor_html(htmls):
        htmls.append('tabs/index.html')
