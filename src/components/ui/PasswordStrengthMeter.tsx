import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Contains number', test: (pwd) => /\d/.test(pwd) },
  { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

const getStrengthLevel = (password: string): { level: number; label: string; color: string } => {
  const passedRequirements = requirements.filter(req => req.test(password)).length;
  const percentage = (passedRequirements / requirements.length) * 100;

  if (percentage < 20) return { level: 0, label: 'Very Weak', color: 'bg-red-500' };
  if (percentage < 40) return { level: 1, label: 'Weak', color: 'bg-orange-500' };
  if (percentage < 60) return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
  if (percentage < 80) return { level: 3, label: 'Good', color: 'bg-blue-500' };
  return { level: 4, label: 'Strong', color: 'bg-mint-green' };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  className = '' 
}) => {
  const strength = getStrengthLevel(password);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-secondary">Password Strength</span>
          <span className={`text-sm font-semibold ${
            strength.level < 2 ? 'text-red-500' : 
            strength.level < 4 ? 'text-yellow-500' : 
            'text-mint-green'
          }`}>
            {strength.label}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${strength.color} transition-colors duration-300`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength.level + 1) * 20}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          
          return (
            <motion.div
              key={requirement.label}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isMet ? 'bg-mint-green' : 'bg-gray-300'
                }`}
                animate={{ scale: isMet ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isMet ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <X className="w-3 h-3 text-gray-500" />
                )}
              </motion.div>
              <span className={`text-sm ${
                isMet ? 'text-mint-green font-medium' : 'text-text-tertiary'
              }`}>
                {requirement.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Security Tips */}
      {password.length > 0 && strength.level < 3 && (
        <motion.div
          className="p-3 bg-pastel-yellow/20 border border-pastel-yellow/40 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-text-secondary">
            💡 <strong>Tip:</strong> Try adding numbers, special characters, or making it longer for better security.
          </p>
        </motion.div>
      )}
    </div>
  );
};