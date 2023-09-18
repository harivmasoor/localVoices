import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PostModal from '../PostModal/PostModal';
import { fetchPosts } from '../../store/posts';
import PostIndex from '../PostIndex';

// Import SVG icons
import { ReactComponent as GithubIcon } from './GithubIcon.svg';
import { ReactComponent as LinkedInIcon } from './LinkedIn.svg';
import { ReactComponent as PortfolioIcon } from './PortfolioIcon.svg';

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
                <h1>Welcome to Local Voices, {sessionUser.username}</h1>
            </div>

            <div className="homepage-button-container" onClick={handleOpenModal}>
                {sessionUser.photoUrl && <img className="profile-pic" src={sessionUser.photoUrl} alt="Profile" />}
                <div className="button-text">What's on your mind, neighbor?</div>
            </div>

            {showModal && <PostModal onClose={handleCloseModal} post={selectedPost} />}
            
            <PostIndex 
                sessionUser={sessionUser}
                onPostClick={(post) => {
                    setSelectedPost(post);
                    setShowModal(true);
                }}
            />

            {/* Social Links */}
            <div className="social-links">
                <a href="https://github.com/harivmasoor" target="_blank" rel="noopener noreferrer">
                    <GithubIcon />
                </a>
                <a href="https://www.linkedin.com/in/harimasoor/" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                </a>
                <a href="https://harimasoor.com" target="_blank" rel="noopener noreferrer">
                    <PortfolioIcon />
                </a>
            </div>
        </div>
    );
}

export default HomePage;




