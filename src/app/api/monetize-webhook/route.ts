import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Webhook da Monetize para processar pagamentos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar webhook da Monetize (adicione sua chave secreta)
    const webhookSecret = process.env.MONETIZE_WEBHOOK_SECRET;
    const signature = request.headers.get('x-monetize-signature');
    
    // TODO: Validar assinatura do webhook
    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Processar diferentes tipos de eventos da Monetize
    const { event, data } = body;

    switch (event) {
      case 'payment.approved':
        await handlePaymentApproved(supabase, data);
        break;
      case 'payment.refunded':
        await handlePaymentRefunded(supabase, data);
        break;
      case 'subscription.renewed':
        await handleSubscriptionRenewed(supabase, data);
        break;
      case 'subscription.expired':
        await handleSubscriptionExpired(supabase, data);
        break;
      default:
        console.log('Evento não tratado:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePaymentApproved(supabase: any, data: any) {
  const { customer_email, amount, transaction_id } = data;

  // Buscar usuário pelo email
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('email', customer_email)
    .single();

  if (users) {
    // Calcular nova data de vencimento (30 dias a partir de agora)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

    // Atualizar status do usuário
    await supabase
      .from('users')
      .update({
        payment_status: 'active',
        subscription_end_date: subscriptionEndDate.toISOString(),
        monetize_customer_id: transaction_id,
      })
      .eq('email', customer_email);

    // Registrar pagamento no histórico
    await supabase
      .from('payment_history')
      .insert([{
        user_id: users.id,
        amount: parseFloat(amount),
        status: 'approved',
        monetize_transaction_id: transaction_id,
      }]);
  }
}

async function handlePaymentRefunded(supabase: any, data: any) {
  const { customer_email, transaction_id } = data;

  // Atualizar status do pagamento no histórico
  await supabase
    .from('payment_history')
    .update({ status: 'refunded' })
    .eq('monetize_transaction_id', transaction_id);
}

async function handleSubscriptionRenewed(supabase: any, data: any) {
  const { customer_email, amount, transaction_id } = data;

  // Buscar usuário pelo email
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('email', customer_email)
    .single();

  if (users) {
    // Calcular nova data de vencimento (30 dias a partir da data atual de vencimento)
    const currentEndDate = users.subscription_end_date 
      ? new Date(users.subscription_end_date) 
      : new Date();
    
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + 30);

    // Atualizar status do usuário
    await supabase
      .from('users')
      .update({
        payment_status: 'active',
        subscription_end_date: newEndDate.toISOString(),
      })
      .eq('email', customer_email);

    // Registrar renovação no histórico
    await supabase
      .from('payment_history')
      .insert([{
        user_id: users.id,
        amount: parseFloat(amount),
        status: 'renewed',
        monetize_transaction_id: transaction_id,
      }]);
  }
}

async function handleSubscriptionExpired(supabase: any, data: any) {
  const { customer_email } = data;

  // Atualizar status do usuário para expirado
  await supabase
    .from('users')
    .update({
      payment_status: 'expired',
    })
    .eq('email', customer_email);
}
