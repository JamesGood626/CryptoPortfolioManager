import axios from 'axios'


// STILL NEEDS TO BE HEAVILY TESTED
const extractCrypto = {
  requestUntilFulfilled: async function (start, limit, api_base_url, userCryptos=false, cryptoMatchList=false, missingCryptoList=false) {
    const queryOptions = `?start=${ start }&limit=${ limit }`
    const response = await axios.get(`${ api_base_url }${ queryOptions }`)
    const apiResponseData = response.data

    // console.log("THESE ARE THE ARGS PASSED INTO requestUntilFulfilled:")
    // console.log(userCryptos, cryptoMatchList, missingCryptoList)

    // const userCryptosTickerList = this.returnUserCryptosTickerList(userCryptos, missingCryptoList)
    const symbolApiDataList = this.returnApiSymbolDataList(apiResponseData)
    const indexPositions = this.returnIndexPositions(symbolApiDataList, userCryptos, missingCryptoList)
    const filteredMatchedCryptos = this.returnFilteredMatchedCryptos(indexPositions, apiResponseData, userCryptos, missingCryptoList)
    const missingCryptoPositions = this.returnMissingCryptoPositions(indexPositions)
      
    if (missingCryptoPositions.length > 0) {
      missingCryptoList = this.returnMissingCryptoList(userCryptos, missingCryptoList, missingCryptoPositions)
      start += 50
      if(!cryptoMatchList) {
        return this.requestUntilFulfilled(start, limit, api_base_url, null, filteredMatchedCryptos, missingCryptoList)
      }
      else {
        const joinedCryptoMatchLists = cryptoMatchList.concat(filteredMatchedCryptos)
        return this.requestUntilFulfilled(start, limit, api_base_url, null, joinedCryptoMatchLists, missingCryptoList)
      }
    }
    else {
      const joinedCryptoMatchLists = cryptoMatchList.concat(filteredMatchedCryptos)
      // const filteredPropertyValues = this.returnFilteredPropertyValues(joinedCryptoMatchLists)
      return joinedCryptoMatchLists
    }
  },
  // returnUserCryptosTickerList: function (userCryptos, missingCryptoList) {
  //   // Takes in the user's Crypto Asset List from redux store and creates an
  //   // array of the tickers for comparison with the coinmarketapi crypto symbols
  //   if (!missingCryptoList) {
  //     // Thinking about ditching this entirely and just using obj.ticker in the returnIndexPositions
  //     var tickerList = userCryptos.map(obj => {
  //       return obj.ticker
  //     })
  //   }
  //     return tickerList
  // },
  returnApiSymbolDataList: function (apiResponseData) {
    // Creates an array of the coinmarketapi crypto symbols
    // for comparison against the user's crypto ticker list
    const symbolList = apiResponseData.map(obj => {
      return obj.symbol
    })
    return symbolList
  },
  returnIndexPositions: function (symbolApiDataList, userCryptos, missingCryptoList) {
    // Map through the user cryptos to obtain which still require the coinmarketapi data
    // Obtaining this position enables quickly finding the position of the object in the
    // API response array.
    // Remember you changed this from taking userCryptoTickerList to just tickerList
    if(!missingCryptoList) {
      var indexPositions = userCryptos.map(crypto => {
        return symbolApiDataList.indexOf(crypto.ticker)
      })
    }
    else {
      var indexPositions = missingCryptoList.map(crypto => {
        return symbolApiDataList.indexOf(crypto.ticker)
      })
    }
    return indexPositions
  },
  returnFilteredMatchedCryptos: function (indexPositions, apiResponseData, userCryptos, missingCryptoList) {
    // Filters through the apiResponseData array to obtain the necessary
    // data as specified by the userCryptosTickerList and the derived indexPositions

    // I STILL NEED TO TEST THIS FUNCTION'S RETURN VALUE, AS WELL AS THE OTHERS BELOW (Omitting mergeCryptoObjects, as I've already tested it)
    // console.log("THESE ARE THE ARGS PASSED INTO returnFilteredMatchedCryptos:")
    // console.log("indexPositions: ", indexPositions)
    // console.log("apiResponseData: ", apiResponseData)
    // console.log("userCryptos: ", userCryptos)
    // console.log("missingCryptoList: ", missingCryptoList)

    const filteredMatchedCryptos = indexPositions.reduce((acc, curr, i) => {
      if (apiResponseData[curr] !== undefined) {
        var newMergedCryptoObj
        if (userCryptos) {
          newMergedCryptoObj = this.mergeCryptoObjects(userCryptos, apiResponseData, curr, i)
          acc.push(newMergedCryptoObj)
        }
        else if (missingCryptoList) {
          newMergedCryptoObj = this.mergeCryptoObjects(missingCryptoList, apiResponseData, curr, i)
          acc.push(newMergedCryptoObj)
        }
      }
      return acc
    }, [])
    // console.log("The Output from returnFilteredMatchedCryptos:")
    // console.log(filteredMatchedCryptos)
    return filteredMatchedCryptos
  },
  returnMissingCryptoPositions: function (indexPositions) {
    // The indexOf operator returns -1 for any elements in the array for which
    // there wasn't a match in the apiSymbolDataList against the userCryptosTickerList
    // We use the position of the -1 in the array to determine which ticker in the
    // userCryptosTickerList still needs to be matched with a coinmarketapi data object.
    const missingCryptoPositions = indexPositions.reduce((acc, curr, i) => {
      if (curr === -1) {
        acc.push(i)
      }
      return acc
    }, [])
    return missingCryptoPositions
  },
  returnMissingCryptoList: function (userCryptos, missingCryptoList, missingCryptoPositions) {
    // If this is the first run through of requestUntilFulfilled, then missingCryptoList will be false.
    // In that case the userCryptoTickerList will contain the missing cryptos.
    // Subsequent recursive calls will result in the missing cryptos being obtained from missingCryptoList
    // which will create the new missingCryptoList for subsequent invocations of requestUntilFulfilled.
    const missingCryptos = missingCryptoPositions.map(position => {
      return userCryptos ? userCryptos[position] : missingCryptoList[position] 
    })
    // console.log("THESE ARE THE MISSING CRYPTOS")
    // console.log(userCryptos)
    // console.log(missingCryptoList)
    return missingCryptos
  },
  returnFilteredPropertyValues: function (joinedCryptoMatchLists) {
    const desiredProperties = ['symbol', 'price_usd', 'price_btc', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d']
    const filteredPropertyValues = joinedCryptoMatchLists.map(cryptoObj => this.filter(desiredProperties, cryptoObj))
    // console.log(filteredPropertyValues)
    return filteredPropertyValues
  },
  filter: function (desiredProperties, cryptoObj) {
    const singleFilteredObj = desiredProperties.reduce((acc, curr) => {
      acc[curr] = cryptoObj[curr]
      return acc
    }, {})
    return singleFilteredObj
  },
  // this function really needs to be tested to ensure proper output occurs
  // And going to need to put some realistic prices in here
  mergeCryptoObjects: function(cryptoList, apiResponseData, position, i) {
    // apiResponseData[position] and CryptoList[i] appropriately return matching coinmarketapi crypto data
    // and user crypto data to be merged in this function.
    let mergedCryptoObj = {}

    let price_usd = parseFloat(apiResponseData[position].price_usd)
    let price_btc = parseFloat(apiResponseData[position].price_btc)

    mergedCryptoObj.ticker = cryptoList[i].ticker
    mergedCryptoObj.quantity = cryptoList[i].quantity
    mergedCryptoObj.initial_investment_fiat = cryptoList[i].initial_investment_fiat
    mergedCryptoObj.initial_investment_btc = cryptoList[i].initial_investment_btc
    mergedCryptoObj.current_price_fiat = price_usd
    mergedCryptoObj.current_price_btc = price_btc
    mergedCryptoObj.percent_change_1h = apiResponseData[position].percent_change_1h
    mergedCryptoObj.percent_change_24h = apiResponseData[position].percent_change_24h
    mergedCryptoObj.percent_change_7d = apiResponseData[position].percent_change_7d

    let totalPriceFiat = cryptoList[i].quantity * price_usd
    let totalPriceBtc = cryptoList[i].quantity * price_btc
    let gainLossFiat = totalPriceFiat - cryptoList[i].initial_investment_fiat
    let gainLossBtc = totalPriceBtc - cryptoList[i].initial_investment_btc
    let gainLossPercentageFiat = gainLossFiat/cryptoList[i].initial_investment_fiat

    mergedCryptoObj.gain_loss_fiat = gainLossFiat.toFixed(6)
    mergedCryptoObj.gain_loss_btc = gainLossBtc.toFixed(6)
    mergedCryptoObj.gain_loss_percentage = gainLossPercentageFiat.toFixed(6)

    return mergedCryptoObj
  }
}

export default extractCrypto

// Need to pull these values off of the objects returned in the filteredCryptos array
    // percent_change_1h: "-0.0"
    // percent_change_7d: "-0.99"
    // percent_change_24h: "1.95"
    // price_btc: "0.00002178"
    // price_usd: "0.151336"