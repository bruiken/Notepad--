from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep

browser = webdriver.Chrome("C:/Users/Huy/Downloads/chromedriver_win32/chromedriver.exe")
browser.get("http://127.0.0.1:5000/editor")
editor = browser.find_element_by_id("textArea")

text = """def hello_world():
    print("This is better than Visual Studio Code!")

hello_world()"""

def human_type(element, text):
    for char in text:
        sleep(0.1) 
        element.send_keys(char)

def open_site(id):
    editor.click()
    editor.send_keys(Keys.CONTROL, "a")
    sleep(1)
    site = browser.find_element_by_id(id)
    site.click()
    sleep(1)
    browser.switch_to.window(browser.window_handles[1])
    sleep(1)
    browser.close()
    sleep(1)
    browser.switch_to.window(browser.window_handles[0])

def pick_python():
    language = browser.find_element_by_id("languageSelect")
    language.click()
    language.send_keys("p","y","t")
    language.send_keys(Keys.ENTER)

def open_tab():
    editor.click()
    tab = browser.find_element_by_id("newTab")
    tab.click()
    editor.click()
    text = "Lalalala im typing something on tab 2"
    human_type(editor,text)
    tab.click()
    text2 = """def i_wanna_use_neovim_again():
    print("No it's not")

i_wanna_use_neovim_again()"""
    human_type(editor,text2)

def perform_diff():
    diff_input = browser.find_element_by_id("placeholderDiff")
    diff = browser.find_element_by_id("diff")
    diff.click()
    sleep(1)
    browser.switch_to.window(browser.window_handles[1])
    sleep(1)
    browser.close()
    sleep(1)
    browser.switch_to.window(browser.window_handles[0])
    sleep(1)
    diff_input.click()
    diff_input.send_keys("1")
    sleep(1)
    diff.click()
    sleep(1)
    browser.switch_to.window(browser.window_handles[1])
    sleep(3)
    browser.close()
    sleep(1)
    browser.switch_to.window(browser.window_handles[0])

human_type(editor, text)
sleep(1)
pick_python()
sleep(1)
open_site("google")
sleep(1)
open_site("youtube")
sleep(1)
open_site("stackoverflow")
sleep(1)
open_site("reddit")
sleep(1)
open_tab()
perform_diff()

