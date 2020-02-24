/** @jsx jsx */

import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

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

    const { register, handleSubmit, errors, watch } = useForm();

    const onSubmit = ({ email, password, password_verify }) => {
        console.log(email, password, password_verify);
    };

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
