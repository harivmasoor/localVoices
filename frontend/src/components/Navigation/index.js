import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';  // <-- Add useLocation here
import ProfileButton from './ProfileButton';
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
    <ul className={ulClass}>  {/* <-- Apply the class here */}
      <li>
        <Link to={sessionUser ? "/news_feed" : "/"}>
          <div className="logo"></div> {/* This div will show the logo */}
        </Link>
        {sessionLinks}
      </li>
    </ul>
  );
}

export default Navigation;


