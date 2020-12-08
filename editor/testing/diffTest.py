from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
from setup import setupBrowser
import unittest

browser = setupBrowser()
browser.get("http://127.0.0.1:5000/editor")
editor = browser.find_element_by_id("textArea")


def diffDefault():
    editor.click()
    editor.send_keys("Hello!")
    new_tab = browser.find_element_by_id("newTab")
    new_tab.click()
    editor.click()
    editor.send_keys("Hi!")
    diff_button = browser.find_element_by_id("diff")
    diff_button.click()
    sleep(1)
    browser.switch_to.window(browser.window_handles[1])
    # html = browser.page_source
    # sleep(2)
    # print(htmlCompare)
    # print("---------------------")
    # print(html)
    # if (str(html) == htmlCompare):
    #     print("pls?")
    # else:
    #     print("nope")

diffDefault()

