import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";

export const loginUser = (userToken, username) => ({
    type: LOGIN_USER,
    userToken,
    username
});

export const logoutUser = () => ({
    type: LOGOUT_USER
});
