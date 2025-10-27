import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  Smartphone, 
  LogOut, 
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Clock,
  AlertTriangle,
  Download,
  Copy
} from 'lucide-react';
import { useSecuritySettings, useEnable2FA, useVerify2FA, useDisable2FA } from '@/hooks/useProfile';
import type { PaymentSecuritySettings } from '@/types/payment';
import { useSignOut } from '@/hooks/useAuth';
import { ChangePasswordModal } from './ChangePasswordModal';
import { TwoFactorModal } from './TwoFactorModal';
import { cn } from '@/lib/utils';

export function Security() {
  const { data: securitySettings, isLoading } = useSecuritySettings() as { data: PaymentSecuritySettings | undefined; isLoading: boolean };
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const enable2FA = useEnable2FA();
  const verify2FA = useVerify2FA();
  const disable2FA = useDisable2FA();
  const signOut = useSignOut();

  const handleEnable2FA = async () => {
    try {
      await enable2FA.mutateAsync();
      setIs2FAModalOpen(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDisable2FA = () => {
    if (window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      const password = prompt('Please enter your password to confirm:');
      if (password) {
        disable2FA.mutate(password);
      }
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      signOut.mutate();
    }
  };

  const copyBackupCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const downloadBackupCodes = () => {
    if (!securitySettings?.backup_codes) return;
    
    const codesText = securitySettings.backup_codes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-quest-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSecurityScore = () => {
    if (!securitySettings) return 0;
    let score = 0;
    if (securitySettings.two_factor_enabled) score += 40;
    if (securitySettings.backup_codes.length > 0) score += 20;
    const daysSincePasswordChange = Math.floor((Date.now() - new Date(securitySettings.last_password_change).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSincePasswordChange < 90) score += 20;
    if (securitySettings.login_attempts < 3) score += 20;
    return Math.min(score, 100);
  };

  if (isLoading) {
    return (
      <Card className="p-8 animate-pulse">
        <div className="space-y-8">
          <div className="h-7 bg-gray-200 rounded w-48"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!securitySettings) {
    return null;
  }

  const securityScore = getSecurityScore();

  return (
    <>
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <Shield className="h-6 w-6 text-mint-green" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">
                Security Settings
              </h3>
              <p className="text-sm text-text-secondary">
                Manage your account security and privacy
              </p>
            </div>
          </div>

          {/* Security Score */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-text-secondary">Security Score</div>
              <div className="text-2xl font-bold text-text-primary">{securityScore}/100</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={cn(
                    "transition-all duration-500",
                    securityScore >= 80 ? "text-mint-green" : 
                    securityScore >= 60 ? "text-pastel-yellow" : "text-light-pink"
                  )}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${securityScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Password */}
          <div className="p-6 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-mint-green/20 rounded-xl">
                  <Key className="h-6 w-6 text-mint-green" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary">Password</h4>
                  <p className="text-sm text-text-secondary">
                    Last changed {new Date(securitySettings.last_password_change).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary">
                      {Math.floor((Date.now() - new Date(securitySettings.last_password_change).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="hover:bg-mint-green hover:text-text-primary transition-colors duration-200"
              >
                Change Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="p-6 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-mint-green/20 rounded-xl">
                  <Smartphone className="h-6 w-6 text-mint-green" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-text-primary">Two-Factor Authentication</h4>
                    <Badge 
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1',
                        securitySettings.two_factor_enabled 
                          ? 'bg-mint-green text-text-primary' 
                          : 'bg-pastel-yellow text-text-primary'
                      )}
                    >
                      {securitySettings.two_factor_enabled ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          <span>Disabled</span>
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {securitySettings.two_factor_enabled 
                      ? 'Your account is protected with 2FA'
                      : 'Add an extra layer of security to your account'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {securitySettings.two_factor_enabled ? (
                  <Button
                    variant="outline"
                    onClick={handleDisable2FA}
                    className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                    disabled={disable2FA.isPending}
                  >
                    Disable 2FA
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnable2FA}
                    className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
                    disabled={enable2FA.isPending}
                  >
                    Enable 2FA
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Backup Codes */}
          {securitySettings.two_factor_enabled && securitySettings.backup_codes.length > 0 && (
            <div className="p-6 bg-mint-tint rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-mint-green/20 rounded-lg">
                    <Lock className="h-5 w-5 text-mint-green" />
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary">Backup Codes</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadBackupCodes}
                    className="hover:bg-mint-green hover:text-text-primary"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className="hover:bg-mint-green hover:text-text-primary"
                  >
                    {showBackupCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Save these codes in a safe place. You can use them to access your account if you lose your device.
              </p>
              {showBackupCodes && (
                <div className="grid grid-cols-2 gap-3">
                  {securitySettings.backup_codes.map((code, index) => (
                    <div key={index} className="relative group">
                      <div className="p-3 bg-white rounded-lg border font-mono text-sm text-center hover:bg-mint-tint transition-colors duration-200">
                        {code}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyBackupCode(code)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        {copiedCode === code ? (
                          <CheckCircle className="h-3 w-3 text-mint-green" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account Security Info */}
          <div className="p-6 bg-pale-lavender-bg rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-light-purple/20 rounded-lg">
                <Shield className="h-5 w-5 text-light-purple" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary">Account Security</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-text-tertiary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Login Attempts</p>
                  <p className="text-xs text-text-secondary">{securitySettings.login_attempts} recent attempts</p>
                </div>
              </div>
              {securitySettings.locked_until && (
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-pastel-yellow" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Account Locked</p>
                    <p className="text-xs text-text-secondary">
                      Until {new Date(securitySettings.locked_until).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors duration-200"
              disabled={signOut.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {signOut.isPending ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </Card>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />

      <TwoFactorModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onVerify={verify2FA.mutate}
        isVerifying={verify2FA.isPending}
      />
    </>
  );
}