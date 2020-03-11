/** @jsx jsx */

import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

import { useDispatch } from "react-redux";
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
            height: 25px;
            color: red;
        }
    }

    .error-container {
        color: white;

        margin-top: 50px;
        padding: 10px;
        border-radius: 3px;

        background-color: rgba(255, 0, 0, 0.5);
    }
`;

const RESET_PASSWOD = gql`
    mutation ResetPassword($resetId: String!, $password: String!) {
        resetPassword(resetId: $resetId, password: $password) {
            token,
            user {
                username
            }
        }
    }
`;

function ResetPassword() {
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();
    const { id: resetId } = useParams();
    const dispatch = useDispatch();

    const [resetPassword, { loading }] = useMutation(RESET_PASSWOD);

    const { register, handleSubmit, errors, getValues } = useForm();

    const onSubmit = ({ password }) => {
        setErrorMessage("");

        resetPassword({ variables: { resetId, password } })
            .then((res) => {
                const resetPasswordData = res.data.resetPassword;

                if (resetPasswordData) {
                    const { token, user } = res.data.resetPassword;
                    dispatch(loginUser(token, user.username));

                    history.push("/");
                }

                else
                    setErrorMessage("Invalid reset password link");
            })
            .catch((e) => {
                setErrorMessage("Error resetting password");

                console.log("reset password rejected");
                console.log(e);
            });
    };

    return (
        <div css={styles}>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <div className="input-section">
                    <label>Verify Password</label>
                    <input
                        name="verifyPassword"
                        type="password"
                        ref={register({
                            required: "Required",
                            validate: (value) => {
                                if (value === getValues()["password"])
                                    return true;

                                return "The passwords do not match";
                            }
                        })}
                        disabled={loading}
                    />
                    <div className="error-message">
                        {errors.verifyPassword && errors.verifyPassword.message}
                    </div>
                </div>
                <NiceButton type="submit" disabled={loading} isLoading={loading}>Reset</NiceButton>
            </form>
            <div className="error-container" hidden={!errorMessage}>
                {errorMessage}
            </div>
        </div>
    );
}

export default ResetPassword;
