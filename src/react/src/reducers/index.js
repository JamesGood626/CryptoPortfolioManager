import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import addNewCryptoReducer from './addNewCryptoReducer'
import getBuyOrderListReducer from './getBuyOrderListReducer'
import getSellOrderListReducer from './getSellOrderListReducer'
import symbolListReducer from './symbolListReducer'
import getFiatOptionReducer from './getFiatOptionReducer'
import getUserSettingsReducer from './getUserSettingsReducer'

export default combineReducers({
  addNewCrypto: addNewCryptoReducer,
  symbolList: symbolListReducer,
  buyOrderList: getBuyOrderListReducer,
  sellOrderList: getSellOrderListReducer,
  fiatOptionList: getFiatOptionReducer,
  userSettingsList: getUserSettingsReducer,
  form: formReducer
})