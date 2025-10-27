import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, MapPin } from 'lucide-react';

interface BillingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingInformationFormProps {
  billingInfo: BillingInfo;
  onUpdateBillingInfo: (info: BillingInfo) => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export function BillingInformationForm({ billingInfo, onUpdateBillingInfo }: BillingInformationFormProps) {
  const handleInputChange = (field: keyof BillingInfo, value: string) => {
    onUpdateBillingInfo({
      ...billingInfo,
      [field]: value
    });
  };

  return (
    <Card className="bg-white border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-text-primary">
          <div className="p-2 bg-light-pink rounded-full">
            <User className="h-5 w-5 text-text-primary" />
          </div>
          Billing Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Address - Required */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="text-text-primary font-medium">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={billingInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-text-secondary">
            We'll send your receipt to this email address
          </p>
        </motion.div>

        {/* Name Fields */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-text-primary font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={billingInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-text-primary font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={billingInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="address" className="text-text-primary font-medium">
            Street Address
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input
              id="address"
              type="text"
              placeholder="123 Main Street"
              value={billingInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* City, State, ZIP */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="city" className="text-text-primary font-medium">
              City
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="New York"
              value={billingInfo.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-text-primary font-medium">
              State
            </Label>
            <Select
              value={billingInfo.state}
              onValueChange={(value) => handleInputChange('state', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-text-primary font-medium">
              ZIP Code
            </Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="10001"
              value={billingInfo.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
            />
          </div>
        </motion.div>

        {/* Country */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Label htmlFor="country" className="text-text-primary font-medium">
            Country
          </Label>
          <Select
            value={billingInfo.country}
            onValueChange={(value) => handleInputChange('country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="ES">Spain</SelectItem>
              <SelectItem value="IT">Italy</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
              <SelectItem value="BR">Brazil</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-light-pink/30 rounded-xl p-3 border border-light-pink/50"
        >
          <div className="flex items-start gap-2">
            <div className="p-1 bg-light-pink rounded-full mt-0.5">
              <User className="h-3 w-3 text-text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Privacy Protected</p>
              <p className="text-xs text-text-secondary">
                Your billing information is only used for payment processing and receipt delivery. 
                We never share your personal details with third parties.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}