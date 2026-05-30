type ErrorContext =
  | "login"
  | "register"
  | "social-login"
  | "recover-password"
  | "recovery-2fa-status"
  | "recovery-2fa-setup"
  | "recovery-2fa-enable"
  | "ai-chat";

const fallbackMessages: Record<ErrorContext, string> = {
  login: "Nao foi possivel entrar agora. Confira seus dados e tente novamente.",
  register: "Nao foi possivel criar a conta agora. Revise os dados e tente novamente.",
  "social-login": "Nao foi possivel iniciar o login social. Tente novamente em instantes.",
  "recover-password": "Nao foi possivel recuperar a senha. Confira o e-mail, o codigo 2FA e a nova senha.",
  "recovery-2fa-status": "Nao foi possivel carregar o status do 2FA. Entre novamente e tente outra vez.",
  "recovery-2fa-setup": "Nao foi possivel gerar a chave 2FA. Verifique sua sessao e tente novamente.",
  "recovery-2fa-enable": "Nao foi possivel ativar o 2FA. Confira o codigo do app autenticador.",
  "ai-chat": "Nao foi possivel conectar com o Cody agora. Tente novamente em instantes.",
};

function extractBackendMessage(error: any): string {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  if (typeof error?.message === "string") return error.message;

  return "";
}

function normalizeMessage(message: string): string {
  return message
    .replace(/E-mail ou senha invalidos/i, "E-mail ou senha incorretos.")
    .replace(/Codigo invalido ou expirado/i, "Codigo 2FA invalido ou expirado.")
    .replace(/Codigo invalido/i, "Codigo 2FA invalido.")
    .replace(/Recuperacao por 2FA nao configurada/i, "Esta conta ainda nao ativou o 2FA para recuperar senha.")
    .replace(/A nova senha precisa ter pelo menos 6 caracteres/i, "A nova senha precisa ter pelo menos 6 caracteres.")
    .replace(/Usuario nao encontrado/i, "Usuario nao encontrado.")
    .replace(/Configure o 2FA antes de ativar/i, "Gere uma chave 2FA antes de confirmar o codigo.")
    .replace(/Token nao retornado/i, "O login foi aceito, mas o servidor nao retornou uma sessao. Reinicie o backend e tente novamente.");
}

export function getUserFriendlyError(error: any, context: ErrorContext): string {
  const status = error?.response?.status;
  const backendMessage = normalizeMessage(extractBackendMessage(error));

  if (status === 0 || error?.code === "ERR_NETWORK") {
    return "Nao foi possivel conectar ao servidor. Verifique se o backend esta ligado na porta 3000.";
  }

  if (context === "login" && status === 401) {
    return "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
  }

  if (context === "register" && status === 409) {
    return "Este e-mail ja esta cadastrado. Entre com essa conta ou use outro e-mail.";
  }

  if (context === "recover-password" && status === 401) {
    return backendMessage || "Codigo 2FA invalido ou expirado. Abra o app autenticador e use o codigo mais recente.";
  }

  if (context === "recovery-2fa-enable" && status === 401) {
    return "Codigo 2FA invalido. Use o codigo atual do app autenticador e tente novamente.";
  }

  if (status === 401) {
    return "Sua sessao expirou. Entre novamente para continuar.";
  }

  if (status === 403) {
    return "Voce nao tem permissao para acessar este recurso. Entre novamente com a conta correta.";
  }

  if (status === 404) {
    return "Nao encontramos o recurso solicitado. Atualize a pagina e tente novamente.";
  }

  if (status === 413) {
    return "O arquivo enviado e muito grande. Envie um arquivo menor.";
  }

  if (status === 400 && backendMessage) {
    return backendMessage;
  }

  if (status && status >= 500) {
    return "O servidor encontrou um problema ao processar a solicitacao. Tente novamente em alguns instantes.";
  }

  return backendMessage || fallbackMessages[context];
}
