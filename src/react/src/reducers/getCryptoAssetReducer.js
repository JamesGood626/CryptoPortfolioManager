import { GET_CRYPTO_ASSET_LIST } from '../actions/types'

export default function(state = null, action) {
    switch (action.type) {
      case GET_CRYPTO_ASSET_LIST:
        return action.payload.data
      default:
        return state
    }
}