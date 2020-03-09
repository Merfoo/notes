/** @jsx jsx */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

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

    .success-container {
        color: white;

        margin-top: 50px;
        padding: 10px;
        border-radius: 3px;

        background-color: #20c997;
    }
`;

const EMAIL_PASSWORD_RESET = gql`
    mutation EmailPasswordReset($email: String!) {
        emailPasswordReset(email: $email)
    }
`;

function ForgotPassword() {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [emailPasswordReset, { loading, error }] = useMutation(EMAIL_PASSWORD_RESET);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ email }) => {
        setShowSuccessMessage(false);

        emailPasswordReset({ variables: { email } })
            .then((res) => {
                const email = res.data.emailPasswordReset;

                console.log("email", email);

                setShowSuccessMessage(true);
            })
            .catch((e) => {
                console.log("email password reset rejected");
                console.log(e);
            });
    };

    return (
        <div css={styles}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-section">
                    <label>Email</label>
                    <input
                        name="email"
                        ref={register({
                            required: "Required",
                            validate: (value) => setShowSuccessMessage(false)
                        })}
                        disabled={loading}
                    />
                    <div className="error-message">
                        {errors.email && errors.email.message}
                    </div>
                </div>
                <NiceButton type="submit" disabled={loading} isLoading={loading}>Submit</NiceButton>
            </form>
            <div className="error-container" hidden={!error}>
                Error emailing password reset
            </div>
            <div className="success-container" hidden={!showSuccessMessage}>
                Password reset email sent
            </div>
        </div>
    );
}

export default ForgotPassword;
