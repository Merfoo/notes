/** @jsx jsx */

import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";

import { getTimeAgoString } from "../util";
import NiceButton from "../components/NiceButton";

const styles = css`
    .last-posted {
        color: grey;
    }

    .input-section {
        display: flex;
        flex-direction: column;

        .error-message {
            height: 25px;
            color: red;
        }
    }

    .input-section-is-private {
        label {
            display: flex;
            align-items: center;
        }

        input {
            height: 30px;
            margin-left: 0;
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

const GET_NOTE = gql`
    query GetNote($titleId: String!) {
        getNote(titleId: $titleId) {
            title
            body
            createdAt
            isPrivate
            createdBy {
                username
            }
        }
    }
`;

const EDIT_NOTE = gql`
    mutation EditNote($titleId: String!, $body: String!, $isPrivate: Boolean!) {
        updateNote(titleId: $titleId, body: $body, isPrivate: $isPrivate) {
            id
            body
            isPrivate
        }
    }
`;

const DELETE_NOTE = gql`
    mutation DeleteNote($titleId: String!) {
        deleteNote(titleId: $titleId)
    }
`;

function EditNote() {
    const { titleId } = useParams();
    const history = useHistory();
    const [ loadingMessage, setLoadingMessage ] = useState("Loading note");

    const { data, loading, error } = useQuery(GET_NOTE,{ variables: { titleId } });
    const [editNote, { loading: editLoading, error: editError } ] = useMutation(EDIT_NOTE);
    const [deleteNote, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_NOTE);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ body, isPrivate }) => {
        editNote({ variables: { titleId, body, isPrivate } })
            .then((res) => {
                history.push("/notes/" + titleId);
            })
            .catch((e) => {
                console.log("Note editing failed");
                console.log(e);
            });
    };

    const deleteOnClick = () => {
        if (window.confirm("Delete note?")) {
            deleteNote({ variables: { titleId } })
                .then((res) => {
                    history.push("/");
                })
                .catch((e) => {
                    console.log("Note deleting failed");
                    console.log(e);
                });
        }
    }

    const username = useSelector(state => state.username);
    let noteData = null;
    let note = {};

    if (!loading && !error) {
        noteData = data.getNote;

        if (noteData) {
            note = {
                title: noteData.title,
                body: noteData.body,
                createdAt: noteData.createdAt,
                isPrivate: noteData.isPrivate,
                username: noteData.createdBy.username
            }
        }

        if(note.username !== username){
            history.push("/");
        }
    }

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading note", error);

    const fadeOutProps = useSpring({ opacity: loading ? 1 : 0 });
    const fadeInProps = useSpring({ opacity: loading ? 0 : 1 });

    const timeAgo = getTimeAgoString(new Date(note.createdAt));

    return (
        <div css={styles}>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {noteData ? (
                <animated.div style={fadeInProps}>
                    <div>
                        <div>
                            <h2 name="title">{note.title}</h2>
                            <p className="last-posted">{timeAgo}</p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit, titleId)}>
                            <div className="input-section">
                                <textarea
                                    name="body"
                                    ref={register({
                                        required: "Required"
                                    })}
                                    rows="20"
                                    defaultValue={note.body}
                                    disabled={editLoading || deleteLoading}
                                />
                                <div className="error-message">
                                    {errors.body && errors.body.message}
                                </div>
                            </div>
                            <div className="input-section input-section-is-private">
                                <label>
                                    <input
                                        name="isPrivate"
                                        type="checkbox"
                                        ref={register()}
                                        defaultChecked={note.isPrivate}
                                        disabled={editLoading || deleteLoading}
                                    />
                                    Private
                                </label>
                            </div>
                            <div className="buttons-container">
                                <NiceButton type="submit" disabled={editLoading || deleteLoading} isLoading={editLoading}>Save</NiceButton>
                                <NiceButton type="button" disabled={editLoading || deleteLoading} isLoading={deleteLoading} className="delete-button" onClick={deleteOnClick}>Delete</NiceButton>
                            </div>
                        </form>
                    </div>
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    <h2>Note not found</h2>
                </animated.div>
            )}
            <div className="error-container" hidden={!(error || editError || deleteError)}>
                {error && <div>Error loading note</div>}
                {editError && <div>Error saving note</div>}
                {deleteError && <div>Error deleting note</div>}
            </div>
        </div>
    );
}

export default EditNote;