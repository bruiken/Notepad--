import os
from distutils.util import strtobool
from aop.aop import extends

feature_compiling = bool(strtobool(os.getenv("USE_COMPILING")))

if feature_compiling:
    import json
    import subprocess
    from flask import request, jsonify 
    
    print("Using feature: Local-Compilation")
    
    @extends('define_endpoints', after=True)
    def compilation_endpoints(flaskapp):
        @flaskapp.route('/editor/compile', methods=['POST'])
        def editor_post():
            """
            Selects a interpreter or compiler and returns the output as json if successfully compiled.
            Returns the output with the appropriate error otherwise.
            """
            cs = CompilerSelector('languages.json')
            filepath = request.form.get('filepath')
            language = request.form.get('language')
            returncode, message = cs.compile_and_run(language, filepath)
            if returncode == -5:
                return jsonify(success=False, message='Error code {}: {} caught.'.format(str(returncode), str(message)))
            elif returncode == -1:
                return jsonify(success=False, message='stderr: {}'.format(message))
            elif returncode == 1:
                return jsonify(success=False, message='Failed to compile: {}'.format(message))
            return jsonify(success=True, message='stdout: {}'.format(message))
        return editor_post 

    @extends('feature_states')
    def feature_compile(features):
        features['compile'] = True

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
        Base class for other exceptions.
        """
        pass

    class UndefinedLanguageError(Error):
        """
        Raised when compile language is not defined in 'languages.json'.
        """
        @staticmethod
        def __str__():
            """
            String created for UndefinedLanguageError objects.
            """
            return 'UndefinedLanguageError'

    class UndefinedFileError(Error):
        """
        Raised when file path is not valid.
        """
        @staticmethod
        def __str__():
            """
            String created for UndefinedFileError objects.
            """
            return 'UndefinedFileError'

    class CompilerSelector:
        """
        Class for selecting an interpreter or compiler and to run the given file.
        """
        def __init__(self, json_path):
            """
            Initializer for the CompilerSelector class.
            :param json_path: The path to the json file that contains the languages and their respective attributes.
            """
            self.language_dict = self.parse_json(json_path)

        @staticmethod
        def parse_json(json_path):
            """
            Parses and returns the json from the given path.
            :param json_path: The path to the json file to be parsed.
            :return: The parsed json file as a dictionary.
            """
            with open(json_path) as json_file:
                return json.load(json_file)
        
        def compiler_func_selector(self, language, file_path):
            """
            Selects the appropriate interpreter / compiler for the language given, and calls the corresponding
            function for that language to create shell arguments.
            :param language: The language to be interpreted / compiled.
            :param file_path: The path to the file that needs to be interpreted / compiled.
            :return: A list of shell arguments to be executed for the file to be interpreted / compiled and run.
            """
            if not os.path.exists(file_path):
                raise UndefinedFileError
            file_path = '"{}"'.format(file_path)
            if language not in self.language_dict:
                raise UndefinedLanguageError
            if language == "python":
                return self.python_command_creator(self.language_dict.get('python').get('compiler_path'), file_path)
            if language == "java":
                return self.java_command_creator(self.language_dict.get('java'), file_path)
            if language == "javascript":
                return self.js_command_creator(self.language_dict.get('javascript').get('compiler_path'), file_path)

        @staticmethod
        def python_command_creator(python_path, file_path):
            """
            Creates the shell arguments to execute the file on the given path location with python.
            :param python_path: The python interpreter path (can be 'py').
            :param file_path: The path of the file to be executed with python.
            :return: The list of arguments to be executed by the shell.
            """
            return ['%s %s' % (python_path, file_path)]

        @staticmethod
        def java_command_creator(java, file_path):
            """
            Creates the shell arguments to execute the file on the given path location with java.
            :param java: The java compiler path.
            :param file_path: The path of the file to be executed with java.
            :return: The list of arguments to be executed by the shell.
            """
            compiler = java.get('compiler')
            compiler_path = java.get('compiler_path')
            return ['%s %s' % (compiler, compiler_path), '%s %s' % (compiler, file_path)]
        
        @staticmethod
        def js_command_creator(node_path, file_path):
            """
            Creates the shell arguments to execute the file on the given path location with node js.
            :param node_path: The js interpreter path.
            :param file_path: The path of the file to be executed with js.
            :return: The list of arguments to be executed by the shell.
            """
            return ['%s %s' % (node_path, file_path)]

        def compile_and_run(self, language, file_path):
            """
            Tries to get a list of shell arguments to execute and execute them in sequence. Then returns
            the appropriate shell output including stdout and stderr. Catches exceptions for unknown languages
            and files.
            :param language: The language for which the shell arguments need to be created.
            :param file_path: The path to the file that needs to be executed.
            :return: The appropriate shell output or error messages.
            """
            try:
                commands = self.compiler_func_selector(language, file_path)
                execute = ' ; '.join(commands)
                result = subprocess.run(execute, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                if result.returncode == 1:
                    return 1, result.stdout.decode('utf-8')
                if result.stderr is not None:
                    return -1, result.stderr.decode('utf-8')
                return 0, result.stdout.decode('utf-8')
            except UndefinedLanguageError as err:
                # Error code -5 chosen semi arbitrarily
                return -5, err
            except UndefinedFileError as err:
                return -5, err
