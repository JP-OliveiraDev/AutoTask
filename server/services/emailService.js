const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * @param {Object} options
 * @param {string} options.to - E-mail do destinatário
 * @param {string} options.subject - Assunto do e-mail
 * @param {string} options.body - Corpo do e-mail
 * @param {string} [options.html] - Versão HTML
 * @param {string} options.attachmentPath - Caminho do arquivo PDF
 * @param {string} options.attachmentName - Nome do arquivo PDF
 * @param {string} [options.fromEmail] - E-mail do remetente
 */
async function sendProposalEmail({
  to,
  subject,
  body,
  html = '',
  attachmentPath,
  attachmentName,
  fromEmail
}) {
  try {
    if (!/\S+@\S+\.\S+/.test(to)) {
      throw new Error('Endereço de e-mail inválido');
    }

    const mailOptions = {
      from: `"AutoTask AI" <${process.env.EMAIL_USER}>`,
      replyTo: fromEmail || undefined,
      to,
      subject,
      text: body,
      html: html || undefined,
      attachments: [
        {
          filename: attachmentName,
          path: path.resolve(attachmentPath)
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email enviado para ${to} via ${fromEmail || process.env.EMAIL_USER}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail para ${to}:`, error.message);
    throw new Error('Erro ao enviar e-mail');
  }
}

module.exports = { sendProposalEmail };
