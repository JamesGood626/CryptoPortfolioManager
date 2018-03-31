import { GET_USER_SETTINGS_LIST } from '../actions/types'

export default function(state = null, action) {
    switch (action.type) {
      case GET_USER_SETTINGS_LIST:
        return action.payload.data
      default:
        return state
    }
}