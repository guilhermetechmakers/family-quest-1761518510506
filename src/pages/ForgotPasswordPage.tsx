import React from 'react';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="auth-container">
      <PasswordResetForm />
    </div>
  );
};