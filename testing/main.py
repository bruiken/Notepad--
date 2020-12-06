from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
from distutils.util import strtobool
from setup import setupBrowser
import unittest
import os

#initial setup
browser = setupBrowser()
browser.get("http://127.0.0.1:5000/editor")
test_file_path = os.getenv("TEST_FILE_PATH")
test_download_path = os.getenv("TEST_DOWNLOAD_PATH")
editor = browser.find_element_by_id('textArea')


def file_load():
    editor.clear()
    nav_button = browser.find_element_by_id("navbarDropdown")
    nav_button.click()
    load_button = browser.find_element_by_id("fileinput")
    load_button.send_keys(test_file_path)
    editor.click()
    editor.send_keys(Keys.CONTROL, "s")

def file_save_hotkey():
    editor.clear()
    editor.click()
    editor.send_keys("Jungle diff")
    editor.send_keys(Keys.CONTROL, "s")

def file_save_button():
    editor.clear()
    editor.click()
    editor.send_keys("Jungle diff")
    nav_button = browser.find_element_by_id("navbarDropdown")
    nav_button.click()
    save_button = browser.find_element_by_link_text("Save")
    save_button.click()

def file_download():
    editor.clear()
    editor.click()
    editor.send_keys("Jungle diff")
    editor.send_keys(Keys.CONTROL, "s")
    nav_button = browser.find_element_by_id("navbarDropdown")
    nav_button.click()
    download_button = browser.find_element_by_link_text("Download")
    download_button.click()
    file_name_button = browser.find_element_by_id("fileNameField")
    sleep(0.5)
    file_name_button.send_keys("JUNGLEDIFF.TXT")
    save_button = browser.find_element_by_link_text("Save")
    save_button.click()


class FileTest(unittest.TestCase):
    def testFileLoad(self):
        f = open(test_file_path,"r")
        expected_output = f.read()
        f.close()
        file_load()
        textarea = editor.get_attribute("value")
        self.assertEqual(textarea,expected_output)

    def testFileSaveHotkey(self):
        file_save_hotkey()
        expected_output = editor.get_attribute("value")
        self.assertEqual(expected_output,"Jungle diff")

    def testFileSaveButton(self):
        file_save_button()
        expected_output = editor.get_attribute("value")
        self.assertEqual(expected_output, "Jungle diff")

    def testFileDownload(self):
        file_download()
        sleep(1)
        f = open(test_download_path,"r")
        expected_output = f.read()
        f.close()
        textarea = editor.get_attribute("value")
        self.assertEqual(textarea,expected_output)

if __name__ == '__main__':
    unittest.main()

