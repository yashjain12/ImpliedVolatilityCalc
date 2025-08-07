#Main execution script with ThreadPoolExecutor coordination

import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from scraper import get_all_strikes, browser
from data_fetcher import get_price, get_rf
from calculations import ImpVol, vega, volga, ultima

executor = ThreadPoolExecutor(max_workers=20)

# Initialize
stock = input("Enter Stock: ")

strikes = get_all_strikes(stock)

with ThreadPoolExecutor(max_workers=20) as executor:
    future_price = executor.submit(get_price, 0, stock)
    S, _ = future_price.result()
    future_rf = executor.submit(get_rf)
    rf = future_rf.result()

results = []
for K in strikes:
    try:
        C, T = get_price(K, stock)
        iv = ImpVol(C, S, K, T, rf)
        veg = 0.01 * vega(S, K, T, rf, iv)
        vol = volga(S, K, T, rf, iv)
        ul = ultima(S, K, T, rf, iv)

        results.append({
            'Stock': stock,
            'Days Until Exp.': round(T * 365, 2),
            'Strike': K,
            'Spot Price': S,
            'Call Price': C,
            'Riskfree Rate': round(rf, 4),
            'Implied Vol': round(iv, 4),
            'Vega': round(veg, 4),
            'Volga': round(vol, 4),
            'Ultima': round(ul, 4)
        })

    except Exception as e:
        print(f"Error on strike {K}: {e}")
        continue

browser.quit()

# Create DataFrame
df = pd.DataFrame(results)
print(df)