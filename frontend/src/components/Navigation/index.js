import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormPage';
import './Navigation.css';


function Navigation() {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <Link to="/login">Log In</Link>
    );
  }

  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
        {sessionLinks}
      </li>
    </ul>
  );
}

export default Navigation;