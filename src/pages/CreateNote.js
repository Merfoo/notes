/** @jsx jsx */

import { useForm } from "react-hook-form";
import { css, jsx } from "@emotion/core";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import {generateCombination} from "gfycat-style-urls";

function CreateNote() {
    const styles = css`
        .input-section {
            height: 100px;

            display: flex;
            flex-direction: column;

            label {
                margin-bottom: 5px;
            }
            
            input {
                height: 25px;
            }

            .error-message {
                color: red;
            }
        }
    `;

    const CREATENOTE = gql`
        mutation CreateNote($title: String!, $titleId: String!, $body: String!) {
            createNote(title: $title, titleId: $titleId, body: $body) {
                note {
                    title
                    titleId
                    body
                }
            }
        }
    `;

    const [createNote, { data, loading }] = useMutation(CREATENOTE);

    const { register, handleSubmit, errors, watch } = useForm();

    const onSubmit = ({ title, body }) => {
        let titleId = title + generateCombination(3, "-");
        console.log (title + " " + titleId + " " + body);
        createNote({ variables: { title, titleId, body } })
            .catch((e) => {
                console.log("rejected");
                console.log(e);
            });
    };

    console.log("Create Note Data");
    console.log(data);

    console.log("loading");
    console.log(loading);

    return (
        <div css={styles}>
            <h2>Create Note</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-section">
                    <label>Title</label>
                    <input
                        name="title"
                        ref={register({
                            required: "Required"
                        })}
                    />
                    <div className="error-message">
                        {errors.username && errors.username.message}
                    </div>
                </div>
                <div className="input-section">
                    <label>Body</label>
                    <textarea
                        name="body"
                        rows="40"
                        ref={register({
                            required: "Required"
                        })}
                    />
                    <div className="error-message">
                        {errors.password && errors.password.message}
                    </div>
                </div>
                <br/><br/>
                <input type="submit" />
            </form>
        </div>
    );
}

export default CreateNote;
