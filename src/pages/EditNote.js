/** @jsx jsx */

import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import gql from "graphql-tag";
import { useQuery, useMutation } from '@apollo/react-hooks';

import { getSlugId } from "../util";

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
    query GetNote($slugId: String!) {
        getNote(slugId: $slugId) {
            title
            body
            isPrivate
            createdBy {
                username
            }
        }
    }
`;

const EDIT_NOTE = gql`
    mutation EditNote($slugId: String!, $title: String!, $body: String!, $isPrivate: Boolean!) {
        updateNote(slugId: $slugId, title: $title, body: $body, isPrivate: $isPrivate) {
            slug
        }
    }
`;

const DELETE_NOTE = gql`
    mutation DeleteNote($slugId: String!) {
        deleteNote(slugId: $slugId) {
            slug
        }
    }
`;

function EditNote() {
    const { id } = useParams();
    const history = useHistory();
    const [ loadingMessage, setLoadingMessage ] = useState("Loading note");

    const slugId = getSlugId(id);

    const { data, loading, error } = useQuery(GET_NOTE, {
        variables: { slugId },
        fetchPolicy: "no-cache"
    });

    const [editNote, { loading: editLoading, error: editError } ] = useMutation(EDIT_NOTE);
    const [deleteNote, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_NOTE);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ title, body, isPrivate }) => {
        editNote({ variables: { slugId, title, body, isPrivate } })
            .then((res) => {
                const { slug } = res.data.updateNote;

                history.push("/notes/" + slug);
            })
            .catch((e) => {
                console.log("Note editing failed");
                console.log(e);
            });
    };

    const deleteOnClick = () => {
        if (window.confirm("Delete note?")) {
            deleteNote({ variables: { slugId } })
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

    if (data) {
        noteData = data.getNote;

        if (noteData) {
            note = {
                title: noteData.title,
                body: noteData.body,
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

    return (
        <div css={styles}>
            {loading &&
                <animated.div style={fadeOutProps}>
                    {loadingMessage}
                </animated.div>
            }
            {noteData ? (
                <animated.div style={fadeInProps}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-section">
                            <label>Title</label>
                            <input
                                name="title"
                                ref={register({
                                    required: "Required"
                                })}
                                defaultValue={note.title}
                                disabled={editLoading || deleteLoading}
                            />
                            <div className="error-message">
                                {errors.title && errors.title.message}
                            </div>
                        </div>
                        <div className="input-section">
                            <label>Body</label>
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