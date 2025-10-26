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
  EyeOff
} from 'lucide-react';
import { usePaymentMethods, useDeletePaymentMethod, useSetDefaultPaymentMethod } from '@/hooks/useProfile';
import { AddPaymentMethodModal } from './AddPaymentMethodModal';
import { cn } from '@/lib/utils';

const brandColors = {
  visa: 'bg-blue-500',
  mastercard: 'bg-red-500',
  amex: 'bg-green-500',
  discover: 'bg-orange-500',
  other: 'bg-gray-500',
};

const brandIcons = {
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

  const deletePaymentMethod = useDeletePaymentMethod();
  const setDefaultPaymentMethod = useSetDefaultPaymentMethod();

  const canManagePayments = currentUserRole === 'parent' || currentUserRole === 'admin';

  const handleDeletePaymentMethod = (id: string) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      deletePaymentMethod.mutate(id);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod.mutate(id);
  };

  if (!canManagePayments) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-mint-green" />
            <h3 className="text-xl font-semibold text-text-primary">
              Payment Methods
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCardNumbers(!showCardNumbers)}
              className="hover:bg-mint-green hover:text-text-primary"
            >
              {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-xl hover:bg-mint-tint transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  'w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold',
                  brandColors[method.brand]
                )}>
                  {brandIcons[method.brand]}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-text-primary">
                      {method.cardholder_name}
                    </h4>
                    {method.is_default && (
                      <Badge className="bg-mint-green text-text-primary px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Default</span>
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-text-secondary">
                    {showCardNumbers 
                      ? `**** **** **** ${method.last_four_digits}` 
                      : `•••• •••• •••• ${method.last_four_digits}`
                    }
                  </p>
                  
                  <p className="text-xs text-text-tertiary">
                    Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!method.is_default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    className="hover:bg-mint-green hover:text-text-primary"
                    disabled={setDefaultPaymentMethod.isPending}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  className="hover:bg-red-100 hover:text-red-600"
                  disabled={deletePaymentMethod.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {(!paymentMethods || paymentMethods.length === 0) && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary mb-4">No payment methods added yet</p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-mint-green hover:bg-light-mint text-text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          )}
        </div>

        {paymentMethods && paymentMethods.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full hover:bg-mint-green hover:text-text-primary"
            >
              View Transaction History
            </Button>
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