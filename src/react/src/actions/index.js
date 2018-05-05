import axios from 'axios'
import { SubmissionError } from 'redux-form'
import transformProfitLossTransactionList from '../Utils/transformProfitLossTransactionList'
import extractCrypto from '../Utils/extractCrypto'
import historicalRateConversion from '../Utils/historicalRateConversion'
import {
  IS_AUTHENTICATING,
  AUTHENTICATE_USER,
  AUTHENTICATION_ERROR,
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

const REGISTER_USER_URL = 'http://127.0.0.1:8000/users/api/register/'
const LOGIN_USER_URL = 'http://127.0.0.1:8000/users/login/'
const GET_JWT_URL = 'http://127.0.0.1:8000/users/api/token/auth/'
const SYMBOL_LIST_URL = 'http://127.0.0.1:8000/api/portfolio/crypto-symbol/list/'
const ADD_NEW_BUY_ORDER_URL = 'http://127.0.0.1:8000/api/transactions/buy-order/create/'
const ADD_NEW_SELL_ORDER_URL = 'http://127.0.0.1:8000/api/transactions/sell-order/create/'
const BUY_ORDER_LIST_URL = 'http://127.0.0.1:8000/api/transactions/buy-order/list/'
const SELL_ORDER_LIST_URL = 'http://127.0.0.1:8000/api/transactions/sell-order/list/'
const FIAT_OPTION_LIST_URL = 'http://127.0.0.1:8000/api/settings/fiat-options/list/'
const USER_SETTINGS_LIST_URL = 'http://127.0.0.1:8000/api/settings/user-settings/list/'
const PROFIT_LOSS_TRANSACTION_LIST_URL = 'http://127.0.0.1:8000/api/transactions/profit-loss-transaction/list/'
const CRYPTO_ASSET_LIST_URL = 'http://127.0.0.1:8000/api/portfolio/crypto-asset/list/'

// UPDATE URLS
const UPDATE_USER_FIAT_OPTION_URL = 'http://127.0.0.1:8000/api/settings/user-settings/update/'

// API CREDENTIALS
const CURRENCY_CONVERSION_APP_ID = '90bc9dc92d3541ae97efc078912a1dbf'
// Send over this key in the reqeust header
const COIN_API_KEY = '5257DAF4-0354-4B8E-B525-877CE09F3B35'

// API URLS
const CURRENCY_CONVERSION_API_BASE_URL = 'https://openexchangerates.org/api/latest.json'
const CRYPTO_PERFORMANCE_API_BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/'
const COIN_API_HISTORICAL_RATE_URL = 'https://rest.coinapi.io/v1/exchangerate/' // + {asset_id_base}/{asset_id_quote}?time={time}

// Error edge cases to be handled
//   -User Registration
//   -User Login
//   -Coinmarket API error response
//   -Crypto currency historical rate API (CoinApi is already giving me enough problems as it is)
//   -PRETTY MUCH ANY OTHER RESOURCE FETCHED FROM MY DRF API (need to really handle custom error messages on the server)

export const registerUser = values => async dispatch => {
  const userInfo = {
    username: values["username"],
    password: values["password"],
    password2: values["confirm-password"],
    email: values["email"]
  }

  await axios.post(`${REGISTER_USER_URL}`, userInfo)
    .catch(function (error) {
      console.log(error)
    })

  // dispatch({ type: GET_SYMBOL_LIST, payload: refinedSymbolList })
}

export const loginUser = values => async dispatch => {
  // Update to below: I said this, but the current implementation works aswell, only it
  // requires a roundtrip to make it possible. So extending ObtainJWTToken should be done later.
  // Need to work on the backend logic to extend ObtainJWTToken and check if
  // The user is actually registered in order to get the login flow correct.

  // console.log('Login Values')
  // console.log(values)
  dispatch({ type: IS_AUTHENTICATING })
  try {
    const response = await axios.post(`${LOGIN_USER_URL}`, values)
    const getToken = await axios.post(GET_JWT_URL, values)
    // console.log("THIS IS GET TOKEN")
    // console.log(getToken)
    // console.log("RESPONSE IN LOGIN USER")
    // console.log(response.status)
    localStorage.setItem('token', getToken.data['token'])
    dispatch({ type: AUTHENTICATE_USER, payload: true })
  }
  catch (err) {
    console.log("Error in the catch block")
    // Either return customized error message from server and use err.message
    // or use err.response.status to determine the type of error and customize the message here
    console.log(err.response.status)
    dispatch({ type: AUTHENTICATION_ERROR })
  } 
}

export const signOutUser = () => async dispatch => {
  // To be used whenever a 401 error is recieved in response to navigating
  // to a component that dispatches a request to DRF API
  // OR when the user logs out
  console.log("signing out")
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
  console.log("GET THEM HISTORICAL RATES")
  console.log(values)
  const historicalOrderRateData = await axios.get(`${COIN_API_HISTORICAL_RATE_URL}${values.baseCurrency}/${values.quoteCurrency}?time=${values.dateTime}&apikey=${COIN_API_KEY}`)
  const historicalRateUSDConversion = await axios.get(`${COIN_API_HISTORICAL_RATE_URL}USD/${values.quoteCurrency}?time=${values.dateTime}&apikey=${COIN_API_KEY}`)
  console.log("THIS IS HISTORICAL ORDER RATE DATA")
  console.log(historicalOrderRateData)
  const ratioDifference = historicalRateConversion.getRatioDifference(historicalOrderRateData.data.rate, values.price)
  const trueUSDHistoricalRate = historicalRateConversion.getTrueHistoricalRate(ratioDifference, historicalRateUSDConversion.data.rate)

  // *************EVERYTHING ABOVE THIS LINE CHECKS OUT***************



  // In the case above it was a matter of converting between the ICX/BTC price per unit to the price of USD/BTC, and as such
  // you'd need to divide the much lower price that is obtained through trueUSDHistoricalRate USD/BTC into the much higher
  // values.price rate for ICX/BTC result being around 11 dollars.
  const historicalUSDPricePerUnit = values.price / trueUSDHistoricalRate

  console.log("This is the Historical USD Price Per Unit")
  console.log(historicalUSDPricePerUnit)

  // historicalUSDPricePerUnit is effectively the rate you would obtain if you were to make a request ICX/USD (which isn't a thing for this api)
  // and as such, multiplying in this instance is much like utilizing the percentage of that 0 through 1 value of ICX to obtain the fee USD
  // because the fee in the buy order is the base currency (which in this case is ICX)
  let feeUSD = historicalUSDPricePerUnit * values.fee


  console.log("THIS IS THE FEE USD")
  console.log(feeUSD)

  // ********************************************** TEST ABOVE ********************** and below...



  // Need to test the functions that are in getHistoricalBitcoinPriceInfo
  // And Also need to ensure that appropriate decimal values are being assigned to the createOrderObject (i.e. ensure rounding isn't getting out of hand)
  const bitcoinPriceInfo = await historicalRateConversion.getHistoricalBitcoinPriceInfo(values, ratioDifference, historicalOrderRateData , COIN_API_HISTORICAL_RATE_URL, COIN_API_KEY)
  

  console.log("THIS IS THE BITCOIN HISTORICAL DATA:")
  console.log(bitcoinPriceInfo)

  console.log("TYPE OF historicalUSDPricePerUnit")
  console.log(typeof historicalUSDPricePerUnit)


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
  // returns an object with 
  // quantity
  // purchase_price_btc
  // purchase_price_fiat
  // exchange_fee_btc
  // exchange_fee_fiat

  console.log("Create Order Dict before addNewCrypto call")
  console.log(createOrderDict)
  dispatch(addNewCrypto(createOrderDict))
}

// *************************************** ABOVE *****************************************************************






export const addNewCrypto = values => async dispatch => {
  console.log("Values passed into addNewCrypto")
  console.log(values)
  // const orderInfo = {
  //       ticker: values["ticker"],
  //       quantity: values["quantity"],
  //       exchange_fee_btc: values["exchange_fee_btc"],
  //       exchange_fee_fiat: values["exchange_fee_fiat"]
  // }
  // Branching if/else statement to post to separate api url based upon buy/sell option
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    if(values['buyOrder']) {
      // orderInfo.purchase_price_btc = values["purchase_price_btc"]
      // orderInfo.purchase_price_fiat = values["purchase_price_fiat"]
      axios.post(`${ADD_NEW_BUY_ORDER_URL}`, values, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    else if(values['sellOrder']) {
      // orderInfo.sell_price_btc = values["sell_price_btc"]
      // orderInfo.sell_price_fiat = values["sell_price_fiat"]
      axios.post(`${ADD_NEW_SELL_ORDER_URL}`, values, { headers: {Authorization: `JWT ${AUTH_TOKEN}` } })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }
  
  // const res = posts.data

  // dispatch({ type: GET_SYMBOL_LIST, payload: res })
  console.log('Submit successful')
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
  console.log("GET PROFIT LOSS TRANSACTION LIST RUNNING")
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
  console.log("GET CRYPTO ASSET LIST RUNNING")
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(CRYPTO_ASSET_LIST_URL, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
      .catch(error => {
        console.log("THIS IS THE ERROR IN getCryptoAssetList")
        console.log(error.message)
        // When server isn't running and I get a network error
        // trying to log this or check it in the if statement crashes my app
        console.dir(error.response.status)
        if(error.response.status === 401) {
          dispatch({ type: AUTHENTICATE_USER, payload: false })
        }
      })
    // This is where you'll need to handle the logic associated with receiving a 401 error upon token expiry
    if(response) {
      const filteredCryptos = await extractCrypto.requestUntilFulfilled(0, 50, CRYPTO_PERFORMANCE_API_BASE_URL, response.data)

      dispatch({ type: GET_CRYPTO_ASSET_LIST, payload: response })
      dispatch({ type: GET_COIN_MARKET_API_DATA, payload: filteredCryptos })
    }
  }
}





// *************************************** BELOW *****************************************************************

export const updateUserFiatOption = (data) => async dispatch => {
  const AUTH_TOKEN = localStorage.getItem('token')
  axios.post(`${UPDATE_USER_FIAT_OPTION_URL}`, data, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
  // THIS IS WHERE I WOULD DO THE CURRENCY CONVERSION... HOWEVER THE IDEAL API COSTS MONEIES
    // .then(function (response) {
    //   console.log("THE TO CURRENCY")
    //   console.log(data.abbreviated_currency)
    //   console.log("THE FROM CURRENCY")
    //   console.log(data.fromCurrency)

    //   if (response.status === 200) {
    //     const base_currency = data.fromCurrency
    //     const to_currency = data.abbreviated_currency
    //     const options = `?app_id=${CURRENCY_CONVERSION_APP_ID}&base=${base_currency}&symbols=${to_currency}`
    //     axios.get(`${CURRENCY_CONVERSION_API_BASE_URL}${options}`)
    //       .then(response => console.log(response))
          
    //     // fire off CurrencyLayer API call
    //     // CURRENCY_CONVERSION_API_BASE_URL
    //     // ? access_key = YOUR_ACCESS_KEY
    //     // & from = data.fromCurrency
    //     // & to = data.abbreviated_currency
    //     // & amount = All of the necessary models to convert which are stored in redux store..

    //   }
    // })
    // .catch(function (error) {
    //   console.log(error)
    // })
}

// *************************************** ABOVE *****************************************************************