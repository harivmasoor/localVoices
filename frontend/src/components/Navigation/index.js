import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';  // <-- Add useLocation here
import ProfileButton from './ProfileButton';
import SearchBar from '../SearchBar/SearchBar';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();   // <-- Use the hook here

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  }

  // Conditional logic to determine background color based on the route
  let ulClass = '';
  if (location.pathname === '/') {
    ulClass = 'gradient';
  } else if (location.pathname === '/login') {
    ulClass = 'white';
  }

  return (
    <ul className={ulClass}>  
      <li>
        <Link to={sessionUser ? "/news_feed" : "/"}>
          <div className="logo"></div>
        </Link>
        {sessionUser && location.pathname === "/news_feed" && sessionLinks}
      </li>
      <SearchBar />
      {/* Display the login button only on the main page and when user is not logged in */}
      {!sessionUser && location.pathname === '/' && (
        <li className="navbar-button-container">
          <Link to="/login">
          <button className="navbar-login-button">Login</button>
          </Link>
        </li>
      )}
    </ul>
  );
}

export default Navigation;


