'use server'

import { sendEmail } from "@/lib/email";

export async function sendContactMessage(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !subject || !message) {
            return { success: false, error: 'Todos os campos são obrigatórios' };
        }

        // Validar e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'E-mail inválido' };
        }

        // Enviar e-mail para o suporte
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Mensagem de Contato</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Nova Mensagem de Contato 📬</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Detalhes da Mensagem</h2>
          
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; font-weight: bold; width: 100px;">Nome:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">E-mail:</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Assunto:</td>
              <td style="padding: 10px;">${subject}</td>
            </tr>
          </table>
          
          <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">Mensagem:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            Mensagem recebida em ${new Date().toLocaleString('pt-BR')}<br>
            © ${new Date().getFullYear()} Loja Tech Premium. Todos os direitos reservados.
          </p>
        </div>
      </body>
      </html>
    `;

        // Enviar para o e-mail de suporte
        await sendEmail({
            to: process.env.SUPPORT_EMAIL || 'suporte@lojatechpremium.com.br',
            subject: `[Contato] ${subject}`,
            html,
        });

        // Enviar confirmação para o cliente
        const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Mensagem Recebida</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Mensagem Recebida! ✅</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Olá, <strong>${name}</strong>!</p>
          <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Resumo da sua mensagem:</strong></p>
            <p style="margin: 5px 0 0 0;"><strong>Assunto:</strong> ${subject}</p>
          </div>
          
          <p>Nosso tempo médio de resposta é de 24 horas úteis.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            Se você não enviou esta mensagem, por favor ignore este e-mail.<br>
            © ${new Date().getFullYear()} Loja Tech Premium. Todos os direitos reservados.
          </p>
        </div>
      </body>
      </html>
    `;

        await sendEmail({
            to: email,
            subject: 'Recebemos sua mensagem - Loja Tech Premium',
            html: confirmationHtml,
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return { success: false, error: 'Erro ao enviar mensagem. Tente novamente.' };
    }
}
