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

    .details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .username {
        :hover {
            text-decoration: underline;
        }
    }
`;

function NotePreview({ titleId, title, username, createdAt }) {
    const timeAgo = getTimeAgoString(new Date(createdAt));

    return (
        <div css={styles}>
            <h3>
                <NavLink to={`/notes/${titleId}`}>{title}</NavLink>
            </h3>
            <div className="details">
                <NavLink to={`/users/${username}`} className="username">{username}</NavLink>
                <div>{timeAgo}</div>
            </div>
        </div>
    );
}

export default NotePreview;
