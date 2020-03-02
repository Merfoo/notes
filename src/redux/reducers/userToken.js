import { LOGIN_USER, LOGOUT_USER } from "../actionTypes";

export default function(state = null, action) {
    switch (action.type) {
        case LOGIN_USER:
            return action.userToken;
        case LOGOUT_USER:
            return null;
        default:
            return state;
    }
};
