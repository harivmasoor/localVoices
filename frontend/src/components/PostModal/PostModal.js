import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../../context/ModalContext';
import './PostModal.css';
import { useDispatch } from 'react-redux';
import { createPost, updatePost, deletePost, fetchPosts } from '../../store/posts'; // Add deletePost import

function PostModal({ onClose, post }) {
    console.log('Rendering PostModal with post:', post);
    const [body, setBody] = useState(post ? post.body : "");
    const dispatch = useDispatch();

    useEffect(() => {
        if (post) {
            setBody(post.body);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (post) {
            const updatedPost = {
                id: post.id,
                body
            };
            try {
                await dispatch(updatePost(updatedPost));
                await dispatch(fetchPosts());  // Refetch the posts after updating
            } catch (error) {
                console.error("Failed to update post:", error);
            }
        } else {
            const newPost = { body };
            try {
                await dispatch(createPost(newPost));
                await dispatch(fetchPosts());  // Refetch the posts after creating
            } catch (error) {
                console.error("Failed to create post:", error);
            }
        }
        onClose();
    };    
    
    const handleDelete = async () => {
        if (post) {
            try {
                await dispatch(deletePost(post.id));
                await dispatch(fetchPosts());  // Refetch the posts after deleting
            } catch (error) {
                console.error("Failed to delete post:", error);
            }
        }
        onClose();
    }
    

    const modalNode = useContext(ModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
        <div id="posts-modal">
            <div id="posts-modal-background" onClick={onClose} />
            <div id="posts-modal-content">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What's on your mind?"
                />
                <div>
                    <button onClick={handleSubmit}>{post ? "Update" : "Post"}</button>
                    {post && <button onClick={handleDelete}>Delete</button>}
                </div>
            </div>
        </div>,
        modalNode
    );
}

export default PostModal;


