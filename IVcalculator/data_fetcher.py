#Fetches Call option price at given underlier strike price
#Fetches current Risk-Free Interest Rate

import numpy as np
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime

# Import browser from scraper
from scraper import browser

def get_price(val=0, stock=''):
    time.sleep(1)
    now = datetime.now()
    if val == 0:
        url = f'https://finance.yahoo.com/quote/{stock}/'
        browser.get(url)
        xpath = '//*[@id="main-content-wrapper"]/section[1]/div[2]/div[1]/section/div/section/div[1]/div[1]/span'
        try:
            a = WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.XPATH, xpath)))
        except TimeoutError:
            print('couldnt locate')
    else:
        url = f'https://finance.yahoo.com/quote/{stock}/options'
        browser.get(url)
        base_xpath = '//*[@id="main-content-wrapper"]/section[2]/section/div[2]/table/tbody/tr'
        WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.XPATH, base_xpath + "[1]")))
        row = 1
        while True:
            try:
                #XPath for strike price in row `row`
                strike_xpath = f'{base_xpath}[{row}]/td[3]/a'
                strike_element = browser.find_element(By.XPATH, strike_xpath)
                strike_text = strike_element.text.strip()

                if float(strike_text) == val: #If the strike price matches val
                    price_xpath = f'{base_xpath}[{row}]/td[4]'
                    price = browser.find_element(By.XPATH, price_xpath).text.strip()
                    
                    #Find expiration date of call option
                    exp_xpath = f'//*[@id="main-content-wrapper"]/section[2]/section/div[2]/table/tbody/tr[{row}]/td[1]/a'
                    exp_text = browser.find_element(By.XPATH, exp_xpath).text.strip()

                    exp_date_str = exp_text[len(stock): len(stock) + 6 ]
                    exp_date = datetime.strptime(exp_date_str, "%y%m%d")
                    exp_datetime = exp_date.replace(hour=16, minute=0, second=0)

                    changeTime = exp_datetime - now
                    T = changeTime.total_seconds() / (365 * 24 * 60 * 60)
                    return float(price.replace(',', '')), T

                row += 1
            except Exception as e:    
                raise ValueError(f'Strike price {val} not found')
                break
    
    price = browser.find_element(By.XPATH, xpath).text
    return float(price.replace(',', '')), None

def get_rf():
    time.sleep(1)

    #This gets one time 13 week US Treasury Bill Interest Rate
    #Must convert into continously compounded rate
    url_rf = 'https://finance.yahoo.com/quote/^IRX'
    browser.get(url_rf)
    xpath = '//*[@id="main-content-wrapper"]/section[1]/div[2]/div[1]/section/div/section/div[1]/div[1]/span'
    WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.XPATH, xpath)))
    
    #Have to adjust this to continously compounded interest rate
    #Init_price = 100 (1 - 13_Wk_Yield * 91/360)
    #100 = Init_price * e^(r * 91/360)
    #r = 360/91 * ln(100/Init_price)
    mytext = browser.find_element(By.XPATH, xpath).text
    thirteenWkYield = float(mytext.replace(',', ''))
    initPrice = 100 * (1 - 1/100 * thirteenWkYield * 91/360)
    return (360/91 * np.log(100/initPrice))