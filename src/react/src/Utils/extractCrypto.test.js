import extractCrypto from './extractCrypto'


/************* Start test returnApiSymbolDataList ***************/

const apiMockDataList = [
  {id: "bitcoin", name: "Bitcoin", symbol: "BTC", rank: "1", price_usd: "8994.07"},
  {id: "ethereum", name: "Ethereum", symbol: "ETH", rank: "2", price_usd: "659.515"},
  {id: "ripple", name: "Ripple", symbol: "XRP", rank: "3", price_usd: "0.830101"}
]

test('extractCrypto.returnApiSymbolDataList filters symbol/ticker from coinmarket API Data', () => {
  expect(extractCrypto.returnApiSymbolDataList(apiMockDataList)).toMatchObject(['BTC', 'ETH', 'XRP'])
})

/************* End test for returnApiSymbolDataList ***************/


/************* Start test returnIndexPositions ***************/

const userCryptos = [
  {ticker: 'ADA', quantity: 800, initial_investment_fiat: 0.39, initial_investment_btc: 0.0001},
  {ticker: 'DENT', quantity: 900, initial_investment_fiat: 0.02, initial_investment_btc: 0.00003},
  {ticker: 'BTC', quantity: 200, initial_investment_fiat: 0.30, initial_investment_btc: 0.0023}
]

test('returnIndexPositions returns index position of data in coinMarketApi response matched against userCryptos', () => {
  expect(extractCrypto.returnIndexPositions(['BTC', 'ETH', 'ADA'], userCryptos, false)).toMatchObject([2, -1, 0])
})

/************* End test for returnIndexPositions ***************/


/************* Start test mergeCryptoObjects ***************/

const userCrypto = [
  {ticker: 'ADA', quantity: 300, initial_investment_fiat: 90, initial_investment_btc: 0.0105}
]

const apiResponseData = [
  {
    id: 'cardano', 
    name: "Cardano", 
    symbol: "ADA", 
    rank: "6", 
    last_updated: "1525202957", 
    market_cap_usd: "9179971938.0",
    available_supply: "25927070538.0",
    total_suppy: "31112483745.0",
    max_supply: "45000000000.0",
    percent_change_1h: "-0.86",
    percent_change_7d: "13.14",
    percent_change_24h: "1.21",
    price_btc: "0.00003947",
    price_usd: "0.354069",
    "24h_volume_usd": "368236000.0"
  }
]

const desiredOutput = {
  ticker: 'ADA',
  quantity: 300,
  initial_investment_fiat: 90,
  initial_investment_btc: 0.0105,
  current_price_fiat: 0.354069,
  current_price_btc: 0.00003947,
  percent_change_1h: "-0.86",
  percent_change_24h: "1.21",
  percent_change_7d: "13.14",
  gain_loss_fiat: "16.220700",
  gain_loss_btc: "0.001341",
  gain_loss_percentage: "0.180230" 
}

test('mergeCryptoObjects returns a merged object with the desired data to output to the UI', () => {
  expect(extractCrypto.mergeCryptoObjects(userCrypto, apiResponseData, 0, 0)).toMatchObject(desiredOutput)
})

/************* End test for mergeCryptoObjects ***************/