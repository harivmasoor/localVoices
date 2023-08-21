// HomePage/index.js
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PostModal from '../PostModal/PostModal';
import { fetchPosts } from '../../store/posts';
import PostIndex from '../PostIndex'; // New component

function HomePage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {
        if (!showModal) {
            setSelectedPost(null);
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

    return (
        <div className="layoutContainer">
            <div className="HomePageHeader">
                <h1>Welcome to the Home Page!</h1>
            </div>
            <button onClick={handleOpenModal}>Post</button>
            {showModal && <PostModal onClose={handleCloseModal} post={selectedPost} />}
            
            <PostIndex 
                sessionUser={sessionUser}
                onPostClick={(post) => {
                    setSelectedPost(post);
                    setShowModal(true);
                }}
            />
        </div>
    );
}

export default HomePage;



