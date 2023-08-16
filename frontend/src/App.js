import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginFormPage from './components/LoginFormPage/LoginForm';  
import SignupFormPage from './components/SignupFormPage/SignupForm';  
import HomePage from './components/HomePage'; 
import NotFound from './components/NotFound';
import BackgroundContext from './context/backgroundContext';

function App() {
  const [background, setBackground] = useState('');

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      <Router>
        <Navigation />
        <div className="app-container" style={{ backgroundImage: background }}>
          <Switch>
            <Route exact path="/" component={SignupFormPage} />
            <Route path="/login" component={LoginFormPage} />
            <Route path="/news_feed" component={HomePage} />
            {/* Add other routes as needed */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </BackgroundContext.Provider>
  );
}

export default App;


