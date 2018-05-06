import { 
  IS_REGISTERING, 
  REGISTER_USER, 
  REGISTRATION_ERROR
} from '../actions/types'

const initialState = {
  isRegistering: false,
  userRegistered: false,
  registrationError: false
}

export default function(state = initialState, action) {
    switch (action.type) {
      case IS_REGISTERING:
        return {
          ...state,
          isRegistering: true
        }
      case REGISTER_USER:
        return {
          ...state,
          uuserRegistered: action.payload, // This bool flag is giving me issues
          isRegistering: false
        }
      case REGISTRATION_ERROR:
        return {
          ...state,
          registrationError: action.payload,
          isRegistering: false
        }
      default:
        return state
    }
}



// import { AUTHENTICATE_USER } from '../actions/types'

// const initialState = {
//   userAuthenticated: false
// }

// export default function(state = initialState, action) {
//     switch (action.type) {
//       case AUTHENTICATE_USER:
//         return {
//           userAuthenticated: action.payload
//         }
//       default:
//         return state
//     }
// }