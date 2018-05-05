import { GET_PROFIT_LOSS_TRANSACTION_LIST } from '../actions/types'

export default function(state = null, action) {
    switch (action.type) {
      case GET_PROFIT_LOSS_TRANSACTION_LIST:
        return action.payload.data
      default:
        return state
    }
}