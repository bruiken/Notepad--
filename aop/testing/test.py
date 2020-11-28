from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
import unittest

def one():
    # write your selenium code here for the test function
    # selenium checks immediately if something is open or not instead of waiting for the popup to appear
    # eg when you click File download you need to insert a sleep(1) to wait for the menu to appear so you can
    # find the input field for file name
    return 1


class FileTest(unittest.TestCase):
    # write test code here
    def test(self):
        self.assertEqual(1,one())


if __name__ == '__main__':
    unittest.main()
