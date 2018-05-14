import axios from 'axios'
import { SubmissionError } from 'redux-form'
import transformProfitLossTransactionList from '../Utils/transformProfitLossTransactionList'
import extractCrypto from '../Utils/extractCrypto'
import historicalRateConversion from '../Utils/historicalRateConversion'
import bitcoinHistoricalRateUSDConversion from '../Utils/bitcoinHistoricalRateUSDConversion'
import {
  IS_AUTHENTICATING,
  AUTHENTICATE_USER,
  AUTHENTICATION_ERROR,
  IS_REGISTERING,
  REGISTER_USER,
  REGISTRATION_ERROR,
  ADD_NEW_CRYPTO,
  GET_SYMBOL_LIST, 
  GET_BUY_ORDER_LIST, 
  GET_SELL_ORDER_LIST,
  GET_FIAT_OPTION_LIST,
  GET_USER_SETTINGS_LIST,
  GET_PROFIT_LOSS_TRANSACTION_LIST,
  GET_REFINED_PROFIT_LOSS_TRANSACTION_LIST,
  GET_CRYPTO_ASSET_LIST,
  GET_COIN_MARKET_API_DATA
} from './types'
import {
  COIN_API_KEY
} from './devVenv'

// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'
const DEV_API = 'http://127.0.0.1:8000'
const PROD_API = 'https://crypto-portfolio-manager.herokuapp.com'
const REGISTER_USER_URL = `${process.env ? PROD_API : DEV_API }/users/api/register/`
const LOGIN_USER_URL = `${process.env ? PROD_API : DEV_API }/users/login/`
const GET_JWT_URL = `${process.env ? PROD_API : DEV_API }/users/api/token/auth/`
const SYMBOL_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/portfolio/crypto-symbol/list/`
const ADD_NEW_BUY_ORDER_URL = `${process.env ? PROD_API : DEV_API }/api/transactions/buy-order/create/`
const ADD_NEW_SELL_ORDER_URL = `${process.env ? PROD_API : DEV_API }/api/transactions/sell-order/create/`
const BUY_ORDER_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/transactions/buy-order/list/`
const SELL_ORDER_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/transactions/sell-order/list/`
const FIAT_OPTION_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/settings/fiat-options/list/`
const USER_SETTINGS_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/settings/user-settings/list/`
const PROFIT_LOSS_TRANSACTION_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/transactions/profit-loss-transaction/list/`
const CRYPTO_ASSET_LIST_URL = `${process.env ? PROD_API : DEV_API }/api/portfolio/crypto-asset/list/`

// UPDATE URLS
const UPDATE_USER_FIAT_OPTION_URL = 'http://127.0.0.1:8000/api/settings/user-settings/update/'

// API URLS
const CURRENCY_CONVERSION_API_BASE_URL = 'https://openexchangerates.org/api/latest.json'
const CRYPTO_PERFORMANCE_API_BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/'
const COIN_API_HISTORICAL_RATE_URL = 'https://rest.coinapi.io/v1/exchangerate/' // + {asset_id_base}/{asset_id_quote}?time={time}

function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

export const registerUser = values => async dispatch => {
  dispatch({ type: IS_REGISTERING })
  var csrftoken = getCookie('csrftoken')
  console.log(csrftoken)
  const userInfo = {
    username: values["username"],
    password: values["password"],
    password2: values["confirmPassword"],
    email: values["email"]
  }

  try {
    const response = await axios.post(
                             `${REGISTER_USER_URL}`, 
                             userInfo, 
                             { headers: {'X-CSRFToken': csrftoken} }
                           )
    if (response.status === 201) {
      dispatch({ type: REGISTER_USER, payload: true })
    }
  }
  catch (err) {
    if(err.response.data.message) {
      dispatch({ type: REGISTRATION_ERROR, payload: err.response.data.message })
    }
  }
}

