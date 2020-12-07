import os
from distutils.util import strtobool
from aop.aop import extends

feature_code_runner = bool(strtobool(os.getenv("USE_CODE_RUNNER")))

if feature_code_runner:
    import json
    import subprocess
    from flask import request, jsonify 
    import shutil
    
    print("Using feature: Code Runner")
    
    @extends('define_endpoints', after=True)
    def compilation_endpoints(flaskapp):
        @flaskapp.route('/editor/code_runner', methods=['POST'])
        def editor_code_post():
            """
            Selects a interpreter or compiler and runs the code at a path. Returns the output as json
            if successfully compiled. Returns the output with the appropriate error otherwise.
            """
            crs = CodeRunnerSelector('languages.json')
            code = request.form.get('code')
            language = request.form.get('language')
            returncode, message = crs.run_code(language, code)
            if returncode == -5:
                return jsonify(success=False, message='Error code {}: {} caught.'.format(str(returncode), str(message)))
            elif returncode == -1:
                return jsonify(success=False, message='stderr: {}'.format(message))
            elif returncode == 1:
                return jsonify(success=False, message='Failed to run: {}'.format(message))
            return jsonify(success=True, message='stdout: {}'.format(message))


    @extends('feature_states')
    def feature_code_runner_code(features):
        features['code_runner'] = True

    @extends('feature_scripts')
    def code_runner_js(scripts):
        scripts.append('/static/code_runner/index.js')

    @extends('feature_menu_item_htmls')
    def code_runner_menu_item_html(htmls):
        htmls.append('/code_runner/index.html')

    @extends('feature_modal_htmls')
    def code_runner_modal_html(htmls):
        htmls.append('/code_runner/modal.html')

    class Error(Exception):
        """
        Base class for other exceptions.
        """
        pass

    class UndefinedLanguageError(Error):
        """
        Raised when interpretor / compile language is not defined in 'languages.json'.
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

    class CodeRunnerSelector:
        """
        Class for selecting an interpreter or compiler and to run the given file.
        """
        def __init__(self, json_path):
            """
            Initializer for the CodeRunnerSelector class.
            :param json_path: The path to the json file that contains the languages and their respective attributes.
            """
            self.language_dict = self.parse_json(json_path)
            self.code_folder = self.make_code_folder()

        @staticmethod
        def make_code_folder():
            try:
                if not os.path.exists('temp'):
                    os.mkdir('temp')
                return 'temp'
            except OSError:
                print('Creation of the directory failed.')

        @staticmethod
        def parse_json(json_path):
            """
            Parses and returns the json from the given path.
            :param json_path: The path to the json file to be parsed.
            :return: The parsed json file as a dictionary.
            """
            with open(json_path) as json_file:
                return json.load(json_file)
        
        def compiler_func_selector(self, language, code):
            """
            Selects the appropriate interpreter / compiler for the language given, and calls the corresponding
            function for that language to create shell arguments and write the code to a file.
            :param language: The language to be interpreted / compiled.
            :param code: The code that needs to be run.
            :return: A list of shell arguments to be executed for the file to be interpreted / compiled and run.
            """
            if language not in self.language_dict:
                raise UndefinedLanguageError
            file_path = self.save_code_to_file(language, code)
            if not os.path.exists(file_path):
                raise UndefinedFileError
            file_path = '"{}"'.format(file_path)
            if language == "python":
                return self.python_command_creator(self.language_dict.get('python').get('compiler_path'), file_path)
            if language == "javascript":
                return self.js_command_creator(self.language_dict.get('javascript').get('compiler_path'), file_path)

        def save_code_to_file(self, language, code):
            """
            Chooses the correct function to create a file with the right extension for the code to be run.
            :param language: The language of the code.
            :param code: The code to be run.
            :return: The path to the file containing the code.
            """
            if language == 'python':
                return self.create_python_file(code)
            if language == 'javascript':
                return self.create_javascript_file(code)
        
        def create_python_file(self, code):
            """
            Creates a python file with the code to be run.
            :param code: The code to be run.
            :return: The path to the python file.
            """
            path = '{}/temp.py'.format(self.code_folder)
            with open(path, 'w') as f:
                f.write(code)
            return path

        def create_javascript_file(self, code):
            """
            Creates a javascript file with the code to be run.
            :param code: The code to be run.
            :return: The path to the javascript file.
            """
            path = '{}/temp.js'.format(self.code_folder)
            with open(path, 'w') as f:
                f.write(code)
            return path

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
        def js_command_creator(node_path, file_path):
            """
            Creates the shell arguments to execute the file on the given path location with node js.
            :param node_path: The js interpreter path.
            :param file_path: The path of the file to be executed with js.
            :return: The list of arguments to be executed by the shell.
            """
            return ['%s %s' % (node_path, file_path)]

        def run_code(self, language, code):
            """
            Tries to get a list of shell arguments to execute and execute them in sequence. Then returns
            the appropriate shell output including stdout and stderr. Catches exceptions for unknown languages
            and files.
            :param language: The language for which the shell arguments need to be created.
            :param code: The code that needs to be executed.
            :return: The appropriate shell output or error messages.
            """
            try:
                commands = self.compiler_func_selector(language, code)
                execute = ' ; '.join(commands)
                result = subprocess.run(execute, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                shutil.rmtree(self.code_folder)
                if result.returncode == 1:
                    return 1, result.stdout.decode('utf-8')
                if result.stderr is not None:
                    return -1, result.stderr.decode('utf-8')
                return 0, result.stdout.decode('utf-8')
            except UndefinedLanguageError as err:
                # Error code -5 chosen since no documentation of use found
                return -5, err
            except UndefinedFileError as err:
                return -5, err
