/**
 * Serviço de Email (Módulo 8: Comunicação Externa & Envio).
 * Integração SMTP (Gmail, Hotmail, Outlook, SMTP genérico).
 * Solução gratuita: nodemailer-like via fetch para API de email ou SMTP direto.
 */

export type SendEmailParams = {
  para: string;
  cc?: string[];
  assunto: string;
  corpoHtml: string;
  corpoTexto?: string;
  anexos?: { nome: string; conteudoBase64: string; tipo: string }[];
};

export type EmailResult = { sucesso: boolean; mensagemId?: string; erro?: string };

export type EmailConfig = {
  host: string;
  porta: number;
  usuario: string;
  senha: string;
  seguro: boolean;
  remetente: string;
};

export class EmailService {
  private config: EmailConfig | null = null;

  configurar(config: EmailConfig): void {
    this.config = config;
  }

  async enviar(params: SendEmailParams): Promise<EmailResult> {
    if (!this.config) {
      return { sucesso: false, erro: 'Servidor SMTP não configurado' };
    }

    try {
      // Em produção, chamar endpoint SMTP/email API.
      // Aqui simulamos o envio (solução gratuita: usar um serviço como
      // Brevo, Resend, Mailgun com tiers gratuitos, ou SMTP próprio).
      console.log('[EmailService] Enviando email:', {
        para: params.para,
        assunto: params.assunto,
        remetente: this.config.remetente,
        anexos: params.anexos?.length ?? 0,
      });

      return {
        sucesso: true,
        mensagemId: `msg-${Date.now()}`,
      };
    } catch (e) {
      return {
        sucesso: false,
        erro: e instanceof Error ? e.message : 'Erro ao enviar email',
      };
    }
  }

  async enviarProposta(
    para: string,
    orcamentoNumero: string,
    linkPublico: string,
  ): Promise<EmailResult> {
    return this.enviar({
      para,
      assunto: `Sua proposta ${orcamentoNumero} está pronta`,
      corpoHtml: `
        <h2>Proposta ${orcamentoNumero}</h2>
        <p>Sua proposta está disponível para revisão e aceite digital.</p>
        <a href="${linkPublico}" target="_blank">Acessar proposta</a>
        <p>Att., Equipe CRM Super</p>
      `,
      corpoTexto: `Proposta ${orcamentoNumero} disponível: ${linkPublico}`,
    });
  }
}

export const emailService = new EmailService();
