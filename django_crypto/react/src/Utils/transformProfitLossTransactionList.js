const transformProfitLossTransactionList = {
  filterObjects: function(arr) {
    let groupedObj = arr.reduce((newObj, pl_transaction) => {
      if (!newObj.hasOwnProperty(pl_transaction.ticker)) {
        newObj[pl_transaction.ticker] = []
        newObj[pl_transaction.ticker].push(pl_transaction)
        return newObj
      } 
      else {
        newObj[pl_transaction.ticker].push(pl_transaction)
        return newObj
      }
    }, {})
    return this.calculateTotals(groupedObj)
    // { 
    //   EOS: [{}, {}, {}],
    //   ADA: [{}, {}, {}],
    //   BTC: [{}, {}, {}]
    // }
  },
  calculateTotals: function (groupedObj) {
    // Obtains the object property names that denote the ticker
    // then utilizes the first ticker in the list to access the first property's array
    // and pull off an object to grab the property names from to utilize in the finalArr map function.
    let groupedObjectKeys = Object.getOwnPropertyNames(groupedObj)
    let singleObjectKeys = Object.getOwnPropertyNames(groupedObj[groupedObjectKeys[0]][0])
    // console.log("HERE ARE THE SINGLE OBJECT KEYS")
    // console.log(singleObjectKeys)
    let finalArr = groupedObjectKeys.map(key => this.traverseProfitLossObjectKeys(key, singleObjectKeys, groupedObj))
    return finalArr
    // finalArr returns [{ticker: 'BTC', ...accumulatedTotals}, {ticker: 'ADA', ...accumulatedTotals}, etc...]
  },
  traverseProfitLossObjectKeys: function (key, plTransactionKeys, groupedObj) {
    let singleCryptoList = groupedObj[key]
    return singleCryptoList.reduce((acc, curr) => {
      for(let i = 1; i < plTransactionKeys.length; i++) {
        if(!acc.ticker) {
      	  acc.ticker = curr.ticker
        }
        if(!acc[plTransactionKeys[i]]) {
          acc[plTransactionKeys[i]] = curr[plTransactionKeys[i]]
        }
        else {
          acc[plTransactionKeys[i]] += curr[plTransactionKeys[i]]
        }
      }
      return acc
    }, {})
  }
}

export default transformProfitLossTransactionList

// Or I could transform it into an object with the ticker as the key, with the array of objects as
// the value.
// This will be more efficient for building the initial grouped list. And then from there I can do the
// calculations on each of the arrays, and transform it back into an array of objects

// ADA total- 400
// DENT total - 200
// BTC total - 1300
// const pl_orders = [
//   {ticker: 'ADA', quantity: 100},
//   {ticker: 'DENT', quantity: 200},
//   {ticker: 'BTC', quantity: 100},
//   {ticker: 'ADA', quantity: 300},
//   {ticker: 'BTC', quantity: 1200}
//  ]


// if(!acc.ticker) {
//       	acc.ticker = curr.ticker
//         }
//         if(!acc.quantity_sold) {
//           acc.quantity_sold = curr.quantity_sold
//         }
//         else {
//           acc.quantity_sold += curr.quantity_sold
//         }