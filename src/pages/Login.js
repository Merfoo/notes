/** @jsx jsx */

import { NavLink, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

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

    .forgot_password {
        display: block;

        margin-top: 25px;

        color: black;
    }

    .invalid-credentials {
        color: white;

        margin-top: 50px;
        padding: 10px;
        border-radius: 3px;

        background-color: rgba(255, 0, 0, 0.5);
    }
`;

const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                username
            }
        }
    }
`;

function Login() {
    const history = useHistory();
    const dispatch = useDispatch();

    const username = useSelector(state => state.username);

    const [login, { loading, error }] = useMutation(LOGIN);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ email, password }) => {
        login({ variables: { email, password } })
            .then((res) => {
                const { token, user } = res.data.login;
                dispatch(loginUser(token, user.username));

                history.push("/");
            })
            .catch((e) => {
                console.log("login rejected");
                console.log(e);
            });
    };

    if (username)
        return <div>You are already logged in</div>;

    return (
        <div css={styles}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-section">
                    <label>Email</label>
                    <input
                        name="email"
                        ref={register({
                            required: "Required"
                        })}
                        disabled={loading}
                    />
                    <div className="error-message">
                        {errors.email && errors.email.message}
                    </div>
                </div>
                <div className="input-section">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        ref={register({
                            required: "Required"
                        })}
                        disabled={loading}
                    />
                    <div className="error-message">
                        {errors.password && errors.password.message}
                    </div>
                </div>
                <NiceButton type="submit" disabled={loading} isLoading={loading}>Login</NiceButton>
                <NavLink to="/account/forgot_password" className="forgot_password">Forgot Password?</NavLink>
            </form>
            <div className="invalid-credentials" hidden={!error}>
                Invalid Credentials
            </div>
        </div>
    );
}

export default Login;
