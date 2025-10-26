export interface PaymentMethod {
  id: string;
  user_id: string;
  cardholder_name: string;
  last_four_digits: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodInput {
  cardholder_name: string;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  is_default?: boolean;
}

export interface UpdatePaymentMethodInput {
  id: string;
  cardholder_name?: string;
  is_default?: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  currency: string;
  type: 'contribution' | 'refund' | 'adjustment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  backup_codes: string[];
  last_password_change: string;
  login_attempts: number;
  locked_until?: string;
}