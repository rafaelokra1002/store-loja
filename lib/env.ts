const INSECURE_SECRETS = new Set([
  "dev-secret-key-change-in-production",
  "sua-secret-key",
  "sua-secret-key-aqui-troque-em-producao",
  "change-me",
  "changeme",
]);

export function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

export function getNextAuthSecret() {
  const secret = getRequiredEnv("NEXTAUTH_SECRET");

  if (secret.length < 32 || INSECURE_SECRETS.has(secret)) {
    console.warn(
      "NEXTAUTH_SECRET parece fraco ou padrao. Gere um valor aleatorio forte antes de publicar a loja."
    );
  }

  return secret;
}

export function getMisticPayWebhookUrl() {
  const explicitWebhookUrl = process.env.MISTICPAY_WEBHOOK_URL?.trim();

  if (explicitWebhookUrl) {
    return explicitWebhookUrl;
  }

  return `${getRequiredEnv("NEXT_PUBLIC_APP_URL")}/api/webhook/misticpay`;
}