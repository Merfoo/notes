/** @jsx jsx */

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Global, css, jsx } from "@emotion/core";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

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

        .content {
            margin-top: 75px;
        }

        .main {
            min-height: 100vh;
        }
    `;

    const apolloClient = new ApolloClient({
        uri: "https://merfoo-notes-backend.herokuapp.com/"
    });

    return (
        <BrowserRouter>
            <Global styles={globalStyles} />
            <ApolloProvider client={apolloClient}>
                <div css={pageStyles}>
                    <Navbar />
                    <div className="content">
                        <main className="main">
                            <Switch>
                                <Route path="/signup" component={Signup} />
                                <Route path="/login" component={Login} />
                                <Route path="/" component={Home} />
                            </Switch>
                        </main>
                        <Footer />
                    </div>
                </div>
            </ApolloProvider>
        </BrowserRouter>
    );
}

export default App;
