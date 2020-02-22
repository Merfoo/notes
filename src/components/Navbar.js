/** @jsx jsx */

import { NavLink } from "react-router-dom";
import { css, jsx } from "@emotion/core";

function Navbar() {
    const navStyles = css`
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;

        display: flex;

        background: lightgrey;

        a {
            padding: 10px 15px;

            font-size 18px;
            color: black;
            text-decoration: none;

            display: flex;
            justify-content: center;
            align-items: center;

            :hover {
                background: white;
            }
        }

        .container {
            height: 100%;
            width: 100%;
            margin: auto 20px;
            
            display: flex;
            flex-direction: row;
        }

        .title-section {
            display: flex;
            flex-direction: row;
        }

        .drawer {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            justify-content: space-between;
        }

        .links-section {
            display: flex;
            flex-direction: row;
        }

        .title-link {
            font-size: 24px;
        }

        .menu {
            display: none;
        }
    `;

    return (
        <nav css={navStyles}>
            <div className="container">
                <div className="title-section">
                    <NavLink className="title-link" to="/">Notes</NavLink>
                    <div className="menu">☰</div>
                </div>
                <div className="drawer">
                    <div className="links-section"></div>
                    <div className="links-section">
                        <NavLink to="/all">All</NavLink>
                    </div>
                    <div className="links-section">
                        <NavLink to="/signup">Signup</NavLink>
                        <NavLink to="/login">Login</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
