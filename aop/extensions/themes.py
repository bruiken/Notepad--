import os
from distutils.util import strtobool
from aop.aop import extends

feature_themes = bool(strtobool(os.getenv("USE_THEMES")))

if feature_themes:
    from flask_bootstrap import Bootstrap
    from flask import request
    print("Using feature: Themes")

    @extends('define_endpoints', after=True)
    def highlighting_endpoints(flaskapp):
        @flaskapp.route('/editor/themes/bootstrap', methods=['POST'])
        def editor_replace_bootstrap_style():
            theme = request.form['theme']
            if theme == 'default':
                theme = ''
            flaskapp.config['BOOTSTRAP_BOOTSWATCH_THEME'] = theme
            return Bootstrap.load_css()

    @extends('feature_states')
    def feature_themes(features):
        features['themes'] = True

    @extends('feature_scripts')
    def func_themes_js(scripts):
        scripts.append('/static/themes/index.js')

    @extends('feature_navbar_settings_htmls')
    def func_themes_navbar_settings_html(htmls):
        htmls.append('/themes/navbar.html')

    @extends('feature_modal_htmls')
    def func_themes_page_html(htmls):
        htmls.append('/themes/modal.html')
