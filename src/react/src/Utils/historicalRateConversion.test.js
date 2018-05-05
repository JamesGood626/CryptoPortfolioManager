import historicalRateConversion from './historicalRateConversion'


/************* Start test getRatioDifference ***************/

const historicalDataRate = 0.00077225018501853060254923339371
const price = 0.0007429
// also used in a few other tests below
const ratioDifference = 0.03950758516426247

test('historicalRateConversion.getRatioDifference calculates and returns the ratio difference between user entered price and the api response data rate', () => {
  expect(historicalRateConversion.getRatioDifference(historicalDataRate, price)).toBe(ratioDifference)
})

/************* End test for getRatioDifference ***************/


/************* Start test getTrueHistoricalRate ***************/

const apiHistoricalRate = 0.0000694801925625243916773778
const trueHistorcalRate = 0.0000667351979376311

test('historicalRateConversion.getTrueHistoricalRate calculates and returns the true historical rate', () => {
  expect(historicalRateConversion.getTrueHistoricalRate(ratioDifference, apiHistoricalRate)).toBe(trueHistorcalRate)
})

/************* End test for getTrueHistoricalRate ***************/



// values.price / trueUSDHistoricalRate
// console.log(0.0007429 / 0.0000667351979376311) yields:
// historicalUSDPricePerUnit = 11.132056590201381


// What I calculated when getting feeUSD in instance of buyOrder
// fee = 0.05375000 ICX
// historicalUSDPricePerUnit * values.fee
// and I know why this works
// Why did I do it differently for the sell order?
// For no good reason that's why 
// - goes to show I need to test while writing new code

