import os
from distutils.util import strtobool
from aop.aop import extends

feature_compiling = bool(strtobool(os.getenv("USE_COMPILING")))

if feature_compiling:
    import sys
    import json
    import subprocess
    from flask import request, jsonify 
    
    print("Using feature: Local-Compilation")
    
    @extends('define_endpoints', after=True)
    def compilation_endpoints(flaskapp):
        @flaskapp.route('/editor/compile', methods=['POST'])
        def editor_post():
            cs = CompilerSelector('languages.json')
            filepath = request.form.get('filepath')
            language = request.form.get('language')
            res = cs.compile_and_run(language, filepath)
            if isinstance(res, UndefinedFileError) or isinstance(res, UndefinedLanguageError):
                print(res)
                return jsonify(success=False, message="{} caught.".format(str(res)))
            elif res[0] == -1:
                return jsonify(success=False, message="stderr: {}".format(res[1]))
            return jsonify(success=True, message="stdout: {}".format(res[1]))
        return editor_post 

    @extends('feature_states')
    def feature_compile(features):
        features['compile'] = True

    @extends('feature_sheets')
    def compile_css(sheets):
        sheets.append('/static/compile/index.css')

    @extends('feature_scripts')
    def compile_js(scripts):
        scripts.append('/static/compile/index.js')

    @extends('feature_menu_item_htmls')
    def compile_menu_item_html(htmls):
        htmls.append('/compile/index.html')

    @extends('feature_modal_htmls')
    def compile_modal_html(htmls):
        htmls.append('/compile/modal.html')

    class Error(Exception):
        """
        Base class for other exceptions
        """
        pass

    class UndefinedLanguageError(Error):
        """
        Raised when compile language is not defined in 'languages.json'
        """
        @staticmethod
        def __str__():
            return 'UndefinedLanguageError'

    class UndefinedFileError(Error):
        """
        Raised when filepath is not valid
        """
        @staticmethod
        def __str__():
            return 'UndefinedFileError'

    class CompilerSelector:
        """
        
        """
        def __init__(self, json_path):
            self.language_dict = self.parse_json(json_path)

        @staticmethod
        def parse_json(json_path):
            """
            """
            with open (json_path) as json_file:
                return json.load(json_file)
        
        def compiler_func_selector(self, language, file_path):
            """
            docstring
            """
            if not os.path.exists(file_path):
                raise UndefinedFileError
            file_path = '"{}"'.format(file_path)
            print(file_path)
            if language not in self.language_dict:
                raise UndefinedLanguageError
            if language == "python":
                return self.python_command_creator(self.language_dict.get('python').get('compiler_path'), file_path)
            if language == "java":
                return self.java_command_creator(self.language_dict.get('java'), file_path)
            if language == "javascript":
                return self.js_command_creator(self.language_dict.get('javascript').get('compiler_path'), file_path)
            return


        @staticmethod
        def python_command_creator(python_path, file_path):
            """
            """
            return ['%s %s' % (python_path, file_path)]

        #TODO Option for compiling a java project instead of file through 'javac *.java'
        @staticmethod
        def java_command_creator(java, file_path):
            """
            """
            compiler = java.get('compiler')
            compiler_path = java.get('compiler_path')
            # TODO still needs compilation and execution
            return ['%s %s' % (compiler, compiler_path)]
        
        @staticmethod
        def js_command_creator(node_path, file_path):
            """
            """
            return ['%s %s' % (node_path, file_path)]

        def compile_and_run(self, language, file_path):
            """
            """
            try:
                commands = self.compiler_func_selector(language, file_path)
                execute = ' ; '.join(commands)
                result = subprocess.run(execute, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                if result.stderr is None:
                    print(result.stdout)
                    return (0, result.stdout)
                return (-1, result.stderr)
            except UndefinedLanguageError as err:
                print('Language undefined')
                return err
            except UndefinedFileError as err:
                print('File not found')
                return err
