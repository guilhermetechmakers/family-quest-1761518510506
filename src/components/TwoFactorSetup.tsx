import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Shield, 
  Smartphone, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { securityApi } from '@/api/security';

const verify2FASchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

type Verify2FAForm = z.infer<typeof verify2FASchema>;

interface TwoFactorSetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

interface TwoFactorData {
  qr_code: string;
  backup_codes: string[];
  secret: string;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ 
  onSuccess,
  onCancel,
  className = '' 
}) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'success'>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Verify2FAForm>({
    resolver: zodResolver(verify2FASchema),
  });

  useEffect(() => {
    initialize2FA();
  }, []);

  const initialize2FA = async () => {
    setIsLoading(true);
    try {
      const data = await securityApi.enable2FA();
      setTwoFactorData(data);
    } catch (error) {
      toast.error('Failed to initialize 2FA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Verify2FAForm) => {
    setIsLoading(true);
    try {
      await securityApi.verify2FA(data.code);
      setStep('success');
      toast.success('2FA enabled successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Backup code copied!');
  };

  const handleDownloadBackupCodes = () => {
    if (!twoFactorData) return;
    
    const codesText = twoFactorData.backup_codes.join('\n');
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

  const handleRegenerateCodes = async () => {
    setIsLoading(true);
    try {
      const newCodes = await securityApi.generateBackupCodes();
      setTwoFactorData(prev => prev ? { ...prev, backup_codes: newCodes } : null);
      toast.success('New backup codes generated!');
    } catch (error) {
      toast.error('Failed to generate new backup codes');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <Card className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Two-Factor Authentication Enabled!
          </h3>
          
          <p className="text-text-secondary mb-6">
            Your account is now protected with 2FA. You'll need to use your authenticator app or backup codes to sign in.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => setStep('setup')}
              variant="outline"
              className="btn-outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New Backup Codes
            </Button>
            
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="btn-outline"
              >
                Done
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  if (step === 'verify') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <Card className="p-6">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 bg-pale-lavender rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Smartphone className="w-6 h-6 text-text-primary" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Verify Setup
            </h3>
            
            <p className="text-sm text-text-secondary">
              Enter the 6-digit code from your authenticator app to complete the setup.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-text-primary">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                {...register('code')}
              />
              {errors.code && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.code.message}
                </motion.p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                ) : (
                  'Verify & Enable 2FA'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('setup')}
                className="btn-outline"
              >
                Back
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    );
  }

  if (isLoading && !twoFactorData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <Card className="p-6 text-center">
          <motion.div
            className="w-8 h-8 border-2 border-mint-green border-t-transparent rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-text-secondary">Setting up 2FA...</p>
        </Card>
      </motion.div>
    );
  }

  if (!twoFactorData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <Card className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Setup Failed
          </h3>
          
          <p className="text-text-secondary mb-4">
            Unable to initialize 2FA setup. Please try again.
          </p>
          
          <Button
            onClick={initialize2FA}
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : (
              'Retry Setup'
            )}
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 bg-pale-lavender rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-6 h-6 text-text-primary" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Enable Two-Factor Authentication
          </h3>
          
          <p className="text-sm text-text-secondary">
            Add an extra layer of security to your account.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Install Authenticator App */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Step 1: Install an Authenticator App</h4>
            <p className="text-sm text-text-secondary">
              Download and install an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
            </p>
          </div>

          {/* Step 2: Scan QR Code */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Step 2: Scan QR Code</h4>
            <p className="text-sm text-text-secondary">
              Use your authenticator app to scan this QR code:
            </p>
            
            <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-gray-200">
              <img 
                src={twoFactorData.qr_code} 
                alt="2FA QR Code" 
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Step 3: Manual Entry */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Step 3: Manual Entry (Alternative)</h4>
            <p className="text-sm text-text-secondary">
              If you can't scan the QR code, enter this secret key manually:
            </p>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <code className="flex-1 text-sm font-mono text-text-primary">
                {twoFactorData.secret}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyCode(twoFactorData.secret)}
                className="btn-outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Backup Codes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">Step 4: Save Backup Codes</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="btn-outline"
              >
                {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showBackupCodes ? 'Hide' : 'Show'} Codes
              </Button>
            </div>
            
            <p className="text-sm text-text-secondary">
              Save these backup codes in a safe place. You can use them to access your account if you lose your device.
            </p>
            
            {showBackupCodes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
                  {twoFactorData.backup_codes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <code className="text-sm font-mono text-text-primary">{code}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(code)}
                        className="p-1 h-auto"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadBackupCodes}
                    className="btn-outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRegenerateCodes}
                    disabled={isLoading}
                    className="btn-outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setStep('verify')}
              className="flex-1 btn-primary"
            >
              Continue to Verification
            </Button>
            
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="btn-outline"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Security Warning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-pastel-yellow/20 border border-pastel-yellow/40 rounded-lg"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            ⚠️ Important Security Notice
          </h4>
          <ul className="text-xs text-text-secondary space-y-1">
            <li>• Store backup codes in a secure location</li>
            <li>• Each backup code can only be used once</li>
            <li>• You'll need either your authenticator app or a backup code to sign in</li>
            <li>• Contact support if you lose access to both</li>
          </ul>
        </motion.div>
      </Card>
    </motion.div>
  );
};