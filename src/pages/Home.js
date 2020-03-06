/** @jsx jsx */

import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import NotePreview from "../components/NotePreview";

const styles = css`
`;

const GET_NOTES = gql`
    {
        getNotes(orderBy: createdAt_DESC) {
            notes {
                titleId
                title
                createdAt
                createdBy {
                    username
                }
            }
            count
        }
    }
`;

function Home() {
    const [loadingMessage, setLoadingMessage] = useState("Loading notes");
    const { loading, error, data } = useQuery(GET_NOTES);

    let notes = [];

    if (!loading && !error) {
        notes = data.getNotes.notes;

        notes = notes.map(note => ({
            titleId: note.titleId,
            title: note.title,
            createdAt: note.createdAt,
            username: note.createdBy.username
        }));
    }

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading notes", error);

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    return (
        <div css={styles}>
            <h2>Recent Notes</h2>
            {loading ? (
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    {notes.map(note => <NotePreview key={note.titleId} {...note} />)}
                </animated.div>
            )}
            {error && <div>Error loading notes :(</div>}
        </div>
    );
}

export default Home;
