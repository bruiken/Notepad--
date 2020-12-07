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