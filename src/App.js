/** @jsx jsx */

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Global, css, jsx } from "@emotion/core";

import Navbar from "./components/Navbar"; 

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

  return (
    <BrowserRouter>
        <Global styles={globalStyles} />
        <Navbar />
        <main>
            <Switch>
                <Route path="/" component={Home} />
            </Switch>
        </main>
    </BrowserRouter>
  );
}

export default App;
