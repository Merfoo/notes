/** @jsx jsx */

import { NavLink } from "react-router-dom";
import { css, jsx } from "@emotion/core";

const styles = css`
    margin-bottom: 20px;
    padding: 10px;

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    :hover {
        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2);
    }

    .details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    a {
        text-decoration: none;
        color: black;
    }
`;

function NotePreview({ titleId, title, username, createdAt }) {
    const date = new Date(createdAt).toLocaleString();

    return (
        <div css={styles}>
            <h3>
                <NavLink to={`/notes/${titleId}`}>{title}</NavLink>
            </h3>
            <div className="details">
                <div>{username}</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

export default NotePreview;
