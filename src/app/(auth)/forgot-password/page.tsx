// src/app/(auth)/forgot-password/page.tsx
import React from 'react';
import ForgotPasswordForm from '../../../components/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>Obnova hesla</h1>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
