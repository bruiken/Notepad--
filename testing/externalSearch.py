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
editor = browser.find_element_by_id('textArea')

def searchButtons():
    editor.clear()
    editor.click()
    editor.send_keys("Jungle diff")
    editor.send_keys(Keys.CONTROL, "a")
    google = browser.find_element_by_id("google")
    google.click()
    youtube = browser.find_element_by_id("youtube")
    youtube.click()
    stack = browser.find_element_by_id("stackoverflow")
    stack.click()
    
class ExternalSearchTest(unittest.TestCase):
    def testSearch(self):
        searchButtons()
        sleep(3)
        browser.switch_to.window(browser.window_handles[3])
        google = browser.current_url
        sleep(1)
        browser.switch_to.window(browser.window_handles[2])
        youtube = browser.current_url
        sleep(1)
        browser.switch_to.window(browser.window_handles[1])
        stack = browser.current_url
        self.assertEqual(google,"https://www.google.com/search?q=Jungle%20diff&gws_rd=ssl")
        #self.assertEqual(stack,"https://stackoverflow.com/nocaptcha?s=271f432a-4de7-4b0d-9cab-b40bd0544221")
        self.assertEqual(youtube,"https://www.youtube.com/results?search_query=Jungle+diff")
        

if __name__ == '__main__':
    unittest.main()
