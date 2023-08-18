import React, {useEffect} from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { restoreSession } from '../../store/session';

function HomePage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);


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