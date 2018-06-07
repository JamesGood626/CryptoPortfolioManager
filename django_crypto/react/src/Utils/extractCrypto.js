import axios from 'axios'


const extractCrypto = {
  requestUntilFulfilled: async function (start, limit, api_base_url, userCryptos=false, cryptoMatchList=false, missingCryptoList=false) {
    const queryOptions = `?start=${ start }&limit=${ limit }`
    let response
    try {
      response = await axios.get(`${ api_base_url }${ queryOptions }`)
    } catch (e) {
      return e
    }
    const apiResponseData = response.data

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
      if (typeof cryptoMatchList === "Array") {
        const joinedCryptoMatchLists = cryptoMatchList.concat(filteredMatchedCryptos)
        return joinedCryptoMatchLists
      }
      else {
        return filteredMatchedCryptos
      }
    }
  },
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
    return missingCryptos
  },
  filter: function (desiredProperties, cryptoObj) {
    const singleFilteredObj = desiredProperties.reduce((acc, curr) => {
      acc[curr] = cryptoObj[curr]
      return acc
    }, {})
    return singleFilteredObj
  },
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
    // let totalPriceBtc = cryptoList[i].quantity * price_btc
    let gainLossFiat = totalPriceFiat - cryptoList[i].initial_investment_fiat
    console.log('gainLossFiat: ', gainLossFiat)
    // let gainLossBtc = totalPriceBtc - cryptoList[i].initial_investment_btc
    let gainLossPercentageFiat = gainLossFiat/cryptoList[i].initial_investment_fiat
    console.log('gainLossPercentageFiat: ', gainLossPercentageFiat)

    mergedCryptoObj.gain_loss_fiat = gainLossFiat.toFixed(2)
    //mergedCryptoObj.gain_loss_btc = gainLossBtc.toFixed(6)
    mergedCryptoObj.gain_loss_percentage = (gainLossPercentageFiat*100).toFixed(2)

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