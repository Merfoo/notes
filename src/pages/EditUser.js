/** @jsx jsx */

import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { validateEmail } from "../util";

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
            margin-left: 0;
        }

        .error-message {
            color: red;
        }
    }

    .buttons-container {
        margin-top: 30px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .delete-button {
        background-color: rgba(255, 0, 0, 0.5);
    }

    .error-container {
        color: white;

        margin-top: 50px;
        padding: 10px;
        border-radius: 3px;

        background-color: rgba(255, 0, 0, 0.5);
    }
`;

function parseMutationError(e) {
    const split = e.message.split(" ");
    const field = split[split.length - 1];

    if (field === "email") {
        return {
            unknown: false,
            email: true,
            message: "Email already taken" 
        };
    }

    return {
        unknown: true,
        email: false,
        message: e.message
    };
}

function EditUser() {
    const { id: username } = useParams();
    const [loadingMessage, setLoadingMessage] = useState("Loading user");
    const history = useHistory();

    const GET_USER = gql`
        {
            getUser(username: "${username}") {
                email
                username
            }
        }
    `;

    const EDIT_USER = gql`
        mutation EditUser($email: String!) {
            updateUser(username: "${username}", email: $email) {
                username
            }
        }
    `;

    const DELETE_USER = gql`
        mutation {
            deleteUser(username: "${username}") {
                username
            }
        }
    `;

    const { loading, error, data } = useQuery(GET_USER, { fetchPolicy: "no-cache" });
    const [editUser, { loading: editLoading }] = useMutation(EDIT_USER);
    const [deleteUser, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_USER);
    const [mutationError, setMutationError] = useState({
        unknown: false,
        email: false,
        message: ""
    });

    let userData = null;

    if (data)
        userData = data.getUser;

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading user", error);

    const [email, setEmail] = useState("");

    let emailError = "";

    if (!email)
        emailError = "Required";

    else if (!validateEmail(email))
        emailError = "Invalid email";

    else if (mutationError.email)
        emailError = mutationError.message;

    useEffect(() => {
        if (userData && userData.email)
            setEmail(userData.email);
    }, [userData]);

    const updateEmail = (e) => {
        if (mutationError.email)
            setMutationError({ ...mutationError, email: false });            

        setEmail(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (emailError)
            return;

        editUser({ variables: { email } })
            .then((res) => {
                history.push("/profile");
            })
            .catch((e) => {
                console.log("Edit user failed");
                console.log(e);

                setMutationError(parseMutationError(e));
            });
    }

    const deleteOnClick = () => {
        if (window.confirm("Delete account?")) {
            deleteUser()
                .then((res) => {
                    history.push("/");
                })
                .catch((e) => {
                    console.log("User deleting failed");
                    console.log(e);
                });
        }
    };

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    return (
        <div css={styles}>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {userData ? (
                <animated.div style={fadeInProps}>
                    <h2>{userData.username}</h2>
                    <form onSubmit={onSubmit}>
                    <div className="input-section">
                        <label>Email</label>
                        <input value={email} onChange={updateEmail} disabled={editLoading || deleteLoading} />
                        <div className="error-message">
                            {emailError}
                        </div>
                    </div>
                    <div className="buttons-container">
                        <NiceButton type="submit" isLoading={editLoading} disabled={editLoading || deleteLoading}>Save</NiceButton>
                        <NiceButton type="button" className="delete-button" onClick={deleteOnClick} isLoading={deleteLoading} disabled={editLoading || deleteLoading}>Delete</NiceButton>
                    </div>
                    </form>
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    <h2>User not found</h2>
                </animated.div>
            )}
            <div className="error-container" hidden={!(error || mutationError.unknown || deleteError)}>
                {error && <div>Error loading user</div>}
                {mutationError.unknown && <div>{mutationError.message}</div>}
                {deleteError && <div>Error deleting account</div>}
            </div>
        </div>
    );
}

export default EditUser;
