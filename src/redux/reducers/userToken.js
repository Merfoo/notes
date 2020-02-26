import { SET_USER_TOKEN } from "../actionTypes";

export default function(state = null, action) {
    switch (action.type) {
        case SET_USER_TOKEN:
            return action.userToken;
        default:
            return state;
    }
};
