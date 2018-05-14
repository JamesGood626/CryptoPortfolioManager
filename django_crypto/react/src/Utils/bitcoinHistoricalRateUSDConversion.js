// Just need to test this to ensure that correct values are being returned
const bitcoinHistoricalRateUSDConversion = {
  getFeeBTC: function(rate, fee) {
    return rate * fee
  },
  getPriceBTC: function(rate, price) {
    return rate * price
  }
}

export default bitcoinHistoricalRateUSDConversion