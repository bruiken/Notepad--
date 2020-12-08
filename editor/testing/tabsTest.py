from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from setup import setupBrowser
import unittest

browser = setupBrowser()
browser.get("http://127.0.0.1:5000/editor")
editor = browser.find_element_by_id("textArea")

def openTabs():
    new_tab = browser.find_element_by_id("newTab")
    new_tab.click()

openTabs()