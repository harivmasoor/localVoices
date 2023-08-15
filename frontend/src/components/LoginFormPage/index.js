import React from 'react';
import LoginForm from './LoginForm';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

function LoginFormPage() {

  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default LoginFormPage;



