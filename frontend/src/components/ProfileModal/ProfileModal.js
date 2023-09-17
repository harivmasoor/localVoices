import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux'; // Import the useSelector hook
import ModalContext from '../../context/ModalContext'; 
import './ProfileModal.css';

export function ProfileModal({ onClose, children }) {
  const modalNode = useContext(ModalContext);

  // Use the useSelector hook to get the username from the session or profile state
  const username = useSelector(state => state.session.user.username); // Assuming the session state has the user details

  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div id="profile-modal">
      <div id="profile-modal-background" onClick={onClose} />
      <div id="profile-modal-content">
        {children}
        {username && <a href={`/profile/${username}`} className="view-profile-link">View profile</a>}
      </div>
    </div>,
    modalNode
  );
}

