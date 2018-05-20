import { ADD_NEW_CRYPTO_ERR } from '../actions/types'

export default function(state = false, action) {
    switch (action.type) {
      case ADD_NEW_CRYPTO_ERR:
        return action.payload
      default:
        return state
    }
}