/** @jsx jsx */

import { useState } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";

import { getTimeAgoString } from "../util";
import NiceButton from "../components/NiceButton";

const styles = css`
    .noteDiv {
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
        float: right;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .editable {
        float: left;
        :hover {
            text-decoration: underline;
        }
    }

    .input-section {
        display: flex;
        flex-direction: column;

        label {
            margin-bottom: 5px;
        }

        input {
            height: 30px;
        }
    }

    .input-section-title {
        height: 100px;
    }

    .input-section-body {
        margin-bottom: 25px;
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

const EDIT_NOTE = gql`
    mutation EditNote($titleId: String!, $body: String!) {
        updateNote(titleId: $titleId, body: $body) {
            titleId
        }
    }
`;

function EditNote() {
    const { titleId } = useParams();
    const history = useHistory();
    const [ loadingMessage, setLoadingMessage ] = useState("Loading note");
    const { data, loading, error } = useQuery(GET_NOTE,{ variables: { titleId } });

    const { register, handleSubmit, errors } = useForm();
    const [editNote, { editLoading, editError }] = useMutation(EDIT_NOTE);

    const onSubmit = ({ body }) => {
        editNote({ variables: { titleId, body } })
            .then((res) => {
                console.log("Success! Note has been edited.");
                history.push("/notes/" + titleId);
            })
            .catch((e) => {
                console.log("Note editing failed");
                console.log(e);
            });
    };

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

    if(note.username !== useSelector(state => state.username))
        history.push("/");

    if (loading)
        setTimeout(() => setLoadingMessage(loadingMessage + " ."), 1000);

    if (error)
        console.log("Error loading user", error);

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
                    <div className="noteDiv">
                        <form onSubmit={handleSubmit(onSubmit, titleId)}>
                            <h2 name="title">{note.title}</h2>
                            <div className="input-section input-section-body">
                                <textarea
                                    name="body"
                                    ref={register({
                                        required: "Required"
                                    })}
                                    rows="20"
                                    defaultValue={note.body}
                                />
                            </div>
                            <NiceButton type="submit" disabled={loading} isLoading={loading}>Save</NiceButton>
                        </form>
                        <div className="details">
                            {timeAgo}
                        </div>
                        <br/><br/>
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



export default EditNote;