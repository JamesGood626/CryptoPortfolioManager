import { GET_SYMBOL_LIST } from '../actions/types'

export default function(state = {}, action) {
    switch (action.type) {
      case GET_SYMBOL_LIST:
        return action.payload
      default:
        return state
    }
}