import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { ProfileModal } from '../ProfileModal/ProfileModal';  // <-- Import the Modal
import exitIcon from '../../assets/exit.svg'
import uploadImageIcon from '../../assets/uploadImage.svg';
import * as userActions from '../../store/user';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false); 

  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Here, dispatch an action to upload the file
    dispatch(userActions.uploadProfileImage(file, user));
};

  return (
    <>
      <div className="profile-button-container">
        <button className="profile-button-picture" onClick={openModal}>
          {user.photoUrl ? <img src={user.photoUrl} alt="Profile" /> : <i className="fa-solid fa-user-circle" />}
        </button>
      </div>
      {showModal && (
        <ProfileModal onClose={() => setShowModal(false)}>
<div className="profile-modal-content">
    <div className="modal-profile-wrapper">
        <input 
            type="file" 
            id="fileUpload" 
            className="file-input" 
            onChange={handleFileChange} 
            onClick={e => e.stopPropagation()} 
            style={{ display: 'none' }} // This will hide the actual input
        />
        <label htmlFor="fileUpload" className="change-profile-pic-button" onClick={e => e.stopPropagation()}>
            {user.photoUrl ? 
                <img className="modal-profile-pic" src={user.photoUrl} alt="Profile" /> 
                : 
                <i className="modal-profile-icon fa-solid fa-user-circle" />
            }
            <img src={uploadImageIcon} alt="Upload" className="upload-icon" />
        </label>
    </div>
    <div className="modal-username-wrapper">
        <h2>{user.username}</h2>
    </div>
    <div className="modal-logout-wrapper">
        <button onClick={logout} className="logout-button">
            <img src={exitIcon} alt="Logout" title="Logout" />
        </button>
    </div>
</div>
        </ProfileModal>
      )}
    </>
  );  
}  

export default ProfileButton;