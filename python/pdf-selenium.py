from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

import sys
import time
import os
import urllib3.exceptions


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

#ToDo принимать путь до файла
path_to_file = sys.argv[1]
# file_name = sys.argv[2]
# path_to_file = directory + file_name
# path_to_file = r"C:\Users\maslovda\PycharmProjects\ScanerBank\new.pdf"

os.environ['WDM_SSL_VERIFY'] = '0'
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
# Обработчик
url = "https://www.ilovepdf.com/pdf_to_excel/"
driver.get(url)
time.sleep(1)
# Load .pdf file
driver.find_element(By.CSS_SELECTOR, "input[type='file']").send_keys(path_to_file)
wait = WebDriverWait(driver, 5)
time.sleep(1)
# Buttons clicks
wait.until(EC.element_to_be_clickable((By.ID, "processTask")))
button = driver.find_element(By.ID, "processTask")
button.click()

while "iLovePDF" not in driver.title:
    time.sleep(2)

wait.until(EC.element_to_be_clickable((By.ID, "pickfiles")))
button = driver.find_element(By.ID, "pickfiles")
button.click()
# Time before close
time.sleep(4)
driver.close()

print(r'{"status": "success"}')
