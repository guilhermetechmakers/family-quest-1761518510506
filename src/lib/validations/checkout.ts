import { z } from 'zod';

// Billing Information Schema
export const billingInfoSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  city: z.string().min(2, 'City must be at least 2 characters').optional(),
  state: z.string().min(2, 'Please select a state').optional(),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters').optional(),
  country: z.string().min(2, 'Please select a country').optional(),
});

// Payment Method Schema
export const paymentMethodSchema = z.object({
  cardholder_name: z.string().min(2, 'Cardholder name must be at least 2 characters'),
  card_number: z.string()
    .min(13, 'Please enter a valid card number')
    .max(19, 'Card number too long')
    .regex(/^[\d\s]+$/, 'Card number must contain only digits and spaces'),
  expiry_month: z.string().min(1, 'Please select expiry month'),
  expiry_year: z.string().min(1, 'Please select expiry year'),
  cvv: z.string()
    .min(3, 'CVV must be at least 3 digits')
    .max(4, 'CVV must be at most 4 digits')
    .regex(/^\d+$/, 'CVV must contain only digits'),
  is_default: z.boolean().optional(),
});

// Checkout Form Schema
export const checkoutFormSchema = z.object({
  selectedPaymentMethod: z.string().min(1, 'Please select a payment method'),
  billingInfo: billingInfoSchema,
  savePaymentMethod: z.boolean().optional(),
});

// Payment Intent Schema
export const paymentIntentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(3, 'Currency must be at least 3 characters'),
  goal_id: z.string().min(1, 'Goal ID is required'),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

// Confirm Payment Schema
export const confirmPaymentSchema = z.object({
  payment_intent_id: z.string().min(1, 'Payment intent ID is required'),
  payment_method_id: z.string().min(1, 'Payment method ID is required'),
  return_url: z.string().url().optional(),
});

// Card Number Validation Helper
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Card Brand Detection
export const detectCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.startsWith('4')) return 'visa';
  if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
  if (cleaned.startsWith('3')) return 'amex';
  if (cleaned.startsWith('6')) return 'discover';
  
  return 'other';
};

// CVV Validation by Card Brand
export const validateCVV = (cvv: string, cardBrand: string): boolean => {
  const cleaned = cvv.replace(/\D/g, '');
  
  if (cardBrand === 'amex') {
    return cleaned.length === 4;
  }
  
  return cleaned.length === 3;
};

// Expiry Date Validation
export const validateExpiryDate = (month: number, year: number): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (month < 1 || month > 12) return false;
  
  return true;
};

export type BillingInfo = z.infer<typeof billingInfoSchema>;
export type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;
export type CheckoutForm = z.infer<typeof checkoutFormSchema>;
export type PaymentIntent = z.infer<typeof paymentIntentSchema>;
export type ConfirmPayment = z.infer<typeof confirmPaymentSchema>;