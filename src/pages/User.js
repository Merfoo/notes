/** @jsx jsx */

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import NotePreview from "../components/NotePreview";

const styles = css`
`;

function User() {
    const { id: username } = useParams();
    
    const GET_USER = gql`
        {
            getUser(username: "${username}") {
                createdAt
                notes {
                    titleId
                    title
                    createdAt
                }
            }
        }
    `;
    
    const [loadingMessage, setLoadingMessage] = useState("Loading user");
    const { loading, error, data } = useQuery(GET_USER);

    let userData = null;
    let createdAt = "";
    let notes = [];

    if (!loading && !error) {
        userData = data.getUser;

        if (userData) {
            createdAt = userData.createdAt;
            notes = userData.notes;

            notes = notes.map(note => ({
                titleId: note.titleId,
                title: note.title,
                createdAt: note.createdAt,
                username
            }));
        }
    }

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading user", error);

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    return (
        <div css={styles}>
            <h2>{username}</h2>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {userData ? (
                <animated.div style={fadeInProps}>
                    <p>Joined: {new Date(createdAt).toLocaleDateString()}</p>
                    {notes.map(note => <NotePreview key={note.titleId} {...note} />)}
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    <h2>User "{username}" not found</h2>
                </animated.div>
            )}
            {error && <div>Error loading user :(</div>}
        </div>
    );
}

export default User;
