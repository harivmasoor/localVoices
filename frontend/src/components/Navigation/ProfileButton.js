import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { ProfileModal } from '../../context/ProfileModal';  // <-- Import the Modal
import exitIcon from '../../assets/exit.svg'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);  // Change the name of the state variable for clarity
  
  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };
  
  useEffect(() => {
    if (!showModal) return;

    const closeModal = () => {
      setShowModal(false);
    };

    document.addEventListener('click', closeModal);
  
    return () => document.removeEventListener("click", closeModal);
  }, [showModal]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <div className="profile-button-container">
        <button onClick={openModal}>
          <i className="fa-solid fa-user-circle" />
        </button>
      </div>
      {showModal && (
        <ProfileModal onClose={() => setShowModal(false)}>
          <div className="profile-modal-content">
            <h2>{user.username}</h2>
            <button onClick={logout} className="logout-button">
                        <img src={exitIcon} alt="Logout" title="Logout" />
                    </button>
          </div>
        </ProfileModal>
      )}
    </>
  );  
}  

export default ProfileButton;