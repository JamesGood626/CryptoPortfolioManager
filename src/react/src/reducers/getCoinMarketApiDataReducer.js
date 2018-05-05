import { GET_COIN_MARKET_API_DATA } from '../actions/types'

export default function(state = null, action) {
    switch (action.type) {
      case GET_COIN_MARKET_API_DATA:
        return action.payload
      default:
        return state
    }
}