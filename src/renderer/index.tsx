import * as React from "react";
import ReactDOM from "react-dom";
import * as history from "history";
import { Provider } from "react-redux";
import { Switch, Route, Redirect, Router } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";

import "./style.less";

import rootReducer from "../store/rootReducer";
import Users from "./pages/Users";
import Books from "./pages/Books";
import Orders from "./pages/Orders";

const store = createStore(rootReducer);

const historyInstance = history.createBrowserHistory();

const App = () => {
  return (
    <Provider store={store}>
      <Router history={historyInstance}>
        <Switch>
          <Route path="/users" component={Users} />
          <Route path="/books" component={Books} />
          <Route path="/orders" component={Orders} />
          <Redirect to="/users" />
        </Switch>
      </Router>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
