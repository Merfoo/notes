/** @jsx jsx */

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Global, css, jsx } from "@emotion/core";

import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

import Home from "./pages/Home";

function App() {
    const globalStyles = css`
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    `;

    const contentStyles = css`
        width: 90%;
        max-width: 1000px;
        margin: auto;
    `;

    const mainStyles = css`
        height: 100vh
    `;

    return (
        <BrowserRouter>
            <Global styles={globalStyles} />
            <div css={contentStyles}>
                <Navbar />
                <main css={mainStyles}>
                    <Switch>
                        <Route path="/" component={Home} />
                    </Switch>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
