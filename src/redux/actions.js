import { SET_USER_TOKEN } from "./actionTypes";

export const setUserToken = userToken => ({
    type: SET_USER_TOKEN,
    payload: { userToken }
});
