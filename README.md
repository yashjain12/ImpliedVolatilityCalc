# Implied Volatility Calculator

An automated tool that scrapes options data from Yahoo Finance and calculates implied volatility using the Black-Scholes model with Newton's method optimization.

## Overview

This project takes a stock ticker as input and automatically:
1. Scrapes all available option strike prices and current market data
2. Applies Newton's method to reverse-engineer implied volatility from market prices
3. Calculates various Greeks (Vega, Volga, Ultima) for volatility sensitivity analysis
4. Outputs everything into a clean pandas DataFrame

## Project Structure

```
├── scraper.py          # Web scraping for strike prices
├── data_fetcher.py     # Price and risk-free rate collection
├── calculations.py     # Black-Scholes math and Newton's method
└── main.py            # Threading coordination and final assembly
```

## How It Works

### 1. **Data Scraping** (`scraper.py` & `data_fetcher.py`)
- Uses Selenium WebDriver to navigate Yahoo Finance
- Scrapes all available strike prices for the given stock
- Fetches current stock price, option prices, and 13-week Treasury rate
- Handles time-to-expiration calculations automatically

### 2. **Mathematical Engine** (`calculations.py`)
The Black-Scholes formula and Greeks calculations power the volatility solver:

```python
def call_price(S, K, T, rf, sigma):
    # Black-Scholes European call option pricing
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    d2 = d1 - sigma * np.sqrt(T)
    call = S * N(d1) -  N(d2)* K * np.exp(-rf * T)
    return call

def vega(S, K, T, rf, sigma): 
    # First derivative: sensitivity to volatility changes
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    vega = S * N_prime(d1) * np.sqrt(T)
    return vega

def volga(S, K, T, rf, sigma):
    # Second derivative: rate of change of vega
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    d2 = d1 - sigma * np.sqrt(T)
    volga = vega(S, K, T, rf, sigma) * (d1*d2)/sigma
    return volga
```

**The Problem**: Given a market price, what volatility makes Black-Scholes match that price?
**Solution**: Newton's method uses Vega (first derivative) to iteratively solve for volatility.

### 3. **Parallel Processing** (`main.py`)
ThreadPoolExecutor coordinates data fetching efficiently:

```python
with ThreadPoolExecutor(max_workers=20) as executor:
    # Parallel initial data fetch
    future_price = executor.submit(get_price, 0, stock)
    future_rf = executor.submit(get_rf)
    
    S, _ = future_price.result()  # Stock price
    rf = future_rf.result()       # Risk-free rate

# Sequential strike processing (shares browser instance)
for K in strikes:
    C, T = get_price(K, stock)
    iv = ImpVol(C, S, K, T, rf)
    # Calculate Greeks...
```

- **Parallel**: Stock price and risk-free rate fetched simultaneously
- **Sequential**: Strike processing to avoid browser conflicts
- **Efficiency**: Initial parallel fetch saves ~50% of data collection time

### 4. **Data Assembly**
All results flow into a pandas DataFrame with columns:
- Stock info (ticker, spot price, days to expiration)
- Market data (strike price, call price, risk-free rate)
- Calculated metrics (implied volatility, Vega, Volga, Ultima)

## Key Concepts

### Newton's Method Application
The core algorithm solves for implied volatility by iteratively refining guesses:

```python
def ImpVol(C, S, K, T, rf, err = 1e-4, max = 100):
    # Newton's method: x_(n+1) = x_n - g(x_n)/g'(x_n)
    # where g(sigma) = f(sigma) - C = 0
    
    sigma = 0.7  # Initial guess: 70% volatility
    for i in range(max):
        g_func = call_price(S, K, T, rf, sigma) - C
        if abs(g_func) < err:  # Converged within tolerance
            break
        if abs(vega(S, K, T, rf, sigma)) < 1:
            # When derivative is too small, use third-order correction
            sigma +=  3 * volga(S, K, T, rf, sigma) / (ultima(S, K, T, rf, sigma))
        else:
            # Standard Newton-Raphson update
            sigma -= (call_price(S, K, T, rf, sigma) - C) / vega(S, K, T, rf, sigma)
    return sigma
```

**Process:**
1. Start with 70% volatility guess
2. Calculate theoretical price using Black-Scholes
3. Compare to actual market price
4. Use Vega (∂Price/∂σ) to adjust volatility
5. Repeat until theoretical price matches market within 0.0001 tolerance

## Usage

```python
python main.py
# Enter stock ticker when prompted
# Results automatically display and save to CSV
```

## Output
The final DataFrame provides a complete volatility surface analysis, showing how implied volatility varies across different strike prices for the same expiration date. This data is valuable for:
- Options trading strategy development
- Risk management and portfolio analysis  
- Market sentiment analysis through volatility skew patterns
