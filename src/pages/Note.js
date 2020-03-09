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
    .note-container {
        margin-bottom: 20px;
        padding: 10px;

        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        
        :hover {
            box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2);
        }
    }

    a {
        text-decoration: none;
        color: black;
    }

    .details {
        color: grey;
        display: flex;
        flex: start;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 2em;
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
                        <h2>{note.title}</h2>
                        <p>{note.body}</p>
                        <div className="details">
                            {editable ? 
                                <NavLink to={`/notes/${titleId}/edit`} className="editable">Edit</NavLink>
                            :
                                <NavLink to={`/users/${note.username}`} className="username">{note.username}</NavLink>
                            }
                            {timeAgo}
                        </div>
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