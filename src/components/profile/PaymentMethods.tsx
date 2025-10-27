import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Star,
  Eye,
  EyeOff,
  Calendar,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { usePaymentMethods, useDeletePaymentMethod, useSetDefaultPaymentMethod } from '@/hooks/useProfile';
import { AddPaymentMethodModal } from './AddPaymentMethodModal';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/api/payments';

const brandColors: Record<PaymentMethod['brand'], string> = {
  visa: 'bg-blue-500',
  mastercard: 'bg-red-500',
  amex: 'bg-green-500',
  discover: 'bg-orange-500',
  other: 'bg-gray-500',
};

const brandIcons: Record<PaymentMethod['brand'], string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
  other: 'CARD',
};

interface PaymentMethodsProps {
  currentUserRole: string;
}

export function PaymentMethods({ currentUserRole }: PaymentMethodsProps) {
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const deletePaymentMethod = useDeletePaymentMethod();
  const setDefaultPaymentMethod = useSetDefaultPaymentMethod();

  const canManagePayments = currentUserRole === 'parent' || currentUserRole === 'admin';

  const handleDeletePaymentMethod = (id: string, cardholderName: string) => {
    if (window.confirm(`Are you sure you want to remove ${cardholderName}'s payment method? This action cannot be undone.`)) {
      deletePaymentMethod.mutate(id);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod.mutate(id);
  };

  const isCardExpiringSoon = (expiryMonth: number, expiryYear: number) => {
    const now = new Date();
    const expiryDate = new Date(expiryYear, expiryMonth - 1);
    const monthsUntilExpiry = (expiryDate.getFullYear() - now.getFullYear()) * 12 + (expiryDate.getMonth() - now.getMonth());
    return monthsUntilExpiry <= 3;
  };

  if (!canManagePayments) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-8 animate-pulse">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-7 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-mint-green" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">
                Payment Methods
              </h3>
              <p className="text-sm text-text-secondary">
                Manage your payment methods for contributions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {paymentMethods && paymentMethods.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCardNumbers(!showCardNumbers)}
                className="hover:bg-mint-green hover:text-text-primary transition-colors duration-200"
              >
                {showCardNumbers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showCardNumbers ? 'Hide' : 'Show'} Numbers
              </Button>
            )}
            
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {paymentMethods?.map((method) => {
            const isExpiringSoon = isCardExpiringSoon(method.expiry_month, method.expiry_year);
            const isHovered = hoveredCard === method.id;
            
            return (
              <div
                key={method.id}
                className="group relative p-6 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(method.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={cn(
                        'w-16 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg',
                        brandColors[method.brand]
                      )}>
                        {brandIcons[method.brand]}
                      </div>
                      {isExpiringSoon && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-pastel-yellow rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-2 w-2 text-text-primary" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-mint-green transition-colors duration-200">
                          {method.cardholder_name}
                        </h4>
                        {method.is_default && (
                          <Badge className="bg-mint-green text-text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Default</span>
                          </Badge>
                        )}
                        {isExpiringSoon && (
                          <Badge className="bg-pastel-yellow text-text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Expiring Soon</span>
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <CreditCard className="h-3 w-3" />
                          <span className="font-mono">
                            {showCardNumbers 
                              ? `**** **** **** ${method.last_four_digits}` 
                              : `•••• •••• •••• ${method.last_four_digits}`
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                          <Calendar className="h-3 w-3" />
                          <span>Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center space-x-2 transition-all duration-200",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                  )}>
                    {!method.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        className="hover:bg-mint-green hover:text-text-primary transition-colors duration-200"
                        disabled={setDefaultPaymentMethod.isPending}
                        title="Set as default"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePaymentMethod(method.id, method.cardholder_name)}
                      className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                      disabled={deletePaymentMethod.isPending}
                      title="Remove payment method"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {(!paymentMethods || paymentMethods.length === 0) && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-pale-lavender-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-text-tertiary" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                No payment methods added yet
              </h4>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Add a payment method to start making contributions to your family goals.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          )}
        </div>

        {paymentMethods && paymentMethods.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 hover:bg-mint-green hover:text-text-primary transition-colors duration-200"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Transaction History
              </Button>
              <div className="flex items-center justify-center space-x-2 text-xs text-text-tertiary">
                <Lock className="h-3 w-3" />
                <span>All payment data is encrypted and secure</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <AddPaymentMethodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}