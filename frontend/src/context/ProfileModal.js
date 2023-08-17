import React, { useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ProfileModal.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, [])

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function ProfileModal({ onClose, children }) {
  const modalNode = useContext(ModalContext);
  const [selected, setSelected] = useState(null);

  const onFileChange = (e) => {
    setSelected(e.target.files[0]);
  };
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