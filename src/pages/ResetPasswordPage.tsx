import React from 'react';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';

export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="auth-container">
      <NewPasswordForm />
    </div>
  );
};