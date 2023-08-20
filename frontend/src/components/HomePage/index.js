import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { restoreSession } from '../../store/session';
import PostModal from '../PostModal/PostModal';
import { fetchPosts, getPosts } from '../../store/posts'; // Update the path if needed
import { deletePost } from '../../store/posts';

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const posts = useSelector(getPosts);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      dispatch(restoreSession());
      dispatch(fetchPosts());
  }, [dispatch]);
  
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!showModal) {
      setSelectedPost(null); // Reset selectedPost when modal closes
    }
  }, [showModal]);

  if (!sessionUser) {
      return <Redirect to='/login' />;
  }

  const handleOpenModal = () => {
      setShowModal(true);
  };

  const handleCloseModal = () => {
      setSelectedPost(null);
      setShowModal(false);
  };

  const handlePostContainerClick = (post) => {
    console.log("Post container clicked. Checking user...");
    console.log("Session User ID:", sessionUser.id, typeof sessionUser.id); // log type
    console.log("Post's User ID:", post.userId, typeof post.userId);       // log type
  
    if (post.user_id === sessionUser.id) {
      console.log("User match found. Opening modal...");
      setSelectedPost(post);
      setShowModal(true);
    } else {
      console.log("User does not match. Modal not opened.");
    }
  }
  
  
  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
};

  return (
    <div className="layoutContainer">
      <div className="HomePageHeader">
          <h1>Welcome to the Home Page!</h1>
      </div>
      <button onClick={handleOpenModal}>Post</button>
      {showModal && <PostModal onClose={handleCloseModal} post={selectedPost} onDelete={handleDeletePost}/>}
      
      <div className="postsContainer">
      {posts.map(post => (
          <div key={post.id} className="postContainer" onClick={() => handlePostContainerClick(post)}>
            {post.userPhotoUrl ? <img src={post.userPhotoUrl} alt="Profile" className="postProfilePic"/> : <i className="fa-solid fa-user-circle postProfilePic"/>}
            <h2 className="postTitle">{post.title}</h2>
            <p className="postBody">{post.body}</p>
          </div>
))}

      </div>
    </div>
  );
}

export default HomePage;

