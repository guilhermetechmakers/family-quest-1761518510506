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
  EyeOff
} from 'lucide-react';
import { useSecuritySettings, useEnable2FA, useVerify2FA, useDisable2FA } from '@/hooks/useProfile';
import { useSignOut } from '@/hooks/useAuth';
import { ChangePasswordModal } from './ChangePasswordModal';
import { TwoFactorModal } from './TwoFactorModal';
import { cn } from '@/lib/utils';

export function Security() {
  const { data: securitySettings, isLoading } = useSecuritySettings();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

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

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
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

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-mint-green" />
          <h3 className="text-xl font-semibold text-text-primary">
            Security Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Password */}
          <div className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-mint-green/20 rounded-lg">
                <Key className="h-5 w-5 text-mint-green" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Password</h4>
                <p className="text-sm text-text-secondary">
                  Last changed {new Date(securitySettings.last_password_change).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="hover:bg-mint-green hover:text-text-primary"
            >
              Change Password
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-mint-green/20 rounded-lg">
                <Smartphone className="h-5 w-5 text-mint-green" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-text-primary">Two-Factor Authentication</h4>
                  <Badge 
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1',
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
                  className="hover:bg-red-100 hover:text-red-600"
                  disabled={disable2FA.isPending}
                >
                  Disable 2FA
                </Button>
              ) : (
                <Button
                  onClick={handleEnable2FA}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                  disabled={enable2FA.isPending}
                >
                  Enable 2FA
                </Button>
              )}
            </div>
          </div>

          {/* Backup Codes */}
          {securitySettings.two_factor_enabled && securitySettings.backup_codes.length > 0 && (
            <div className="p-4 bg-mint-tint rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-primary">Backup Codes</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                  className="hover:bg-mint-green hover:text-text-primary"
                >
                  {showBackupCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Save these codes in a safe place. You can use them to access your account if you lose your device.
              </p>
              {showBackupCodes && (
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {securitySettings.backup_codes.map((code, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-center">
                      {code}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account Security Info */}
          <div className="p-4 bg-pale-lavender-bg rounded-xl">
            <h4 className="font-semibold text-text-primary mb-2">Account Security</h4>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>• Login attempts: {securitySettings.login_attempts}</p>
              {securitySettings.locked_until && (
                <p>• Account locked until: {new Date(securitySettings.locked_until).toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full hover:bg-red-100 hover:text-red-600 hover:border-red-300"
              disabled={signOut.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
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