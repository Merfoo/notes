/** @jsx jsx */

import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

import { useSelector } from "react-redux";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import NiceButton from "../components/NiceButton";

const styles = css`
    .input-section {
        display: flex;
        flex-direction: column;

        label {
            margin-bottom: 5px;
        }

        input {
            height: 30px;
        }

        .error-message {
            height: 25px;
            color: red;
        }
    }

    .input-section-title {
        height: 100px;
    }

    .input-section-is-private {
        label {
            display: flex;
            align-items: center;
        }

        input {
            margin-left: 0;
        }
    }

    .submit-button {
        margin-top: 30px;
    }

    .error-container {
        color: white;

        margin-top: 50px;
        padding: 10px;
        border-radius: 3px;

        background-color: rgba(255, 0, 0, 0.5);
    }
`;

const CREATE_NOTE = gql`
    mutation CreateNote($title: String!, $body: String!, $isPrivate: Boolean!) {
        createNote(title: $title, body: $body, isPrivate: $isPrivate) {
            titleId
        }
    }
`;

function CreateNote() {
    const username = useSelector(state => state.username);
    const history = useHistory();

    const [createNote, { loading, error }] = useMutation(CREATE_NOTE);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ title, body, isPrivate }) => {
        createNote({ variables: { title, body, isPrivate } })
            .then((res) => {
                const { titleId } = res.data.createNote;

                history.push("/notes/" + titleId);
            })
            .catch((e) => {
                console.log("Note creation failed");
                console.log(e);
            });
    };

    if (!username)
        return <div>Please login to create a note</div>;

    return (
        <div css={styles}>
            <h2>Create Note</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-section input-section-title">
                    <label>Title</label>
                    <input
                        name="title"
                        ref={register({
                            required: "Required"
                        })}
                        disabled={loading}
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
                        disabled={loading}
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
                            disabled={loading}
                        />
                        Private
                    </label>
                </div>
                <NiceButton className="submit-button" type="submit" disabled={loading} isLoading={loading}>Create</NiceButton>
            </form>
            <div className="error-container" hidden={!error}>
                Error creating note
            </div>
        </div>
    );
}

export default CreateNote;
