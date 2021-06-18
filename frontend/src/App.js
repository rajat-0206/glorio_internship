import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import './Styles/custom.css';
import LoginForm from "./Components/login.js"
import SignupForm from "./Components/signup.js"
import 'antd/dist/antd.css'
import { custom } from 'joi';


const App = () => {
  return (
    <Router>
    <div className="App">
     
      <Switch>
              <Route exact path="/" component={LoginForm} />
              <Route path="/signup" component={SignupForm} />
              
      </Switch>
    </div>
    </Router>
  );
}

export default App;
