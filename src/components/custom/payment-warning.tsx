"use client";

import { AlertCircle, Clock, XCircle } from "lucide-react";
import { PaymentStatus } from "@/lib/payment-check";

interface PaymentWarningProps {
  paymentStatus: PaymentStatus;
  onRenew?: () => void;
}

export default function PaymentWarning({ paymentStatus, onRenew }: PaymentWarningProps) {
  if (paymentStatus.status === 'active' && !paymentStatus.isInGracePeriod && paymentStatus.daysRemaining > 7) {
    return null; // Não mostrar nada se está tudo ok
  }

  const getWarningStyle = () => {
    if (paymentStatus.status === 'expired') {
      return {
        bg: 'bg-red-500/20',
        border: 'border-red-500/50',
        text: 'text-red-400',
        icon: XCircle,
      };
    }
    if (paymentStatus.status === 'grace_period') {
      return {
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        icon: AlertCircle,
      };
    }
    return {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      icon: Clock,
    };
  };

  const style = getWarningStyle();
  const Icon = style.icon;

  const getMessage = () => {
    if (paymentStatus.status === 'expired') {
      return '🚫 Sua assinatura expirou. Renove agora para continuar acessando o conteúdo.';
    }
    if (paymentStatus.status === 'grace_period') {
      return `⚠️ Sua assinatura venceu! Você tem ${paymentStatus.daysRemaining} dia(s) para renovar antes de perder o acesso.`;
    }
    if (paymentStatus.daysRemaining <= 7) {
      return `⏰ Sua assinatura vence em ${paymentStatus.daysRemaining} dia(s). Renove para não perder o acesso!`;
    }
    return '';
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4 mb-6 animate-pulse`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${style.text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`${style.text} font-semibold mb-2`}>
            {getMessage()}
          </p>
          {paymentStatus.subscriptionEndDate && (
            <p className="text-sm text-gray-400 mb-3">
              Data de vencimento: {new Date(paymentStatus.subscriptionEndDate).toLocaleDateString('pt-BR')}
            </p>
          )}
          <button
            onClick={onRenew}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Renovar Assinatura - R$ 59,90/mês
          </button>
        </div>
      </div>
    </div>
  );
}
