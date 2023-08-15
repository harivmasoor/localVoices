import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  }

  return (
    <ul>
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

