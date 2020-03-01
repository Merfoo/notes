import { LOGIN_USER } from "./actionTypes";

export const loginUser = (userToken, username) => ({
    type: LOGIN_USER,
    userToken,
    username
});
