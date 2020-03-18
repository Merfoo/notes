/** @jsx jsx */

import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import NotePreview from "../components/NotePreview";

const styles = css`
    a {
        text-decoration: none;
        color: black;

        :hover {
            text-decoration: underline;
        }
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .logout-button {
        padding: 10px 20px;
        border-radius: 3px;
        border: none;

        :hover {
            background-color: darkgrey;
            cursor: pointer;
        }
    }

    .details {
        margin-top: 10px;
    }

    .edit-link {
        display: inline-block;
        margin-top: 10px;
    }

    .notes {
        margin-top: 20px;
    }
`;

function Profile() {
    const username = useSelector(state => state.username);
    const history = useHistory();
    const dispatch = useDispatch();

    const GET_USER = gql`
        {
            getUser(username: "${username}") {
                email
                createdAt
                notes {
                    titleId
                    title
                    createdAt
                    isPrivate
                }
            }
        }
    `;

    const [loadingMessage, setLoadingMessage] = useState("Loading profile");
    const { loading, error, data } = useQuery(GET_USER, { fetchPolicy: "no-cache" });

    let userData = null;
    let email = "";
    let createdAt = "";
    let notes = [];

    if (!loading && !error) {
        userData = data.getUser;

        if (userData) {
            email = userData.email
            createdAt = userData.createdAt;
            notes = userData.notes;

            notes = notes.map((note) => ({
                titleId: note.titleId,
                title: note.title,
                createdAt: note.createdAt,
                isPrivate: note.isPrivate
            }));

            // Default is ordered in asc creation
            notes.reverse();
        }
    }

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading profile", error);

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    const logout = () => {
        dispatch(logoutUser());
        
        history.push("/");
    };

    if (!username)
        return <div>Please login to view your profile</div>;

    return (
        <div css={styles}>
            <div className="header">
                <h2>{username}</h2>
                <button className="logout-button" onClick={logout}>Logout</button>
            </div>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {userData ? (
                <animated.div className="details" style={fadeInProps}>
                    <div>Email: {email}</div>
                    <div>Joined: {new Date(createdAt).toLocaleDateString()}</div>
                    <NavLink to={`/users/${username}/edit`} className="edit-link">Edit</NavLink>

                    <div className="notes">
                        {notes.map(note => <NotePreview key={note.titleId} {...note} showIsPrivate={true} editable={true} />)}
                    </div>
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    <div>Profile information not found</div>
                </animated.div>
            )}
            {error && <div>Error loading profile information :(</div>}
        </div>
    );
}

export default Profile;
