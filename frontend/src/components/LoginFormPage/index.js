import React from 'react';
import LoginForm from './LoginForm';

function LoginFormPage({ setShowSignupModal }) {
  return (
    <div>
      <LoginForm setShowSignupModal={setShowSignupModal} />
    </div>
  );
}

export default LoginFormPage;



