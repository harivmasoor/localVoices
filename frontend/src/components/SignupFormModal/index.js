import React from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';

function SignupFormModal({ showModal, setShowModal }) {
  return (
    <>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupForm />
        </Modal>
      )}
    </>
  );
}

export default SignupFormModal;

