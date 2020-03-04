/** @jsx jsx */

import { css, jsx } from "@emotion/core";

import NotePreview from "../components/NotePreview";

const styles = css`
`;

const notes = [
    {
        titleId: "asdf",
        title: "this is a title",
        username: "merfoo",
        createdAt: "10/20/30"
    },
    {
        titleId: "mmmm",
        title: "tadfgsad",
        username: "merfoo",
        createdAt: "10/20/02"
    },
    {
        titleId: "hellllooo",
        title: "a title",
        username: "george",
        createdAt: "13/20/21"
    },
]

function Home() {

    return (
        <div css={styles}>
            <h2>Recent Notes</h2>
            {notes.map(note => <NotePreview key={note.title} {...note} />)}
        </div>
    );
}

export default Home;
