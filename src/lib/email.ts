import sgMail from '@sendgrid/mail';

// Configurar SendGrid (usar variável de ambiente)
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@loja.com';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Envia e-mail genérico
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
    // Se não tiver API key configurada, apenas loga (desenvolvimento)
    if (!process.env.SENDGRID_API_KEY) {
        console.log('📧 [EMAIL MOCK]');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Body:', html);
        return { success: true, mock: true };
    }

    try {
        await sgMail.send({
            to,
            from: FROM_EMAIL,
            subject,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return { error: 'Erro ao enviar e-mail' };
    }
}

/**
 * Template: Confirmação de Pedido
 */
export async function sendOrderConfirmation(params: {
    to: string;
    orderNumber: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
}) {
    const { to, orderNumber, total, items } = params;

    const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price / 100)}
      </td>
    </tr>
  `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmação de Pedido</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Pedido Confirmado! 🎉</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Olá!</p>
        <p>Seu pedido <strong>#${orderNumber}</strong> foi recebido com sucesso e está sendo processado.</p>
        
        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Resumo do Pedido</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 10px; text-align: left;">Produto</th>
              <th style="padding: 10px; text-align: center;">Qtd</th>
              <th style="padding: 10px; text-align: right;">Preço</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f0f0f0; font-weight: bold;">
              <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
              <td style="padding: 15px; text-align: right; color: #667eea; font-size: 18px;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total / 100)}
              </td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Próximos passos:</strong></p>
          <p style="margin: 5px 0 0 0;">Você receberá um e-mail com as instruções de pagamento em breve.</p>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Ver Meus Pedidos
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          Se você tiver dúvidas, entre em contato conosco.<br>
          © ${new Date().getFullYear()} Loja Tech Premium. Todos os direitos reservados.
        </p>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to,
        subject: `Pedido #${orderNumber} Confirmado`,
        html,
    });
}

/**
 * Template: Bem-vindo (Cadastro)
 */
export async function sendWelcomeEmail(params: {
    to: string;
    name: string;
}) {
    const { to, name } = params;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bem-vindo!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Bem-vindo! 👋</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Olá, <strong>${name}</strong>!</p>
        <p>É um prazer ter você conosco. Sua conta foi criada com sucesso!</p>
        
        <p>Agora você pode aproveitar:</p>
        <ul style="line-height: 2;">
          <li>✨ Produtos exclusivos</li>
          <li>🚚 Frete calculado em tempo real</li>
          <li>📦 Acompanhamento de pedidos</li>
          <li>💳 Checkout rápido e seguro</li>
        </ul>
        
        <p style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Começar a Comprar
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} Loja Tech Premium. Todos os direitos reservados.
        </p>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to,
        subject: 'Bem-vindo à Loja Tech Premium!',
        html,
    });
}

/**
 * Template: Pedido Enviado
 */
export async function sendShippingNotification(params: {
    to: string;
    orderNumber: string;
    trackingCode: string;
    carrier: string;
}) {
    const { to, orderNumber, trackingCode, carrier } = params;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pedido Enviado</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Pedido Enviado! 📦</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Boa notícia!</p>
        <p>Seu pedido <strong>#${orderNumber}</strong> foi enviado e está a caminho.</p>
        
        <div style="background: white; border: 2px solid #11998e; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">Código de Rastreamento:</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #11998e;">${trackingCode}</p>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Transportadora: ${carrier}</p>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
          <a href="https://rastreamento.correios.com.br/app/index.php" 
             style="background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Rastrear Pedido
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} Loja Tech Premium. Todos os direitos reservados.
        </p>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to,
        subject: `Pedido #${orderNumber} Enviado - Código de Rastreamento`,
        html,
    });
}
