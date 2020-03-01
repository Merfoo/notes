import { LOGIN_USER } from "../actionTypes";

export default function(state = null, action) {
    switch (action.type) {
        case LOGIN_USER:
            return action.username;
        default:
            return state;
    }
};
