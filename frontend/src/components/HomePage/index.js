import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { restoreSession } from '../../store/session';
import PostModal from '../PostModal/PostModal';
import { fetchPosts, getPosts } from '../../store/posts'; // Update the path if needed


function HomePage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const posts = useSelector(state => getPosts(state));

    const [showModal, setShowModal] = useState(false);
    // Fetch all posts and restore session when the component mounts
    useEffect(() => {
        dispatch(restoreSession());
        dispatch(fetchPosts());
    }, [dispatch]);

    if (!sessionUser) {
        return <Redirect to='/login' />;
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
      <div className="layoutContainer">
      <div className="HomePageHeader">
          <h1>Welcome to the Home Page!</h1>
      </div>
      <button onClick={handleOpenModal}>Post</button>
      {showModal && <PostModal onClose={handleCloseModal} />}
      
      <div className="postsContainer">
          {posts.map(post => (
              <div key={post.id} className="postContainer">
                  <h2 className="postTitle">{post.title}</h2>
                  <p className="postBody">{post.body}</p>
              </div>
          ))}
      </div>
  </div>
);
}

export default HomePage;
