import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal'; 
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [showSignupModal, setShowSignupModal] = useState(false); 

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <button onClick={() => setShowLoginModal(true)}>Log In</button>
        <LoginFormModal 
          showModal={showLoginModal} 
          setShowModal={setShowLoginModal} 
          setShowSignupModal={setShowSignupModal}
        />
        <button onClick={() => setShowSignupModal(true)}>Sign Up</button>
        <SignupFormModal 
          showModal={showSignupModal} 
          setShowModal={setShowSignupModal}
        />
      </>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
        {sessionLinks}
      </li>
    </ul>
  );
}

export default Navigation;



