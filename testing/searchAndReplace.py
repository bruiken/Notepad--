from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
from distutils.util import strtobool
from setup import setupBrowser
import unittest
import os

browser = setupBrowser()
browser.get("http://127.0.0.1:5000/editor")
editor = browser.find_element_by_id('textArea')

def replace():
    editor.click()
    editor.send_keys("Replace works?")
    nav_button = browser.find_element_by_id("navbarDropdown")
    nav_button.click()
    sleep(1)
    replace_button = browser.find_element_by_link_text("Search and Replace")
    replace_button.click()
    searchBy = browser.find_element_by_id("searchBy")
    searchBy.click()
    searchBy.send_keys("works?")
    replaceBy = browser.find_element_by_id("replaceBy")
    replaceBy.click()
    replaceBy.send_keys("works!")
    replaceModal = browser.find_element_by_id("replaceModal")
    replaceModal.click()

class SearchAndReplaceTest(unittest.TestCase):
    def testSearchAndReplace(self):
        replace()
        text = editor.get_attribute("value")
        self.assertEqual(text,"Replace works!")

if __name__ == '__main__':
    unittest.main()

