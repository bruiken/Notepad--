import json
import subprocess

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
        if language not in self.language_dict:
            return
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
        commands = self.compiler_func_selector(language, file_path)
        execute = ' ; '.join(commands)
        result = subprocess.run(execute, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        
if __name__ == "__main__":
    cs = CompilerSelector('languages.json')
    print(cs.compile_and_run('python', '"D:/Uni/Software Product Lines/Notepad--/editor/test.py"'))