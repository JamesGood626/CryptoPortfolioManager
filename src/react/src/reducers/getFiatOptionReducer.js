import { GET_FIAT_OPTION_LIST } from '../actions/types'

export default function(state = [], action) {
    switch (action.type) {
      case GET_FIAT_OPTION_LIST:
        return action.payload.data
      default:
        return state
    }
}