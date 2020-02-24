/** @jsx jsx */

import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

function Signup() {
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

    const SIGNUP = gql`
        mutation Signup($email: String!, $username: String!, $password: String!) {
            signup(email: $email, username: $username, password: $password) {
                token
                user {
                    email
                    username
                }
            }
        }
    `;

    const [signup, { data, loading, error }] = useMutation(SIGNUP);

    const { register, handleSubmit, errors, watch } = useForm();

    const onSubmit = ({ email, username, password }) => {
        console.log("on submit");
        console.log(email, username, password);
        signup({ variables: { email, username, password } });
    };

    console.log("Signup Data");
    console.log(data);

    console.log("loading");
    console.log(loading);

    console.log("error");
    console.log(error);

    return (
        <div css={styles}>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-section">
                    <label>Email</label>
                    <input
                        name="email"
                        ref={register({
                            required: "Required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    <div className="error-message">
                        {errors.email && errors.email.message}
                    </div>
                </div>
                <div className="input-section">
                    <label>Username</label>
                    <input
                        name="username"
                        ref={register({
                            required: "Required"
                        })}
                    />
                    <div className="error-message">
                        {errors.username && errors.username.message}
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
                <div className="input-section">
                    <label>Verify Password</label>
                    <input
                        name="password_verify"
                        type="password"
                        ref={register({
                            required: "Required",
                            validate: (value) => { return value === watch("password") || "Passwords don't match" }
                        })} 
                    />
                    <div className="error-message">
                        {errors.password_verify && errors.password_verify.message}
                    </div>
                </div>
                <input type="submit" />
            </form>
        </div>
    );
}

export default Signup;
