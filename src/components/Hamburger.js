/** @jsx jsx */

import { css, jsx } from "@emotion/core";

function Hamburger({ isDrawerVisible, setIsDrawerVisible }) {
    // Based on Jesse Couch's work
    // https://codepen.io/designcouch/pen/Atyop
    const baseStyles = css`
        @media (max-width: 786px) {
            width: 30px;
            height: 20px;
            position: relative;
            margin: auto 20px auto auto;
            transform: rotate(0deg);
            transition: .5s ease-in-out;
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

            span {
                display: block;
                position: absolute;
                height: 2px;
                width: 100%;
                background: black;
                border-radius: 1px;
                opacity: 1;
                left: 0;
                transform: rotate(0deg);
                transition: .25s ease-in-out;
            }

            span:nth-of-type(1) {
                top: 0px;
            }

            span:nth-of-type(2), span:nth-of-type(3) {
                top: 9px;
            }

            span:nth-of-type(4) {
                top: 18px;
            }
        }
    `;

    let styles = css`${baseStyles}`;
    
    if (isDrawerVisible) {
        styles = css`
            ${baseStyles}

            span:nth-of-type(1) {
                top: 9px;
                width: 0%;
                left: 50%;
            }

            span:nth-of-type(2) {
                transform: rotate(45deg);
            }

            span:nth-of-type(3) {
                transform: rotate(-45deg)
            }

            span:nth-of-type(4) {
                top: 9px;
                width: 0%;
                left: 50%;
            }
        `;
    }

    return (
        <div css={styles} onClick={() => setIsDrawerVisible(!isDrawerVisible)}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

export default Hamburger;
