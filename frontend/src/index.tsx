import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "babel-polyfill";
import "focus-within-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import PolyfillUtils from "utilities/polyfills/polyfill-utils";
import App from "./app";
import * as serviceWorker from "utilities/service-worker";

/*
---------------------------------------------------------------------------------------------
Application setup
---------------------------------------------------------------------------------------------
*/

PolyfillUtils.registerFileConstructorPolyfill();
PolyfillUtils.registerGetBoundingClientRectPolyfill();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
