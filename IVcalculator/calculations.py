#Calculates Call Price, Vega, Volga, and Ultima for a European Call Option
#Calculates Implied Volatility using Newton-Raphson method

import numpy as np
from scipy.stats import norm

N_prime = norm.pdf
N = norm.cdf 

def call_price(S, K, T, rf, sigma):
    #Black-Scholes European call option pricing
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    d2 = d1 - sigma * np.sqrt(T)
    call = S * N(d1) -  N(d2)* K * np.exp(-rf * T)
    return call

def vega(S, K, T, rf, sigma): 
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    vega = S * N_prime(d1) * np.sqrt(T)
    return vega

def volga(S, K, T, rf, sigma):
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    d2 = d1 - sigma * np.sqrt(T)
    volga = vega(S, K, T, rf, sigma) * (d1*d2)/sigma
    return volga

def ultima(S, K, T, rf, sigma):
    d1 = (np.log(S / K) + (rf + sigma ** 2 / 2) * T) / sigma * np.sqrt(T)
    d2 = d1 - sigma * np.sqrt(T)
    temp = (-1 * vega(S, K, T, rf, sigma)) / (sigma ** 2)
    ultima = temp * ((d1 * d2) * (1 - d1 * d2) + (d1 ** 2) + (d2 ** 2))
    return ultima

def ImpVol(C, S, K, T, rf, err = 1e-4, max = 100):
    # In order to calculate the implied volatility, use the fact that the current price of the option is a function of implied volatility
    # g(sigma) = f(sigma) - C = 0. Then x_(n+1) = x_n - g(x_n)/g'(x_n) = x_n - (f(x_n) - C)/f'(x_n)
    # if g'(x_n) is particularly close to zero, use a third order correction term
    # x_(n+1) = x_n - 3 g''(x_n)/g'''(x_n)
    
    sigma = 0.7
    for i in range(max):
        g_func = call_price(S, K, T, rf, sigma) - C
        if abs(g_func) < err: #Within stopping conditions
            break
        if abs(vega(S, K, T, rf, sigma)) < 1:
            #correction term
            sigma +=  3 * volga(S, K, T, rf, sigma) / (ultima(S, K, T, rf, sigma))
        else:
            sigma -= (call_price(S, K, T, rf, sigma) - C) / vega(S, K, T, rf, sigma)
    return sigma