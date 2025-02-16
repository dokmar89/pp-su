'use client';
// src/components/LoginForm.tsx
import React, { useState } from 'react';
import EmailInput from './ui/EmailInput';
import PasswordInput from './ui/PasswordInput';
import Checkbox from './ui/Checkbox';
import Button from './ui/Button';
import Notification from './ui/Notification';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email) return 'Email je povinný.';
    if (!password) return 'Heslo je povinné.';
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
      const { error: supabaseError } = await supabase.auth.signInWithPassword(
        { email, password },
        { remember: remember ? 'local' : 'session' }
      );
      if (supabaseError) {
        setNotification({ type: 'error', message: supabaseError.message });
      } else {
        setNotification({ type: 'success', message: 'Přihlášení bylo úspěšné.' });
        setTimeout(() => router.push('/dashboard'), 2000);
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
      <PasswordInput label="Heslo" placeholder="Zadejte heslo" value={password} onChange={setPassword} required />
      <Checkbox label="Zapamatovat si mě" checked={remember} onChange={setRemember} />
      <Button label={isSubmitting ? 'Odesílám...' : 'Přihlásit'} onClick={handleSubmit} disabled={isSubmitting} />
    </form>
  );
};

export default LoginForm;
