import { ADD_NEW_CRYPTO_SUCCESS } from '../actions/types'

export default function(state = false, action) {
    switch (action.type) {
      case ADD_NEW_CRYPTO_SUCCESS:
        return action.payload
      default:
        return state
    }
}