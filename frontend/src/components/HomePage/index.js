import React from 'react';
import './HomePage.css';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function HomePage() {
    const sessionUser = useSelector(state => state.session.user);
    if (!sessionUser) {
        return <Redirect to='/login' />
      }
  return (
    <div className="HomePageHeader">
      <h1>Welcome to the Home Page!</h1>
    </div>
  );
}



export default HomePage;