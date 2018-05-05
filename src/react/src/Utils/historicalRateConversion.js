import axios from 'axios'

const historicalRateConversion = {
  getRatioDifference: function (historicalDataRate, price) {
    return (historicalDataRate - price)/price
  },
  getTrueHistoricalRate: function (ratioDifference, apiHistoricalRate) {
    let trueHistoricalRate
    const extraneousAmount = Math.abs(ratioDifference * apiHistoricalRate)
    if (ratioDifference > 0) {
      trueHistoricalRate = apiHistoricalRate - extraneousAmount
    }
    else {
      trueHistoricalRate = apiHistoricalRate + extraneousAmount
    }
    return trueHistoricalRate
  },
  getHistoricalBitcoinPriceInfo: async function (values, ratioDifference, historicalOrderRateDataForBuyOrder, api_url, api_key) {
    var result
    if(values.quoteCurrency !== "BTC") {
      result = await this.quoteCurrencyIsBTCProcedure(values, ratioDifference, api_url, api_key)
        .then(data => data)
      console.log("THE RESULT INSIDE THE IF BLOCK")
      console.log(result)
    }
    else if (values.buyOrder) {
      result = this.buyOrderHistoricalBitcoinRate(values, historicalOrderRateDataForBuyOrder, ratioDifference)
    }
    else if (values.sellOrder) {
      result = await this.sellOrderHistoricalBitcoinRate(values, ratioDifference, api_url. api_key)
        .then(data => data)
    }
    console.log("THIS IS RESULT")
    console.log(result)
    return result
  },
  quoteCurrencyIsBTCProcedure: async function (values, ratioDifference, api_url, api_key) {
    var historicalBitcoinAmountForOneOfRequestedCurrencyPair
    if(values.buyOrder) {
      historicalBitcoinAmountForOneOfRequestedCurrencyPair = await axios.get(`${api_url}${values.baseCurrency}/BTC?time=${values.dateTime}&apikey=${api_key}`)
    }
    if(values.sellOrder) {
      historicalBitcoinAmountForOneOfRequestedCurrencyPair = await axios.get(`${api_url}${values.quoteCurrency}/BTC?time=${values.dateTime}&apikey=${api_key}`)
    }
    const trueBitcoinHistoricalRate = this.getTrueHistoricalRate(ratioDifference, historicalBitcoinAmountForOneOfRequestedCurrencyPair.data.rate)
    const feeBTC = values.fee * trueBitcoinHistoricalRate
    const historicalBitcoinPriceInfo = {
      feeBTC: feeBTC,
      trueBitcoinHistoricalPrice: trueBitcoinHistoricalRate
    }
    return historicalBitcoinPriceInfo
  },
  buyOrderHistoricalBitcoinRate: function (values, historicalOrderRateData, ratioDifference) {
    const trueBitcoinHistoricalRate = this.getTrueHistoricalRate(ratioDifference, historicalOrderRateData.data.rate)
    const feeBTC = values.fee * trueBitcoinHistoricalRate
    const historicalBitcoinPriceInfo = {
      feeBTC: feeBTC,
      trueBitcoinHistoricalPrice: trueBitcoinHistoricalRate
    }
    return historicalBitcoinPriceInfo
  },
  sellOrderHistoricalBitcoinRate: async function (values, ratioDifference, api_url, api_key) {
    const historicalBitcoinAmountForOneOfRequestedCurrencyPair = await axios.get(`${api_url}${values.quoteCurrency}/BTC?time=${values.dateTime}&apikey=${api_key}`)
    const trueBitcoinHistoricalRate = historicalRateConversion.getTrueHistoricalRate(ratioDifference, historicalBitcoinAmountForOneOfRequestedCurrencyPair.data.rate)
    const feeBTC = values.fee * trueBitcoinHistoricalRate
    const historicalBitcoinPriceInfo = {
      feeBTC: feeBTC,
      trueBitcoinHistoricalPrice: trueBitcoinHistoricalRate
    }
    return historicalBitcoinPriceInfo
  }
}

export default historicalRateConversion