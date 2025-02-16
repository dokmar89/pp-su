// src/app/(auth)/register/page.tsx
import React from 'react';
import RegistrationForm from '../../../components/RegistrationForm';

const RegisterPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>Registrace</h1>
      <RegistrationForm />
    </div>
  );
};

export default RegisterPage;
