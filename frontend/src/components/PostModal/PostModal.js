import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../../context/ModalContext'; 
import './PostModal.css';
import { useDispatch } from 'react-redux';
import { createPost } from '../../store/posts';

function PostModal({ onClose }) {
//   const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
    //   title,
      body
    };

    dispatch(createPost(newPost));
    onClose();
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
        <div>
          <button onClick={handleSubmit}>Post</button>
        </div>
      </div>
    </div>,
    modalNode
  );
}

export default PostModal;

