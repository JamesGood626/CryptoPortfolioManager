import { 
  IS_AUTHENTICATING, 
  AUTHENTICATE_USER, 
  AUTHENTICATION_ERROR
} from '../actions/types'

const initialState = {
  isAuthenticating: false,
  userAuthenticated: false,
  authenticationError: false
}

export default function(state = initialState, action) {
    switch (action.type) {
      case IS_AUTHENTICATING:
        return {
          ...state,
          isAuthenticating: true
        }
      case AUTHENTICATE_USER:
        return {
          ...state,
          userAuthenticated: action.payload,
          isAuthenticating: false
        }
      case AUTHENTICATION_ERROR:
        return {
          ...state,
          authenticationError: action.payload,
          isAuthenticating: false
        }
      default:
        return state
    }
}