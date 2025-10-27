import { useState } from 'react';
import { 
  Settings,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    // Authentication Settings
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    
    // Session Settings
    sessionTimeoutMinutes: 60,
    requireReauthForSensitiveActions: true,
    allowConcurrentSessions: false,
    
    // Security Features
    enable2FA: true,
    enableAuditLogging: true,
    enableIPWhitelist: false,
    enableRateLimiting: true,
    enableCSRFProtection: true,
    
    // Data Protection
    enableDataEncryption: true,
    enableBackupEncryption: true,
    dataRetentionDays: 365,
    enableGDPRCompliance: true,
    
    // Monitoring
    enableSecurityAlerts: true,
    enableSuspiciousActivityDetection: true,
    alertThreshold: 'medium',
    enableRealTimeMonitoring: true
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings saved successfully');
    } catch (error) {
      toast.error('Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    toast.success('Settings reset to defaults');
  };

  const handleExport = () => {
    toast.success('Security settings exported successfully');
  };

  const handleImport = () => {
    toast.success('Security settings imported successfully');
  };

  const getSecurityScore = () => {
    let score = 0;
    const totalChecks = 15;
    
    if (settings.passwordMinLength >= 8) score++;
    if (settings.passwordRequireUppercase) score++;
    if (settings.passwordRequireNumbers) score++;
    if (settings.passwordRequireSymbols) score++;
    if (settings.passwordExpiryDays <= 90) score++;
    if (settings.maxLoginAttempts <= 5) score++;
    if (settings.sessionTimeoutMinutes <= 60) score++;
    if (settings.requireReauthForSensitiveActions) score++;
    if (settings.enable2FA) score++;
    if (settings.enableAuditLogging) score++;
    if (settings.enableRateLimiting) score++;
    if (settings.enableCSRFProtection) score++;
    if (settings.enableDataEncryption) score++;
    if (settings.enableSecurityAlerts) score++;
    if (settings.enableSuspiciousActivityDetection) score++;
    
    return Math.round((score / totalChecks) * 100);
  };

  const securityScore = getSecurityScore();

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Security Settings</h2>
          <p className="text-text-secondary">Configure security policies and access controls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Security Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Security Score</h3>
          <Badge className={cn("text-white", getScoreBadgeColor(securityScore))}>
            {securityScore}/100
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                securityScore >= 80 ? "bg-green-500" : 
                securityScore >= 60 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${securityScore}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-secondary">
            {securityScore >= 80 ? 'Excellent security configuration' :
             securityScore >= 60 ? 'Good security configuration' : 
             'Security configuration needs improvement'}
          </p>
        </div>
      </Card>

      {/* Authentication Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Authentication Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Minimum Password Length
            </label>
            <Input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
              min="6"
              max="32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password Expiry (Days)
            </label>
            <Input
              type="number"
              value={settings.passwordExpiryDays}
              onChange={(e) => handleSettingChange('passwordExpiryDays', parseInt(e.target.value))}
              min="30"
              max="365"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Max Login Attempts
            </label>
            <Input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
              min="3"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Lockout Duration (Minutes)
            </label>
            <Input
              type="number"
              value={settings.lockoutDurationMinutes}
              onChange={(e) => handleSettingChange('lockoutDurationMinutes', parseInt(e.target.value))}
              min="5"
              max="60"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Require Uppercase Letters</label>
              <p className="text-xs text-text-secondary">Passwords must contain uppercase letters</p>
            </div>
            <Switch
              checked={settings.passwordRequireUppercase}
              onCheckedChange={(checked) => handleSettingChange('passwordRequireUppercase', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Require Numbers</label>
              <p className="text-xs text-text-secondary">Passwords must contain numbers</p>
            </div>
            <Switch
              checked={settings.passwordRequireNumbers}
              onCheckedChange={(checked) => handleSettingChange('passwordRequireNumbers', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Require Symbols</label>
              <p className="text-xs text-text-secondary">Passwords must contain special characters</p>
            </div>
            <Switch
              checked={settings.passwordRequireSymbols}
              onCheckedChange={(checked) => handleSettingChange('passwordRequireSymbols', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Session Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Session Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Session Timeout (Minutes)
            </label>
            <Input
              type="number"
              value={settings.sessionTimeoutMinutes}
              onChange={(e) => handleSettingChange('sessionTimeoutMinutes', parseInt(e.target.value))}
              min="15"
              max="480"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Data Retention (Days)
            </label>
            <Input
              type="number"
              value={settings.dataRetentionDays}
              onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
              min="30"
              max="2555"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Require Re-authentication for Sensitive Actions</label>
              <p className="text-xs text-text-secondary">Users must re-enter password for sensitive operations</p>
            </div>
            <Switch
              checked={settings.requireReauthForSensitiveActions}
              onCheckedChange={(checked) => handleSettingChange('requireReauthForSensitiveActions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Allow Concurrent Sessions</label>
              <p className="text-xs text-text-secondary">Allow users to be logged in from multiple devices</p>
            </div>
            <Switch
              checked={settings.allowConcurrentSessions}
              onCheckedChange={(checked) => handleSettingChange('allowConcurrentSessions', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Security Features */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Security Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Enable Two-Factor Authentication</label>
              <p className="text-xs text-text-secondary">Require 2FA for all user accounts</p>
            </div>
            <Switch
              checked={settings.enable2FA}
              onCheckedChange={(checked) => handleSettingChange('enable2FA', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Enable Audit Logging</label>
              <p className="text-xs text-text-secondary">Log all user actions and system events</p>
            </div>
            <Switch
              checked={settings.enableAuditLogging}
              onCheckedChange={(checked) => handleSettingChange('enableAuditLogging', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Enable Rate Limiting</label>
              <p className="text-xs text-text-secondary">Limit API requests per user/IP</p>
            </div>
            <Switch
              checked={settings.enableRateLimiting}
              onCheckedChange={(checked) => handleSettingChange('enableRateLimiting', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Enable CSRF Protection</label>
              <p className="text-xs text-text-secondary">Protect against cross-site request forgery</p>
            </div>
            <Switch
              checked={settings.enableCSRFProtection}
              onCheckedChange={(checked) => handleSettingChange('enableCSRFProtection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Enable Data Encryption</label>
              <p className="text-xs text-text-secondary">Encrypt sensitive data at rest</p>
            </div>
            <Switch
              checked={settings.enableDataEncryption}
              onCheckedChange={(checked) => handleSettingChange('enableDataEncryption', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Advanced Settings */}
      {showAdvanced && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Advanced Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">Enable IP Whitelist</label>
                <p className="text-xs text-text-secondary">Restrict access to specific IP addresses</p>
              </div>
              <Switch
                checked={settings.enableIPWhitelist}
                onCheckedChange={(checked) => handleSettingChange('enableIPWhitelist', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">Enable Security Alerts</label>
                <p className="text-xs text-text-secondary">Send alerts for suspicious activities</p>
              </div>
              <Switch
                checked={settings.enableSecurityAlerts}
                onCheckedChange={(checked) => handleSettingChange('enableSecurityAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">Enable Suspicious Activity Detection</label>
                <p className="text-xs text-text-secondary">Automatically detect and flag suspicious behavior</p>
              </div>
              <Switch
                checked={settings.enableSuspiciousActivityDetection}
                onCheckedChange={(checked) => handleSettingChange('enableSuspiciousActivityDetection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">Enable Real-time Monitoring</label>
                <p className="text-xs text-text-secondary">Monitor security events in real-time</p>
              </div>
              <Switch
                checked={settings.enableRealTimeMonitoring}
                onCheckedChange={(checked) => handleSettingChange('enableRealTimeMonitoring', checked)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Alert Threshold
              </label>
              <Select
                value={settings.alertThreshold}
                onValueChange={(value) => handleSettingChange('alertThreshold', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-mint-green hover:bg-mint-green/90 text-text-primary"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}