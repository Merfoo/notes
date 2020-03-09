/** @jsx jsx */

import { NavLink } from "react-router-dom";
import { css, jsx } from "@emotion/core";

import { getTimeAgoString } from "../util";

const styles = css`
    margin-bottom: 20px;
    padding: 10px;

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    :hover {
        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2);
    }

    a {
        text-decoration: none;
        color: black;
    }

    .title {
        margin-bottom: 10px;
    }

    .details {
        color: grey;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        p {
            margin-top: 0;
        }
    }

    .editable, .username {
        :hover {
            text-decoration: underline;
        }
    }
`;

function NotePreview({ titleId, title, username, createdAt, editable = false }) {
    const timeAgo = getTimeAgoString(new Date(createdAt));

    return (
        <div css={styles}>
            <h3 className="title">
                <NavLink to={`/notes/${titleId}`}>{title}</NavLink>
            </h3>
            <div className="details">
                {editable ? 
                    <NavLink to={`/notes/${titleId}/edit`} className="editable">Edit</NavLink>
                :
                    <p>Creator <NavLink to={`/users/${username}`} className="username">{username}</NavLink></p>
                }
                <p>{timeAgo}</p>
            </div>
        </div>
    );
}

export default NotePreview;
