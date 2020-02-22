/** @jsx jsx */

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { css, jsx } from "@emotion/core";

function Navbar() {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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

            :hover, &.active-navlink {
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
            justify-content: space-between;
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

        @media (max-width: 786px) {
            .container, .drawer, .links-section {
                flex-direction: column;
            }

            .drawer {
                padding-bottom: ${isDrawerVisible ? "0" : "5px"}; // When the drawer is hidden, the padding causes some of it to be shown...
                transition: height 0.5s;
                height: ${isDrawerVisible ? "0" : "150px"}; // This value will have to change if the user is logged in since more entries are available...
                overflow: hidden;
            }

            .menu {
                user-select: none;
                font-size: 24px;

                display: flex;
                justify-content: center;
                align-items: center;

                :hover {
                    cursor: pointer;
                }
            }
        }
    `;

    return (
        <nav css={navStyles}>
            <div className="container">
                <div className="title-section">
                    <NavLink className="title-link" to="/">Notes</NavLink>
                    <div className="menu" onClick={() => setIsDrawerVisible(!isDrawerVisible)}>☰</div>
                </div>
                <div className="drawer">
                    <div className="links-section"></div>
                    <div className="links-section">
                        <NavLink to="/all" activeClassName="active-navlink">All</NavLink>
                    </div>
                    <div className="links-section">
                        <NavLink to="/signup" activeClassName="active-navlink">Signup</NavLink>
                        <NavLink to="/login" activeClassName="active-navlink">Login</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
