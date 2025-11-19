import { createClient } from '@supabase/supabase-js';

export interface PaymentStatus {
  isActive: boolean;
  isInGracePeriod: boolean;
  daysRemaining: number;
  subscriptionEndDate: Date | null;
  status: 'active' | 'grace_period' | 'expired' | 'pending';
}

export async function checkPaymentStatus(userEmail: string): Promise<PaymentStatus> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Buscar dados do usuário
  const { data: user } = await supabase
    .from('users')
    .select('subscription_end_date, payment_status')
    .eq('email', userEmail)
    .single();

  if (!user || !user.subscription_end_date) {
    return {
      isActive: false,
      isInGracePeriod: false,
      daysRemaining: 0,
      subscriptionEndDate: null,
      status: 'pending',
    };
  }

  const endDate = new Date(user.subscription_end_date);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Se ainda está dentro do período pago
  if (diffDays > 0) {
    return {
      isActive: true,
      isInGracePeriod: false,
      daysRemaining: diffDays,
      subscriptionEndDate: endDate,
      status: 'active',
    };
  }

  // Se venceu mas está dentro do período de carência (3 dias)
  if (diffDays >= -3 && diffDays <= 0) {
    return {
      isActive: true, // Ainda tem acesso
      isInGracePeriod: true,
      daysRemaining: 3 + diffDays, // Dias restantes do período de carência
      subscriptionEndDate: endDate,
      status: 'grace_period',
    };
  }

  // Se passou do período de carência
  return {
    isActive: false,
    isInGracePeriod: false,
    daysRemaining: 0,
    subscriptionEndDate: endDate,
    status: 'expired',
  };
}

export function formatPaymentMessage(paymentStatus: PaymentStatus): string {
  if (paymentStatus.status === 'grace_period') {
    return `⚠️ Sua assinatura venceu! Você tem ${paymentStatus.daysRemaining} dia(s) para renovar antes de perder o acesso.`;
  }
  
  if (paymentStatus.status === 'expired') {
    return '🚫 Sua assinatura expirou. Renove agora para continuar acessando o conteúdo.';
  }

  if (paymentStatus.status === 'active' && paymentStatus.daysRemaining <= 7) {
    return `⏰ Sua assinatura vence em ${paymentStatus.daysRemaining} dia(s). Renove para não perder o acesso!`;
  }

  return '';
}
