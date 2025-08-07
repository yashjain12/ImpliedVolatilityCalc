#Handles Web Scraping for available Strike Prices of a particular Stock

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Browser setup (shared across modules)
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
browser = webdriver.Chrome(options=options)

def get_all_strikes(stock):
    time.sleep(1)
    url_options = f'https://finance.yahoo.com/quote/{stock}/options'
    browser.get(url_options)

    base_xpath = '//*[@id="main-content-wrapper"]/section[2]/section/div[2]/table/tbody/tr'
    WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.XPATH, base_xpath + "[1]")))

    strikes = []
    row = 1

    while True:
        try:
            strike_xpath = f'{base_xpath}[{row}]/td[3]/a'
            strike = browser.find_element(By.XPATH, strike_xpath).text.strip()
            if not strike:
                row += 1
                continue
            strikes.append(float(strike.replace(',', '')))
            row += 1
        except:
            break
        time.sleep(1)

    return strikes