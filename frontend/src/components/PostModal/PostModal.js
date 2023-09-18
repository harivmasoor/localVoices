import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../../context/ModalContext';
import './PostModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, deletePost } from '../../store/posts'; // Add deletePost import
import uploadImageIcon from '../../assets/uploadImage.svg';

function PostModal({ onClose, post }) {
    const postErrors = useSelector(state => state.errors.posts);
    const [photo, setPhoto] = useState(null);
    const [body, setBody] = useState(post ? post.body : "");
    const dispatch = useDispatch();
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (post) {
            setBody(post.body);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) {
            setValidationError("Post body cannot be empty.");
            return;
        }
        const formData = new FormData();
        formData.append('post[body]', body);
        if (photo) {
            formData.append('post[photo]', photo);
        }
    
        if (post) {
            formData.append('post[id]', post.id);
        }
    
        // Log the FormData entries here, before the API call
        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
    
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
        setValidationError(null);
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
                {/* For Recommendation 5: Display post errors */}
                {postErrors && postErrors.map((error, idx) => (
                    <div key={idx} className="post-error">{error}</div>
                ))}

                {/* For Recommendation 6: Display client-side validation error */}
                {validationError && <div className="post-error">{validationError}</div>}

                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What's on your mind?"
                />
                {photo && <img src={URL.createObjectURL(photo)} alt="Selected" className="selectedPhoto" />}
                <label htmlFor="file-upload" className="custom-file-upload">
                    <img src={uploadImageIcon} alt="Upload Image" />
                </label>
                <div>
                <input id="file-upload" type="file" onChange={handleFile} style={{ display: 'none' }} />
                <button className="post-button" onClick={handleSubmit}>{post ? "Update" : "Post"}</button>
                {post && <button onClick={handleDelete}>Delete</button>}

                </div>
            </div>
        </div>,
        modalNode
    );
}

export default PostModal;


