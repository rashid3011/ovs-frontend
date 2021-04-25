import "./App.css";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/voter-login" component={LoginPage} />

        {/*<Route exact path="/ec-login" component={LoginPage} />*/}

        <Route exact path="/voter-register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
