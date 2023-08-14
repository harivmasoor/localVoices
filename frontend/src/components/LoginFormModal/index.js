import React from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal({ showModal, setShowModal, setShowSignupModal }) { 
  return (
    <>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginForm 
            setShowModal={setShowModal} 
            setShowSignupModal={setShowSignupModal} 
          />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;


