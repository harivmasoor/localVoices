import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginFormPage from './components/LoginFormPage/LoginForm';  
import SignupFormPage from './components/SignupFormPage/SignupForm';  
import HomePage from './components/HomePage'; 
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Navigation />
      <div className="app-container">
        <Switch>
          <Route exact path="/" component={SignupFormPage} />
          <Route path="/login" component={LoginFormPage} />
          <Route path="/news_feed" component={HomePage} />
          {/* Add other routes as needed */}
          <Route NotFound>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

