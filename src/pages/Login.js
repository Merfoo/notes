/** @jsx jsx */

import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

function Login() {
    const styles = css`
        .input-section {
            height: 100px;

            display: flex;
            flex-direction: column;

            label {
                margin-bottom: 5px;
            }

            input {
                height: 25px;
            }

            .error-message {
                color: red;
            }
        }
    `;

    const LOGIN = gql`
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                user {
                    email
                    username
                }
            }
        }
    `;

    const [login, { data, loading, error }] = useMutation(LOGIN);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ email, password }) => {
        console.log("on submit");
        console.log(email, password);
        login({ variables: { email, password } });
    };

    console.log("Login Data");
    console.log(data);

    console.log("loading");
    console.log(loading);

    console.log("error");
    console.log(error);

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
                    />
                    <div className="error-message">
                        {errors.password && errors.password.message}
                    </div>
                </div>
                <input type="submit" />
            </form>
        </div>
    );
}

export default Login;
