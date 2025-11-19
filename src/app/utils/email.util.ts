import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  name: string;
  pdfBase64: string;
  totalPrice: number;
  totalItems: number;
}

// Configure your email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error, _success) => {
  if (error) {
    console.error('Email transporter error:', error);
  }
});

export const sendConfigurationEmail = async ({
  to,
  name,
  pdfBase64,
  totalPrice,
  totalItems
}: EmailOptions) => {
  try {
    // Remove base64 prefix if present
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    const mailOptions = {
      from: `"Tortuga7 Server Configurator" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Server Configuration - Tortuga7',
      html: generateEmailTemplate(name, totalPrice, totalItems),
      attachments: [
        {
          filename: `server-configuration-${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const generateEmailTemplate = (
  name: string,
  totalPrice: number,
  totalItems: number
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Configuration</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          background: #f8fafc;
          padding: 30px;
          border: 1px solid #e2e8f0;
          border-top: none;
        }
        .info-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #2563eb;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #475569;
        }
        .value {
          color: #1e293b;
        }
        .price {
          font-size: 24px;
          color: #2563eb;
          font-weight: bold;
        }
        .footer {
          background: #1e293b;
          color: #94a3b8;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 8px 8px;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🖥️ Server Configuration</h1>
        <p>Thank you for using Tortuga7 Server Configurator</p>
      </div>
      
      <div class="content">
        <p>Dear ${name},</p>
        
        <p>Thank you for creating your server configuration with us. Please find your detailed configuration PDF attached to this email.</p>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #1e293b;">Configuration Summary</h3>
          
          <div class="info-row">
            <span class="label">Total Items:</span>
            <span class="value">${totalItems} item${totalItems !== 1 ? 's' : ''}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Total Cost:</span>
            <span class="value price">£${totalPrice.toFixed(2)}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Generated:</span>
            <span class="value">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <p>Your configuration has been saved and you can download the PDF from the attachment.</p>
        
        <p>If you have any questions about your configuration or need assistance, please don't hesitate to contact our support team.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Tortuga7 Team</strong>
        </p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Tortuga7. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};