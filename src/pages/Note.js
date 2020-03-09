/** @jsx jsx */

import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";
import { useSelector } from "react-redux";

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

import { getTimeAgoString } from "../util";

const styles = css`
    a {
        text-decoration: none;
        color: black;
    }

    .note-container {
        margin-bottom: 20px;
        padding: 10px;
    }

    .note-title {
        margin-bottom: 10px;
    }

    .note-details {
        margin-bottom: 25px;

        color: grey;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        p {
            margin-top: 0;
        }
    }

    .editable, .username {
        :hover {
            text-decoration: underline;
        }
    }
`;

const GET_NOTE = gql`
    query GetNote($titleId: String!) {
        getNote(titleId: $titleId) {
            title
            body
            createdAt
            createdBy {
                username
            }
        }
    }
`;

function Note() {
    const { titleId } = useParams();
    const [ loadingMessage, setLoadingMessage ] = useState("Loading note");
    const { data, loading, error } = useQuery(GET_NOTE, { variables: { titleId } } );

    let noteData = null;
    let note = {};

    if (!loading && !error) {
        noteData = data.getNote;

        if (noteData) {
            note = {
                title: noteData.title,
                body: noteData.body,
                createdAt: noteData.createdAt,
                username: noteData.createdBy.username
            }
        }
    }

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading user", error);

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    const timeAgo = getTimeAgoString(new Date(note.createdAt));

    const editable = (useSelector(state => state.username) === note.username);

    return (
        <div css={styles}>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {noteData ? (
                <animated.div style={fadeInProps}>
                    <div className="note-container">
                        <h2 className="note-title">{note.title}</h2>
                        <div className="note-details">
                            {editable ? 
                                <p><NavLink to={`/notes/${titleId}/edit`} className="editable">Edit</NavLink></p>
                            :
                                <p>Creator <NavLink to={`/users/${note.username}`} className="username">{note.username}</NavLink></p>
                            }
                            <p>{timeAgo}</p>
                        </div>
                        <div>{note.body}</div>
                    </div>
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    <h2>Note not found</h2>
                </animated.div>
            )}
            {error && <div>Error loading note :(</div>}
        </div>
    );
}



export default Note;