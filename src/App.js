/** @jsx jsx */

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Global, css, jsx } from "@emotion/core";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { Provider } from "react-redux";
import store from "./redux/store";

import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateNote from "./pages/CreateNote";

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

    const mainStyles = css`
        min-height: 100vh;

        width: 90%;
        max-width: 1000px;

        margin: auto;
        margin-top: 75px;
    `;

    const apolloClient = new ApolloClient({
        //Change to local host when developing
       //uri: "https://merfoo-notes-backend.herokuapp.com/"
        uri: "https://localhost:4000/"
    });

    return (
        <BrowserRouter>
            <Global styles={globalStyles} />
            <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                        <Navbar />
                        <main css={mainStyles}>
                            <Switch>
                                <Route path="/notes/create" component={CreateNote} />
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
