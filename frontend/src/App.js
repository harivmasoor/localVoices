import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginFormPage from './components/LoginFormPage/LoginForm';  // Ensure this is the correct path
import SignupFormPage from './components/SignupFormPage/SignupForm';  // Ensure this is the correct path

function App() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <SignupFormPage />
        </Route>
        <Route path="/login">
          <LoginFormPage />
        </Route>
        {/* Add other routes as needed */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
