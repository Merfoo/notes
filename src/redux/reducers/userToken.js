import { SET_USER_TOKEN } from "../actionTypes";

export default function(state = null, action) {
    switch (action.type) {
        case SET_USER_TOKEN:
            return action.payload.userToken;
        default:
            return state;
    }
};
