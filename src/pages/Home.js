/** @jsx jsx */

import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import NotePreview from "../components/NotePreview";

const styles = css`
`;

const GET_NOTES = gql`
    {
        notes(orderBy: createdAt_DESC) {
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
    const { loading, error, data } = useQuery(GET_NOTES);

    let notes = [];

    if (!loading && !error) {
        notes = data.notes.notes;

        notes = notes.map(note => ({
            titleId: note.titleId,
            title: note.title,
            createdAt: note.createdAt,
            username: note.createdBy.username
        }));
    }

    if (error)
        console.log("Error loading notes", error);

    return (
        <div css={styles}>
            <h2>Recent Notes</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                notes.map(note => <NotePreview key={note.titleId} {...note} />)
            )}
            {error && <div>Error loading notes :(</div>}
        </div>
    );
}

export default Home;
