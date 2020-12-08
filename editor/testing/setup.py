from selenium import webdriver
from dotenv import load_dotenv
from distutils.util import strtobool
import os

def setupBrowser():
    load_dotenv()
    if bool(strtobool(os.getenv("FIREFOX"))):
        fp = webdriver.FirefoxProfile()
        fp.set_preference("browser.download.folderList",2)
        fp.set_preference("browser.download.dir", os.getenv("TEST_DOWNLOAD_FOLDER"))
        fp.set_preference("browser.download.manager.showWhenStarting", False)
        fp.set_preference("browser.helperApps.neverAsk.saveToDisk", "text/plain")
        browser = webdriver.Firefox(executable_path=os.getenv("WEBDRIVER_FIREFOX"),firefox_profile=fp)
        return browser
    elif bool(strtobool(os.getenv("CHROME"))):
        browser = webdriver.Chrome(os.getenv("WEBDRIVER_CHROME"))
        return browser
