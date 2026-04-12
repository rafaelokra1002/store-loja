const MISTICPAY_API = "https://api.misticpay.com/api";

function getHeaders() {
  const ci = process.env.MISTICPAY_CLIENT_ID;
  const cs = process.env.MISTICPAY_CLIENT_SECRET;

  if (!ci || !cs) {
    throw new Error("Credenciais Mistic Pay não configuradas");
  }

  return {
    ci,
    cs,
    "Content-Type": "application/json",
  };
}

export interface CreateTransactionParams {
  amount: number;
  payerName: string;
  payerDocument: string;
  transactionId: string;
  description: string;
}

export interface CreateTransactionResponse {
  message: string;
  data: {
    transactionId: string;
    payer: { name: string; document: string };
    transactionFee: number;
    transactionType: string;
    transactionMethod: string;
    transactionAmount: number;
    transactionState: string;
    qrCodeBase64: string;
    qrcodeUrl: string;
    copyPaste: string;
  };
}

export async function createPixTransaction(
  params: CreateTransactionParams
): Promise<CreateTransactionResponse> {
  const webhookUrl = process.env.MISTICPAY_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/misticpay`;

  const res = await fetch(`${MISTICPAY_API}/transactions/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...params,
      projectWebhook: webhookUrl,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro Mistic Pay: ${res.status} - ${error}`);
  }

  return res.json();
}

export interface CheckTransactionResponse {
  message: string;
  transaction: {
    transactionId: string;
    value: number;
    fee: number;
    transactionState: string;
    transactionType: string;
    transactionMethod: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function checkTransaction(
  transactionId: string
): Promise<CheckTransactionResponse> {
  const res = await fetch(`${MISTICPAY_API}/transactions/check`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ transactionId }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao verificar transação: ${res.status} - ${error}`);
  }

  return res.json();
}
