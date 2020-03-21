/** @jsx jsx */

import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/react-hooks";

import NotePreview from "../components/NotePreview";

const styles = css`
    .search-bar {
        height: 35px;
        width: 100%;

        margin-bottom: 25px;
        padding: 5px;
    }
`;

const GET_PUBLIC_NOTES = gql`
    query GetPublicNotes($filter: String!) {
        getPublicNotes(orderBy: createdAt_DESC, filter: $filter) {
            notes {
                slug
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

const INIT_LOADING_MESSAGE = "Loading notes";

function Home() {
    const [loadingMessage, setLoadingMessage] = useState(INIT_LOADING_MESSAGE);
    const [searchText, setSearchText] = useState("");
    const [getPublicNotes, { loading, error, data }] = useLazyQuery(GET_PUBLIC_NOTES, { fetchPolicy: "no-cache" });

    useEffect(() => {
        setLoadingMessage(INIT_LOADING_MESSAGE);
        getPublicNotes({ variables: { filter: searchText } });
    }, [getPublicNotes, searchText]);

    let notes = [];

    if (data) {
        notes = data.getPublicNotes.notes;

        notes = notes.map(note => ({
            slug: note.slug,
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
            <input type="search" placeholder="Search" className="search-bar" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            {loading ? (
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    {notes.length > 0 ? (
                        notes.map(note => <NotePreview key={note.slug} {...note} />)
                    ) : (
                        <h3>No notes found :(</h3>
                    )}
                </animated.div>
            )}
            {error && <div>Error loading notes :(</div>}
        </div>
    );
}

export default Home;
