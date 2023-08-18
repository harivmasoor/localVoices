import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../../context/ModalContext'; 
import './ProfileModal.css';

export function ProfileModal({ onClose, children }) {
  const modalNode = useContext(ModalContext);

  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div id="profile-modal">
      <div id="profile-modal-background" onClick={onClose} />
      <div id="profile-modal-content">
        {children}
      </div>
    </div>,
    modalNode
  );
}
