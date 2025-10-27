import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TermsAcknowledgementProps {
  onAccept: (accepted: boolean) => void;
  accepted?: boolean;
  disabled?: boolean;
  showDetails?: boolean;
}

export function TermsAcknowledgement({ 
  onAccept, 
  accepted = false, 
  disabled = false,
  showDetails = false 
}: TermsAcknowledgementProps) {
  const [showTerms, setShowTerms] = useState(false);

  const handleAcceptanceChange = (checked: boolean) => {
    onAccept(checked);
  };

  return (
    <Card className="p-6 bg-mint-tint border-mint-green/20">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {accepted ? (
            <CheckCircle className="h-6 w-6 text-mint-green" />
          ) : (
            <AlertCircle className="h-6 w-6 text-pastel-yellow" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-text-primary">
              Terms of Service Agreement
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTerms(!showTerms)}
              className="text-mint-green hover:text-mint-green/80"
            >
              <FileText className="h-4 w-4 mr-1" />
              {showTerms ? 'Hide' : 'View'} Details
            </Button>
          </div>

          {showDetails && showTerms && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-mint-green/20">
              <div className="text-sm text-text-secondary space-y-2">
                <p>
                  By creating an account, you agree to our Terms of Service, which include:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Acceptable use policies and family safety guidelines</li>
                  <li>Payment processing and contribution terms</li>
                  <li>Privacy protections and data handling practices</li>
                  <li>Family role management and parental controls</li>
                  <li>Service availability and limitation of liability</li>
                </ul>
                <p className="text-xs text-text-tertiary mt-3">
                  Last updated: December 15, 2024 • Version 2.1
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms-acceptance"
              checked={accepted}
              onCheckedChange={handleAcceptanceChange}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <label 
                htmlFor="terms-acceptance" 
                className="text-sm text-text-secondary cursor-pointer"
              >
                I have read and agree to the{' '}
                <Link 
                  to="/terms" 
                  target="_blank"
                  className="text-mint-green hover:text-mint-green/80 underline inline-flex items-center"
                >
                  Terms of Service
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
                {' '}and understand my rights and responsibilities as a Family Quest user.
              </label>
              
              {!accepted && !disabled && (
                <p className="text-xs text-text-tertiary mt-2">
                  You must accept our Terms of Service to create an account.
                </p>
              )}
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-mint-green/20">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/terms" target="_blank">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    Read Full Terms
                  </Button>
                </Link>
                <Link to="/privacy" target="_blank">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    Privacy Policy
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Compact version for forms
export function TermsCheckbox({ 
  onAccept, 
  accepted = false, 
  disabled = false 
}: Omit<TermsAcknowledgementProps, 'showDetails'>) {
  const handleAcceptanceChange = (checked: boolean) => {
    onAccept(checked);
  };

  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        id="terms-checkbox"
        checked={accepted}
        onCheckedChange={handleAcceptanceChange}
        disabled={disabled}
        className="mt-1"
      />
      <div className="flex-1">
        <label 
          htmlFor="terms-checkbox" 
          className="text-sm text-text-secondary cursor-pointer"
        >
          I agree to the{' '}
          <Link 
            to="/terms" 
            target="_blank"
            className="text-mint-green hover:text-mint-green/80 underline inline-flex items-center"
          >
            Terms of Service
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </label>
      </div>
    </div>
  );
}