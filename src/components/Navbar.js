/** @jsx jsx */

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { css, jsx } from "@emotion/core";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions"

import Hamburger from "./Hamburger";

function Navbar() {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const navStyles = css`
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;

        a {
            padding: 10px 15px;

            font-size 18px;
            color: black;
            text-decoration: none;

            display: flex;
            justify-content: center;
            align-items: center;

            :hover, &.active-navlink {
                background: lightgrey;
            }
        }

        .container {
            width: 100%;

            background: white;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            
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
            justify-content: flex-end;
        }

        .links-section {
            display: flex;
            flex-direction: row;
        }

        .title-link {
            font-size: 24px;
        }

        @media (max-width: 786px) {
            .container, .drawer, .links-section {
                flex-direction: column;
            }

            .title-section {
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            .drawer {
                padding-bottom: ${isDrawerVisible ? "5px" : "0"}; // When the drawer is hidden, the padding causes some of it to be shown...
                transition: height 0.5s;
                height: ${isDrawerVisible ? "150px" : "0"}; // This value will have to change if the user is logged in since more entries are available...
                overflow: hidden;
            }

            .empty-space {
                height: ${isDrawerVisible ? "100vh" : "0"};
                width: 100%;

                background: black;
                transition: opacity .25s;
                opacity: ${isDrawerVisible ? "0.75" : "0"};
            }
        }
    `;

    const dispatch = useDispatch();
    const username = useSelector(state => state.username);
    const isLoggedIn = !!username;

    const hideDrawer = () => setIsDrawerVisible(false);

    const logout = () => {
        dispatch(logoutUser());
        hideDrawer();
    };

    return (
        <nav css={navStyles}>
            <div className="container">
                <div className="title-section">
                    <NavLink className="title-link" to="/" onClick={hideDrawer}>Notes</NavLink>
                    <Hamburger isDrawerVisible={isDrawerVisible} setIsDrawerVisible={setIsDrawerVisible} />
                </div>
                <div className="drawer">
                    { isLoggedIn ? (
                        <div className="links-section">
                            <NavLink to="/notes/create" activeClassName="active-navlink" onClick={hideDrawer}>Create</NavLink>
                            <NavLink to={`/users/${username}/notes`} activeClassName="active-navlink" onClick={hideDrawer}>Collection</NavLink>
                            <NavLink to="/" onClick={logout}>Logout</NavLink>
                        </div>
                    ) : (
                        <div className="links-section">
                            <NavLink to="/signup" activeClassName="active-navlink" onClick={hideDrawer}>Signup</NavLink>
                            <NavLink to="/login" activeClassName="active-navlink" onClick={hideDrawer}>Login</NavLink>
                        </div>
                    )}
                </div>
            </div>
            <div className="empty-space" onClick={hideDrawer}></div>
        </nav>
    );
}

export default Navbar;
