import axios from 'axios'
import { 
  REGISTER_USER, 
  LOGIN_USER, 
  ADD_NEW_CRYPTO,
  GET_SYMBOL_LIST, 
  GET_BUY_ORDER_LIST, 
  GET_SELL_ORDER_LIST,
  GET_FIAT_OPTION_LIST,
  GET_USER_SETTINGS_LIST,
} from './types'

const REGISTER_USER_URL = 'http://127.0.0.1:8000/users/api/register/'
const LOGIN_USER_URL = 'http://127.0.0.1:8000/users/api/token/auth/'
const SYMBOL_LIST_URL = 'http://127.0.0.1:8000/api/portfolio/crypto-symbol-list/retrieve/'
const ADD_NEW_BUY_ORDER = 'http://127.0.0.1:8000/api/transactions/buy-order/create/'
const ADD_NEW_SELL_ORDER = 'http://127.0.0.1:8000/api/transactions/sell-order/create/'
const BUY_ORDER_LIST = 'http://127.0.0.1:8000/api/transactions/buy-order/list/'
const SELL_ORDER_LIST = 'http://127.0.0.1:8000/api/transactions/sell-order/list/'
const FIAT_OPTION_LIST = 'http://127.0.0.1:8000/api/settings/fiat-options/list/'
const USER_SETTINGS_LIST = 'http://127.0.0.1:8000/api/settings/user-settings/list/'

// const BASE_URL = 'https://cdn.contentful.com/'
// const SPACE_ID = 'o0wcfti34e3q'
// const ACCESS_TOKEN = '90baae4254924c96b4c0bb82e164c9413373ca90b6f4266b2a30dd69bf42b857'

export const registerUser = (values) => async dispatch => {
  console.log('Registration Successful')
  console.log(values)
  const userInfo = {
    username: values["username"],
    password: values["password"],
    password2: values["confirm-password"],
    email: values["email"]
  }

  axios.post(`${REGISTER_USER_URL}`, userInfo)
    .then(function (response) {
      console.log('Heres the response.')
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })

  // dispatch({ type: GET_SYMBOL_LIST, payload: refinedSymbolList })
}

export const loginUser = (values) => async dispatch => {
  console.log('Login Successful')
  console.log(values)

  axios.post(`${LOGIN_USER_URL}`, values)
    .then(function (response) {
      console.log(response)
      localStorage.setItem('token', response.data['token'])
      // Store jwt in local storage
      // Push history to /portfolio/performance
    })
    .catch(function (error) {
      console.log(error)
    })

  // dispatch({ type: GET_SYMBOL_LIST, payload: refinedSymbolList })
}

export const getSymbolList = (values) => async dispatch => {
  const unrefined_list = await axios.get(`${SYMBOL_LIST_URL}`)
  let refinedSymbolList = unrefined_list.data.reduce((symbolArr, symbol) => {
                            symbolArr.push(symbol.symbol)
                            return symbolArr
			                    }, [])

  dispatch({ type: GET_SYMBOL_LIST, payload: refinedSymbolList })
}


export const addNewCrypto = (values) => async dispatch => {
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
      axios.post(`${ADD_NEW_BUY_ORDER}`, values, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
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
      axios.post(`${ADD_NEW_SELL_ORDER}`, values, { headers: {Authorization: `JWT ${AUTH_TOKEN}` } })
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

// exchange_fee_btc: 100
// exchange_fee_fiat: 100
// purchase_price_btc: 100
// purchase_price_fiat:100
// quantity: 100
// ticker: "ADA"

export const getBuyOrderList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(BUY_ORDER_LIST, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    console.log("BUY ORDER LIST RESPONSE")
    console.log(response)
    dispatch({ type: GET_BUY_ORDER_LIST, payload: response })
  }
}

export const getSellOrderList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(SELL_ORDER_LIST, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    console.log("SELL ORDER LIST RESPONSE")
    console.log(response)
    dispatch({ type: GET_SELL_ORDER_LIST, payload: response })
  }
}

export const getFiatOptionList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(FIAT_OPTION_LIST, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    dispatch({ type: GET_FIAT_OPTION_LIST, payload: response })
  }
}

export const getUserSettingsList = (values) => async dispatch => {
  if(localStorage['token']) {
    const AUTH_TOKEN = localStorage.getItem('token')
    const response = await axios.get(USER_SETTINGS_LIST, { headers: { Authorization: `JWT ${AUTH_TOKEN}` } })
    dispatch({ type: GET_USER_SETTINGS_LIST, payload: response })
  }
}


// Good example of looping through api data

// //Should've created the postObj's object literal inside reduce <-- got my nested data structure right, remember that trick
// export const fetchPosts = (key = null) => async dispatch => {
// 	const posts = await axios.get(`${BASE_URL}spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}`)
// 	// console.log('before the duece')
//   // console.log(posts.data.items)
//   let refinedPosts = posts.data.items.reduce((obj, post) => {
// 											let postObj = {}
// 											let postId = post.fields.postTitle.replace(/\s/g, "-").toLowerCase()
// 											obj[postId] = postObj
// 											postObj['id'] = post.sys.id
// 											postObj['postStore'] = post.fields
// 											return obj
// 										 }, {})
// 	// console.log('after the duece')
//   // console.log(refinedPosts)
// 	dispatch({ type: FETCH_POSTS, payload: refinedPosts })
// 	if(key !== null) {
// 		return refinedPosts[key]
// 	}
// }