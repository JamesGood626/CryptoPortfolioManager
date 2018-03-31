import { ADD_NEW_CRYPTO } from '../actions/types'

export default function(state = {}, action) {
    switch (action.type) {
      case ADD_NEW_CRYPTO:
        return true 
      default:
        return state
    }
}