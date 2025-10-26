import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500', 
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ];

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 flex-1 rounded-full transition-all duration-200",
              level <= strength ? strengthColors[strength - 1] : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      <p className="text-sm text-text-secondary">
        Password strength: <span className="font-medium">{strengthLabels[strength - 1] || 'Very Weak'}</span>
      </p>
    </div>
  );
}