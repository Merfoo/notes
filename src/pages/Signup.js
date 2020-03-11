/** @jsx jsx */

import { useState } from "react";
import { useHistory } from "react-router-dom";
import { css, jsx } from "@emotion/core";

import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { capitalize, validateEmail } from "../util";

import NiceButton from "../components/NiceButton";

const styles = css`
    .input-section {
        height: 100px;

        display: flex;
        flex-direction: column;

        label {
            margin-bottom: 5px;
        }
        
        input {
            height: 30px;
        }

        .error-message {
            color: red;
        }
    }

    .error-box {
        color: white;

        margin-top: 50px;
        padding: 10px;
        border-radius: 3px;

        background-color: rgba(255, 0, 0, 0.5);
    }
`;

const SIGNUP = gql`
    mutation Signup($email: String!, $username: String!, $password: String!) {
        signup(email: $email, username: $username, password: $password) {
            token
            user {
                username
            }
        }
    }
`;

function parseMutationError(e) {
    let error = {
        unknown: false,
        email: false,
        username: false,
        message: ""
    };

    if (!e)
        return error;

    error.unknown = true;
    error.message = e.message;

    const split = e.message.split(" ");

    if (split.length > 0) {
        const field = split[split.length - 1];

        if (field in error) {
            error[field] = true;
            error.message = `${capitalize(field)} already taken`;
            error.unknown = false;
        }
    }

    return error;
}

function Signup() {
    const history = useHistory();
    const dispatch = useDispatch();

    const [signup, { loading }] = useMutation(SIGNUP);
    const [mutationError, setMutationError] = useState({
        unknown: false,
        email: false,
        username: false,
        message: ""
    });

    const [isFirstAttempt, setIsFirstAttempt] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    let emailError = "";
    let usernameError = "";
    let passwordError = "";
    let passwordVerifyError = "";

    if (!email)
        emailError = "Required";

    else if (!validateEmail(email))
        emailError = "Invalid email";

    else if (mutationError.email)
        emailError = mutationError.message;

    if (!username)
        usernameError = "Required";

    else if (mutationError.username)
        usernameError = mutationError.message;

    if (!password)
        passwordError = "Required";

    if (!passwordVerify)
        passwordVerifyError = "Required";

    else if (passwordVerify !== password)
        passwordVerifyError = "Passwords do not match";

    const formError = emailError || usernameError || passwordError || passwordVerifyError;

    const updateEmail = (e) => {
        const newEmail = e.target.value;

        if (mutationError.email)
            setMutationError({ ...mutationError, email: false });

        setEmail(newEmail);
    };

    const updateUsername = (e) => {
        const newUsername = e.target.value;

        if (mutationError.username)
            setMutationError({ ...mutationError, username: false });

        setUsername(newUsername);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        setIsFirstAttempt(false);

        if (formError)
            return;

        signup({ variables: { email, username, password } })
            .then((res) => {
                const { token, user } = res.data.signup;
                dispatch(loginUser(token, user.username));

                history.push("/");
            })
            .catch((e) => {
                console.log("signup rejected");
                console.log(e);

                setMutationError(parseMutationError(e));
            });
    };

    return (
        <div css={styles}>
            <h2>Signup</h2>
            <form onSubmit={onSubmit}>
                <div className="input-section">
                    <label>Email</label>
                    <input value={email} disabled={loading} onChange={updateEmail} />
                    <div className="error-message">
                        {!isFirstAttempt && emailError}
                    </div>
                </div>
                <div className="input-section">
                    <label>Username</label>
                    <input value={username} disabled={loading} onChange={updateUsername} />
                    <div className="error-message">
                        {!isFirstAttempt && usernameError}
                    </div>
                </div>
                <div className="input-section">
                    <label>Password</label>
                    <input type="password" value={password} disabled={loading} onChange={(e) => setPassword(e.target.value)} />
                    <div className="error-message">
                        {!isFirstAttempt && passwordError}
                    </div>
                </div>
                <div className="input-section">
                    <label>Verify Password</label>
                    <input type="password" value={passwordVerify} disabled={loading} onChange={(e) => setPasswordVerify(e.target.value)} />
                    <div className="error-message">
                        {!isFirstAttempt && passwordVerifyError}
                    </div>
                </div>
                <NiceButton type="submit" disabled={loading} isLoading={loading}>Signup</NiceButton>
            </form>
            <div className="error-box" hidden={!mutationError.unknown}>
                {mutationError.message}
            </div>
        </div>
    );
}

export default Signup;
