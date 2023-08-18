import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../store/posts';

function PostModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title, // Add the title
      body,
    };

    dispatch(createPost(newPost));
    onClose();
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind?"
      />
      <button onClick={handleSubmit}>Post</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default PostModal;

