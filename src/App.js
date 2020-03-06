/** @jsx jsx */

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Global, css, jsx } from "@emotion/core";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { Provider } from "react-redux";
import store from "./redux/store";

import { loadState } from "./localStorage";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import User from "./pages/User";

function App() {
    const globalStyles = css`
        @import url('https://fonts.googleapis.com/css?family=Muli&display=swap');

        body {
            margin: 0;
            font-family: "Muli", sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    `;

    const mainStyles = css`
        min-height: 100vh;

        width: 90%;
        max-width: 1000px;

        margin: auto;
        margin-top: 75px;
    `;

    const apolloClient = new ApolloClient({
        uri: "https://merfoo-notes-backend.herokuapp.com/",
        request: (operation) => {
            const state = loadState();

            if (state && state.userToken) {
                operation.setContext({
                    headers: {
                        authorization: `Bearer ${state.userToken}`
                    }
                });
            }
        }
    });

    return (
        <BrowserRouter>
            <Global styles={globalStyles} />
            <ScrollToTop />
            <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                        <Navbar />
                        <main css={mainStyles}>
                            <Switch>
                                <Route path="/users/:id" component={User} />
                                <Route path="/signup" component={Signup} />
                                <Route path="/login" component={Login} />
                                <Route path="/" component={Home} />
                            </Switch>
                        </main>
                        <Footer />
                </Provider>
            </ApolloProvider>
        </BrowserRouter>
    );
}

export default App;
