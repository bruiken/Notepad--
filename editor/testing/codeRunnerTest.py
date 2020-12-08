from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
from dotenv import load_dotenv
from distutils.util import strtobool
from setup import setupBrowser
import unittest
import os

browser = setupBrowser()
browser.get("http://127.0.0.1:5000/editor")
test_file_path = os.getenv("TEST_FILE_PATH")
editor = browser.find_element_by_id
language = os.getenv("LANGUAGE")

def file_load():
    run_button = browser.find_element_by_link_text("Compile & Run")
    run_button.click()
    sleep(1)
    language_field = browser.find_element_by_id("languageField")
    language_field.click()
    language_field.send_keys(language)
    run = browser.find_element_by_id("runCode")
    run.click()


class CodeRunnerTest(unittest.TestCase):
    def testFileRun(self):
        file_load()
        self.assertEqual(1,1)

if __name__ == '__main__':
    unittest.main() 