export const loginUser = values => async dispatch => {
  dispatch({ type: IS_AUTHENTICATING })
  try {
    const response = await axios.post(`${LOGIN_USER_URL}`, values)
    const getToken = await axios.post(GET_JWT_URL, values)
    localStorage.setItem('token', getToken.data['token'])
    dispatch({ type: AUTHENTICATE_USER, payload: true })
  }
  catch (err) {
    if(err.message === "Request failed with status code 404") {
      dispatch({ type: AUTHENTICATION_ERROR, payload: err.response.data.message })
      return
    }
    else if(err.message === "Network error") {
      dispatch({ type: AUTHENTICATION_ERROR, payload: err.message })
      return
    }
    dispatch({ type: AUTHENTICATION_ERROR, payload: err.message })
  }
}

export const signOutUser = () => async dispatch => {
  dispatch({ type: AUTHENTICATE_USER, payload: false })
}

export const getSymbolList = (values) => async dispatch => {
  const unrefined_list = await axios.get(`${SYMBOL_LIST_URL}`)
  let refinedSymbolList = unrefined_list.data.reduce((symbolArr, symbol) => {
                            symbolArr.push(symbol.symbol)
                            return symbolArr
			                    }, [])
  dispatch({ type: GET_SYMBOL_LIST, payload: refinedSymbolList })
}

export const getHistoricalRate = values => async dispatch => {
  const historicalOrderRateData = await axios.get(`${COIN_API_HISTORICAL_RATE_URL}${values.baseCurrency}/${values.quoteCurrency}?time=${values.dateTime}&apikey=${process.env ? process.env.COIN_API_KEY : COIN_API_KEY}`)
  const historicalRateUSDConversion = await axios.get(`${COIN_API_HISTORICAL_RATE_URL}USD/${values.quoteCurrency}?time=${values.dateTime}&apikey=${process.env ? process.env.COIN_API_KEY : COIN_API_KEY}`)
  const ratioDifference = historicalRateConversion.getRatioDifference(historicalOrderRateData.data.rate, values.price)
  const trueUSDHistoricalRate = historicalRateConversion.getTrueHistoricalRate(ratioDifference, historicalRateUSDConversion.data.rate)

  // In the case above it was a matter of converting between the ICX/BTC price per unit to the price of USD/BTC, and as such
  // you'd need to divide the much lower price that is obtained through trueUSDHistoricalRate USD/BTC into the much higher
  // values.price rate for ICX/BTC result being around 11 dollars.
  const historicalUSDPricePerUnit = values.price / trueUSDHistoricalRate

  // historicalUSDPricePerUnit is effectively the rate you would obtain if you were to make a request ICX/USD (which isn't an available pair for this api)
  // and as such, multiplying in this instance is much like utilizing the percentage of that 0 through 1 value of ICX to obtain the fee USD
  // because the fee in the buy order is the base currency (which in this case is ICX)
  let feeUSD = historicalUSDPricePerUnit * values.fee

  const bitcoinPriceInfo = await historicalRateConversion.getHistoricalBitcoinPriceInfo(values, ratioDifference, historicalOrderRateData , COIN_API_HISTORICAL_RATE_URL, COIN_API_KEY)

  let createOrderDict = {}
  if(values.buyOrder) {
    createOrderDict.buyOrder = values.buyOrder
    createOrderDict.ticker = values.baseCurrency
    createOrderDict.quantity = parseFloat(values.quantity).toFixed(6)
    createOrderDict.purchase_price_btc = bitcoinPriceInfo.trueBitcoinHistoricalPrice.toFixed(6)
    createOrderDict.purchase_price_fiat = historicalUSDPricePerUnit.toFixed(6)
    createOrderDict.exchange_fee_btc = parseFloat(bitcoinPriceInfo.feeBTC).toFixed(6)
    createOrderDict.exchange_fee_fiat = parseFloat(feeUSD).toFixed(2)
  }
  else if(values.sellOrder) {
    createOrderDict.sellOrder = values.sellOrder
    createOrderDict.quantity = parseFloat(values.quantity).toFixed(6)
    createOrderDict.ticker = values.baseCurrency
    createOrderDict.sell_price_btc = bitcoinPriceInfo.trueBitcoinHistoricalPrice.toFixed(6)
    createOrderDict.sell_price_usd = historicalUSDPricePerUnit.toFixed(6)
    createOrderDict.exchange_fee_btc = parseFloat(bitcoinPriceInfo.feeBTC).toFixed(6)
    createOrderDict.exchange_fee_fiat = feeUSD.toFixed(2)
  }
  // Creates an object with the following properties:
  // quantity
  // purchase_price_btc
  // purchase_price_fiat
  // exchange_fee_btc
  // exchange_fee_fiat

  dispatch(addNewCrypto(createOrderDict))
}

