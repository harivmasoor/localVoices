import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { restoreSession } from '../../store/session';
import PostModal from '../PostModal/PostModal';
import { fetchPosts, getPosts } from '../../store/posts'; // Update the path if needed
import { deletePost } from '../../store/posts';
import { createComment, fetchCommentsByPostId } from '../../store/comments';  // Import the createComment action

function HomePage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const posts = useSelector(getPosts, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));


    const [showModal, setShowModal] = useState(false);
    const [commentInputPostId, setCommentInputPostId] = useState(null);

    useEffect(() => {
        dispatch(restoreSession());
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {
      const fetchCommentsForPosts = async () => {
          for (let post of posts) {
              await dispatch(fetchCommentsByPostId(post.id));
          }
      };
  
      if (posts && posts.length > 0) {
          fetchCommentsForPosts();
      }
  }, [dispatch, posts]);

    
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

        if (post.userId === sessionUser.id) {
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

    const handleCommentSubmit = async (e, postId) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            const text = e.target.value.trim();
            dispatch(createComment({ text, postId }));
            e.target.value = ''; // clear the input
            setCommentInputPostId(null); // hide the input
        }
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
                        {post.userPhotoUrl ? 
                            <img src={post.userPhotoUrl} alt="Profile" className="postProfilePic"/> 
                            : 
                            <i className="fa-solid fa-user-circle postProfilePic"/>
                        }
                        <p className="postBody">{post.body}</p>
                        <button onClick={(e) => { e.stopPropagation(); setCommentInputPostId(post.id); }}>Comment</button>
                        {commentInputPostId === post.id && 
                            <input 
                                type="text" 
                                placeholder="Add a comment..."
                                onKeyDown={e => handleCommentSubmit(e, post.id)}
                                onClick={e => e.stopPropagation()}
                            />
                        }
                        {/* Add comment display here. This is a basic structure and might need to be adjusted based on your data */}
                        {post.comments && post.comments.map(comment => (
                            <div key={comment.id} className="comment">
                                {comment.text}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;


