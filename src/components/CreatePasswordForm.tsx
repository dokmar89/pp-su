// src/components/CreatePasswordForm.tsx
import React, { useState, useEffect } from 'react';
import PasswordInput from './ui/PasswordInput';
import Button from './ui/Button';
import Notification from './ui/Notification';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const CreatePasswordForm: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { token } = router.query;
    if (typeof token === 'string') {
      setToken(token);
    }
  }, [router.query]);

  const validate = () => {
    if (!newPassword) return 'Nové heslo je povinné.';
    if (newPassword !== confirmPassword) return 'Hesla se neshodují.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!token) {
      setError('Token chybí.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const { error: supabaseError } = await supabase.auth.updateUser({
        password: newPassword,
        access_token: token,
      });
      if (supabaseError) {
        setNotification({ type: 'error', message: supabaseError.message });
      } else {
        setNotification({ type: 'success', message: 'Heslo bylo úspěšně nastaveno.' });
        setTimeout(() => router.push('/login'), 2000);
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
      <PasswordInput
        label="Nové heslo"
        placeholder="Zadejte nové heslo"
        value={newPassword}
        onChange={setNewPassword}
        required
      />
      <PasswordInput
        label="Potvrzení hesla"
        placeholder="Potvrďte nové heslo"
        value={confirmPassword}
        onChange={setConfirmPassword}
        required
      />
      <Button label={isSubmitting ? 'Odesílám...' : 'Nastavit heslo'} onClick={handleSubmit} disabled={isSubmitting} />
    </form>
  );
};

export default CreatePasswordForm;
