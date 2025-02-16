// src/components/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import EmailInput from './ui/EmailInput';
import Button from './ui/Button';
import Notification from './ui/Notification';
import { supabase } from '../lib/supabase';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email) return 'Email je povinný.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: '/reset-password',
      });
      if (supabaseError) {
        setNotification({ type: 'error', message: supabaseError.message });
      } else {
        setNotification({
          type: 'success',
          message: 'Instrukce pro obnovení hesla byly odeslány na váš email.',
        });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <EmailInput label="Email" placeholder="Zadejte váš email" value={email} onChange={setEmail} required />
      <Button label={isSubmitting ? 'Odesílám...' : 'Obnovit heslo'} onClick={handleSubmit} disabled={isSubmitting} />
    </form>
  );
};

export default ForgotPasswordForm;
