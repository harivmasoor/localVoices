import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../../context/ModalContext';
import './PostModal.css';
import { useDispatch } from 'react-redux';
import { createPost, updatePost, deletePost } from '../../store/posts'; // Add deletePost import

function PostModal({ onClose, post }) {
    console.log('Rendering PostModal with post:', post);
    const [photo, setPhoto] = useState(null);
    const [body, setBody] = useState(post ? post.body : "");
    const dispatch = useDispatch();

    useEffect(() => {
        if (post) {
            setBody(post.body);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('post[body]', body);
        if (photo) {
            formData.append('post[photo]', photo);
        }
    
        if (post) {
            formData.append('post[id]', post.id);
        }
    
        // Log the FormData entries here, before the API call
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
    
        if (post) {
            try {
                await dispatch(updatePost(formData));
            } catch (error) {
                console.error("Failed to update post:", error);
            }
        } else {
            try {
                dispatch(createPost(body, photo)); // Use the state variables directly
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
            } catch (error) {
                console.error("Failed to delete post:", error);
            }
        }
        onClose();
    }
    const handleFile = (e) => {
        setPhoto(e.currentTarget.files[0]);
    };
    

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
                {photo && <img src={URL.createObjectURL(photo)} alt="Selected" className="selectedPhoto" />}
                <div>
                    <input type="file" onChange={handleFile} />
                    <button onClick={handleSubmit}>{post ? "Update" : "Post"}</button>
                    {post && <button onClick={handleDelete}>Delete</button>}
                </div>
            </div>
        </div>,
        modalNode
    );
}

export default PostModal;


