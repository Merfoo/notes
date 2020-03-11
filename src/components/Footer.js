/** @jsx jsx */

import { css, jsx } from "@emotion/core";

function footer() {
    const footerStyles = css`
        width: 100%;
        margin-top: 50px;

        box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.2);

        .content {
            padding: 15px;
            
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            a {
                color: black;
            }
        }
    `;

    return (
        <div css={footerStyles}>
            <div className="content">
                <div>
                    <a href="https://github.com/Merfoo/notes">Created</a> with love by <a href="https://github.com/Merfoo">Fauzi</a> and <a href="https://github.com/symonr9">Symon</a>
                </div>
            </div>
        </div>
    );
}

export default footer;
