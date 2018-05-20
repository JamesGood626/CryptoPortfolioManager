import { SUBMIT_IN_PROGRESS } from '../actions/types'

export default function(state = false, action) {
    switch (action.type) {
      case SUBMIT_IN_PROGRESS:
        return action.payload
      default:
        return state
    }
}