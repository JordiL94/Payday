import { userService } from "../services/user.service";

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
    users: []
}
export function userReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case 'SET_USER':
            newState = { ...state, loggedinUser: { ...action.user } }
            break;
        case 'LOGOUT':
            newState = { ...state, loggedinUser: null }
            break;
        case 'SET_USERS':
            newState = { ...state, users: [...action.users] }
            break
        case 'REMOVE_USER':
            newState = { ...state, users: state.users.filter(user => user._id !== action.userId) }
            break
        case 'UPDATE_USER':
            newState = {
                ...state, users: state.users.map(currUser => {
                    return (currUser._id === action.user._id) ? action.user : currUser
                })
            }
            break
        case 'ADD_USERS':
            newState = { ...state, users: [...state.users, action.toy] }
            break
        default:
            return newState
    }
    return newState;
}