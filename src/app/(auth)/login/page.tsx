// src/app/(auth)/login/page.tsx
import React from 'react';
import LoginForm from '../../../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>Přihlášení</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