export const getBitcoinHistoricalRate = values => async dispatch => {
  const historicalBitcoinRateData = await axios.get(`${COIN_API_HISTORICAL_RATE_URL}USD/BTC?time=${values.dateTime}&apikey=${process.env ? process.env.COIN_API_KEY : COIN_API_KEY}`)
  
  const feeBTC = bitcoinHistoricalRateUSDConversion.getFeeBTC(historicalBitcoinRateData.data.rate, values.fee)
  const priceBTC = bitcoinHistoricalRateUSDConversion.getPriceBTC(historicalBitcoinRateData.data.rate, values.price)

  let createOrderDict = {}
  if(values.deposit) {
    createOrderDict.buyOrder = values.deposit
    createOrderDict.purchase_price_btc = priceBTC.toFixed(6)
    createOrderDict.purchase_price_fiat = parseFloat(values.price).toFixed(6)
  }
  else if (values.withdraw) {
    createOrderDict.sellOrder = values.withdraw
    createOrderDict.sell_price_btc = priceBTC.toFixed(6)
    createOrderDict.sell_price_fiat = parseFloat(values.price).toFixed(6)
  }
  createOrderDict.ticker = values.baseCurrency
  createOrderDict.quantity = parseFloat(values.quantity).toFixed(6)
  createOrderDict.exchange_fee_btc = parseFloat(feeBTC).toFixed(6)
  createOrderDict.exchange_fee_fiat = parseFloat(values.fee).toFixed(2)

  dispatch(addNewCrypto(createOrderDict))
}

export const addNewCrypto = values => async dispatch => {
  console.log("Values passed into addNewCrypto")
  console.log(values)
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    if(values['buyOrder']) {
      axios.post(`${ADD_NEW_BUY_ORDER_URL}`, values, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    else if(values['sellOrder']) {
      axios.post(`${ADD_NEW_SELL_ORDER_URL}`, values, { headers: {Authorization: `JWT ${AUTH_TOKEN}` } })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}

export const getBuyOrderList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(BUY_ORDER_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    if(response.data.length === 0) {
      return
    }
    dispatch({ type: GET_BUY_ORDER_LIST, payload: response })
  }
}

export const getSellOrderList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(SELL_ORDER_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    if(response.data.length === 0) {
      return
    }
    dispatch({ type: GET_SELL_ORDER_LIST, payload: response })
  }
}

export const getFiatOptionList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(FIAT_OPTION_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    dispatch({ type: GET_FIAT_OPTION_LIST, payload: response })
  }
}

export const getUserSettingsList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(USER_SETTINGS_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    dispatch({ type: GET_USER_SETTINGS_LIST, payload: response })
  }
}

export const getProfitLossTransactionList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(PROFIT_LOSS_TRANSACTION_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    if(response.data.length === 0) {
      return
    }
    let refinedPLTransactionList = transformProfitLossTransactionList.filterObjects(response.data)
    dispatch({ type: GET_PROFIT_LOSS_TRANSACTION_LIST, payload: response })
    dispatch({type: GET_REFINED_PROFIT_LOSS_TRANSACTION_LIST, payload: refinedPLTransactionList})
  }
}

export const getCryptoAssetList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(CRYPTO_ASSET_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
      .catch(err => {
        if(err.response.status === 401) {
          dispatch({ type: AUTHENTICATE_USER, payload: false })
        }
      })
    if(response) {
      const filteredCryptos = await extractCrypto.requestUntilFulfilled(0, 50, CRYPTO_PERFORMANCE_API_BASE_URL, response.data)

      dispatch({ type: GET_CRYPTO_ASSET_LIST, payload: response })
      dispatch({ type: GET_COIN_MARKET_API_DATA, payload: filteredCryptos })
    }
  }
}