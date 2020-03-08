/** @jsx jsx */

import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

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

    .input-section-body {
        margin-bottom: 25px;
    }
`;

const CREATE_NOTE = gql`
    mutation CreateNote($title: String!, $body: String!) {
        createNote(title: $title,body: $body) {
            titleId
        }
    }
`;

function CreateNote() {
    const history = useHistory();

    const [createNote, { loading }] = useMutation(CREATE_NOTE);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = ({ title, body }) => {
        createNote({ variables: { title, body } })
            .then((res) => {
                const { titleId } = res.data.createNote;

                history.push("/notes/" + titleId);
            })
            .catch((e) => {
                console.log("Note creation failed");
                console.log(e);
            });
    };

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
                    />
                    <div className="error-message">
                        {errors.title && errors.title.message}
                    </div>
                </div>
                <div className="input-section input-section-body">
                    <label>Body</label>
                    <textarea
                        name="body"
                        ref={register({
                            required: "Required"
                        })}
                        rows="20"
                    />
                    <div className="error-message">
                        {errors.body && errors.body.message}
                    </div>
                </div>
                <NiceButton type="submit" disabled={loading} isLoading={loading}>Create</NiceButton>
            </form>
        </div>
    );
}

export default CreateNote;
