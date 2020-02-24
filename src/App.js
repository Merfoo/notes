/** @jsx jsx */

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Global, css, jsx } from "@emotion/core";

import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";

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

    const pageStyles = css`
        width: 90%;
        max-width: 1000px;
        margin: auto;
        
        display: flex;
        flex-direction: column;

        .content {
            margin-top: 75px;

            flex-grow: 1;
        }

        .main {
            height: 100vh;
        }
    `;

    return (
        <BrowserRouter>
            <Global styles={globalStyles} />
            <div css={pageStyles}>
                <Navbar />
                <div className="content">
                    <main className="main">
                        <Switch>
                            <Route path="/signup" component={Signup} />
                            <Route path="/" component={Home} />
                        </Switch>
                    </main>
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
