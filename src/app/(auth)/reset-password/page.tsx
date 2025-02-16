// src/app/(auth)/reset-password/page.tsx
import React from 'react';
import CreatePasswordForm from '../../../components/CreatePasswordForm';

const ResetPasswordPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>Vytvoření hesla</h1>
      <CreatePasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
