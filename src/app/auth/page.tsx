"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { DollarSign } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário já está logado
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      }
    };
    checkUser();

    // Listener para mudanças de autenticação
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/");
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [router]);

  // Se Supabase não estiver configurado
  if (!supabase) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-4">
            <DollarSign className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-4">FalcaoPro Metodos</h1>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <p className="text-yellow-400 mb-2">⚠️ Configuração Necessária</p>
            <p className="text-gray-300 text-sm">
              Configure suas variáveis de ambiente do Supabase para habilitar a autenticação.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-4">
            <DollarSign className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">FalcaoPro Metodos</h1>
          <p className="text-gray-400">Dinheiro no bolso, sem risco</p>
        </div>

        {/* Card de Autenticação com componente oficial do Supabase */}
        <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-8 shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#22c55e',
                    brandAccent: '#16a34a',
                    brandButtonText: 'black',
                    defaultButtonBackground: '#18181b',
                    defaultButtonBackgroundHover: '#27272a',
                    defaultButtonBorder: 'rgba(34, 197, 94, 0.2)',
                    defaultButtonText: 'white',
                    dividerBackground: 'rgba(34, 197, 94, 0.2)',
                    inputBackground: '#000000',
                    inputBorder: 'rgba(34, 197, 94, 0.3)',
                    inputBorderHover: 'rgba(34, 197, 94, 0.5)',
                    inputBorderFocus: '#22c55e',
                    inputText: 'white',
                    inputLabelText: '#d1d5db',
                    inputPlaceholder: '#6b7280',
                    messageText: '#d1d5db',
                    messageTextDanger: '#ef4444',
                    anchorTextColor: '#22c55e',
                    anchorTextHoverColor: '#16a34a',
                  },
                  space: {
                    spaceSmall: '4px',
                    spaceMedium: '8px',
                    spaceLarge: '16px',
                    labelBottomMargin: '8px',
                    anchorBottomMargin: '4px',
                    emailInputSpacing: '4px',
                    socialAuthSpacing: '4px',
                    buttonPadding: '12px 16px',
                    inputPadding: '12px 16px',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '14px',
                    baseButtonSize: '14px',
                  },
                  fonts: {
                    bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                    buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                    inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                    labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              className: {
                container: 'supabase-auth-container',
                button: 'supabase-auth-button',
                input: 'supabase-auth-input',
                label: 'supabase-auth-label',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Criar Conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                  confirmation_text: 'Verifique seu email para confirmar o cadastro',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu email para redefinir a senha',
                },
                update_password: {
                  password_label: 'Nova senha',
                  password_input_placeholder: '••••••••',
                  button_label: 'Atualizar senha',
                  loading_button_label: 'Atualizando...',
                  confirmation_text: 'Sua senha foi atualizada',
                },
                verify_otp: {
                  email_input_label: 'Email',
                  email_input_placeholder: 'seu@email.com',
                  phone_input_label: 'Telefone',
                  phone_input_placeholder: 'Seu telefone',
                  token_input_label: 'Código',
                  token_input_placeholder: 'Código de verificação',
                  button_label: 'Verificar',
                  loading_button_label: 'Verificando...',
                },
              },
            }}
            providers={[]}
            redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
            view="sign_in"
            showLinks={true}
            magicLink={false}
          />
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Ao criar uma conta, você concorda com nossos Termos de Serviço
          </p>
        </div>
      </div>
    </div>
  );
}
