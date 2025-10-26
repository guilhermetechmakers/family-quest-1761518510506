import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  isVerifying: boolean;
}

export function TwoFactorModal({ isOpen, onClose, onVerify, isVerifying }: TwoFactorModalProps) {
  const [code, setCode] = useState('');

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(numericValue);
    
    // Auto-submit when 6 digits are entered
    if (numericValue.length === 6) {
      handleVerify(numericValue);
    }
  };

  const handleVerify = (verificationCode?: string) => {
    const codeToVerify = verificationCode || code;
    if (codeToVerify.length === 6) {
      onVerify(codeToVerify);
    }
  };

  const handleClose = () => {
    setCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <Shield className="h-5 w-5 text-mint-green" />
            <span>Two-Factor Authentication</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Setup Instructions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-mint-tint rounded-xl">
              <Smartphone className="h-6 w-6 text-mint-green" />
              <div>
                <h3 className="font-semibold text-text-primary">Setup Instructions</h3>
                <p className="text-sm text-text-secondary">
                  Scan the QR code with your authenticator app
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-center p-6 bg-pale-lavender-bg rounded-xl">
                <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-mint-green">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                      <Shield className="h-8 w-8 text-mint-green" />
                    </div>
                    <p className="text-xs text-text-tertiary">QR Code</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  Use Google Authenticator, Authy, or similar app
                </p>
              </div>

              <div className="space-y-2 p-4 bg-pale-lavender-bg rounded-xl">
                <h4 className="font-medium text-text-primary">Manual Setup Key:</h4>
                <div className="font-mono text-sm bg-white p-2 rounded border break-all">
                  JBSWY3DPEHPK3PXP
                </div>
                <p className="text-xs text-text-tertiary">
                  Enter this key manually if you can't scan the QR code
                </p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-mint-green" />
              <h3 className="font-semibold text-text-primary">Verify Setup</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code" className="text-sm font-medium text-text-primary">
                Enter 6-digit code from your app
              </Label>
              <Input
                id="verification-code"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="text-center text-2xl font-mono tracking-widest hover:border-mint-green focus:border-mint-green"
                placeholder="000000"
                maxLength={6}
                disabled={isVerifying}
              />
              <p className="text-xs text-text-tertiary text-center">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </div>

          {/* Backup Codes */}
          <div className="space-y-3 p-4 bg-mint-tint rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-mint-green" />
              <h4 className="font-medium text-text-primary">Backup Codes</h4>
            </div>
            <p className="text-sm text-text-secondary">
              Save these codes in a safe place. You can use them to access your account if you lose your device.
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678'].map((code, index) => (
                <div key={index} className="p-2 bg-white rounded border text-center">
                  {code}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 hover:bg-gray-100"
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleVerify()}
              disabled={code.length !== 6 || isVerifying}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Enable'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}