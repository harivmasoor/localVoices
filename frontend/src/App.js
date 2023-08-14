import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginFormPage from './components/LoginFormPage/LoginForm';  
import SignupFormPage from './components/SignupFormPage/SignupForm';  

function App() {
  return (
    <Router>
      <Navigation />
      <div className="app-container">
        <Switch>
          <Route exact path="/" component={SignupFormPage} />
          <Route path="/login" component={LoginFormPage} />
          {/* Add other routes as needed */}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

