from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

import sys
import time
import os
import urllib3.exceptions
import wget


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

path_to_file = sys.argv[1]
output_path = sys.argv[2]

os.environ['WDM_SSL_VERIFY'] = '0'

# output_directory
chromeOptions = webdriver.ChromeOptions()
chromeOptions.headless = True
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chromeOptions)

# Обработчик
url = "https://www.ilovepdf.com/pdf_to_excel/"
driver.get(url)
time.sleep(1)
# Load .pdf file
driver.find_element(By.CSS_SELECTOR, "input[type='file']").send_keys(path_to_file)
wait = WebDriverWait(driver, 5)
time.sleep(1)
# Buttons clicks
button = driver.find_element(By.ID, "processTask")
button.click()

while "iLovePDF" not in driver.title:
    time.sleep(2)
url = driver.current_url
download = driver.find_element(By.ID, "pickfiles").get_attribute("href")

wget.download(download, output_path)

# Time before close
time.sleep(4)
driver.close()

print(r'{"status": "success"}')
