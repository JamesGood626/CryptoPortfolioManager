import { GET_SELL_ORDER_LIST } from '../actions/types'

export default function(state = {}, action) {
    switch (action.type) {
      case GET_SELL_ORDER_LIST:
        return action.payload.data
      default:
        return state
    }
}