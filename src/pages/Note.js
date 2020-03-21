/** @jsx jsx */

import { useEffect, useState } from "react";
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";
import { useSelector } from "react-redux";

import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';

import { getTimeAgoString, getSlugId } from "../util";

const styles = css`
    a {
        text-decoration: none;
        color: black;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .title {
        margin-bottom: 10px;
    }

    .is-private {
        color: grey;
    }

    .details {
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

    .note-body {
        white-space: pre-wrap;
    }
`;

const GET_NOTE = gql`
    query GetNote($slugId: String!) {
        getNote(slugId: $slugId) {
            slug
            title
            body
            isPrivate
            createdAt
            createdBy {
                username
            }
        }
    }
`;

function Note() {
    const history = useHistory();
    const location = useLocation();
    const { id } = useParams();
    const [ loadingMessage, setLoadingMessage ] = useState("Loading note");

    const slugId = getSlugId(id);

    const { data, loading, error } = useQuery(GET_NOTE, {
        variables: { slugId },
        fetchPolicy: "no-cache"
    });

    const username = useSelector(state => state.username);

    let isOwner = false;
    let timeAgo = "";
    let noteData = null;

    if (data) {
        noteData = data.getNote;
        isOwner = username === noteData.createdBy.username;
        timeAgo = getTimeAgoString(new Date(noteData.createdAt));
    }

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading note", error);

    useEffect(() => {
        if (noteData) {
            const noteUrl = `/notes/${noteData.slug}`;

            if (location.pathname !== noteUrl)
                history.replace(noteUrl);
        }

    // ignore complaints about "history" being a missing dependancy in useEffect
    // eslint-disable-next-line
    }, [noteData, location.pathname]);

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    return (
        <div css={styles}>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {noteData ? (
                <animated.div style={fadeInProps}>
                    <div className="header">
                        <h2 className="title">{noteData.title}</h2>
                        <p className="is-private" hidden={!isOwner}>{noteData.isPrivate ? "Private" : "Public" }</p>
                    </div>
                    <div className="details">
                        {isOwner ?
                            <p><NavLink to={`/notes/${noteData.slug}/edit`} className="editable">Edit</NavLink></p>
                        :
                            <p>Creator <NavLink to={`/users/${noteData.createdBy.username}`} className="username">{noteData.createdBy.username}</NavLink></p>
                        }
                        <p>{timeAgo}</p>
                    </div>
                    <div className="note-body">{noteData.body}</div>
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