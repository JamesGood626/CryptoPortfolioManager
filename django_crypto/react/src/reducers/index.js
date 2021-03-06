import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import authenticationReducer from './authenticationReducer'
import registrationReducer from './registrationReducer'
import submitInProgressReducer from './submitInProgressReducer'
import addNewCryptoSuccessReducer from './addNewCryptoSuccessReducer'
import addNewCryptoErrReducer from './addNewCryptoErrReducer'
import getBuyOrderListReducer from './getBuyOrderListReducer'
import getSellOrderListReducer from './getSellOrderListReducer'
import symbolListReducer from './symbolListReducer'
import getFiatOptionReducer from './getFiatOptionReducer'
import getUserSettingsReducer from './getUserSettingsReducer'
import getProfitLossTransactionReducer from './getProfitLossTransactionReducer'
import getRefinedProfitLossTransactionReducer from './getRefinedProfitLossTransactionReducer'
import getCryptoAssetReducer from './getCryptoAssetReducer'
import getCoinMarketApiDataReducer from './getCoinMarketApiDataReducer'

export default combineReducers({
  authentication: authenticationReducer,
  registration: registrationReducer,
  submitInProgress: submitInProgressReducer,
  addNewCryptoSuccess: addNewCryptoSuccessReducer,
  addNewCryptoErr: addNewCryptoErrReducer,
  symbolList: symbolListReducer,
  buyOrderList: getBuyOrderListReducer,
  sellOrderList: getSellOrderListReducer,
  fiatOptionList: getFiatOptionReducer,
  userSettingsList: getUserSettingsReducer,
  profitLossTransactionList: getProfitLossTransactionReducer,
  refinedProfitLossTransactionList: getRefinedProfitLossTransactionReducer,
  cryptoAssetList: getCryptoAssetReducer,
  coinMarketApiDataList: getCoinMarketApiDataReducer,
  form: formReducer
})