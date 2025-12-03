import { AppSettings } from '../types';

interface EmailPayload {
  subject: string;
  body: string;
}

/**
 * Constructs the email content based on the event type
 */
const generateEmailContent = (type: 'VERO' | 'HIGH_PROFIT' | 'EXPORT', details: string, productName: string): EmailPayload => {
  const timestamp = new Date().toLocaleString();
  
  switch (type) {
    case 'VERO':
      return {
        subject: `⚠️ VeRO Alert: ${productName} Blocked`,
        body: `
          <h1>VeRO Protection Alert</h1>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Reason:</strong> ${details}</p>
          <p>This product was automatically blocked to protect your eBay account health.</p>
        `
      };
    case 'HIGH_PROFIT':
      return {
        subject: `💰 High Profit Opportunity: ${productName}`,
        body: `
          <h1>New High Profit Item Found!</h1>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Profit Analysis:</strong> ${details}</p>
          <p>Action Recommended: Review and Publish immediately.</p>
        `
      };
    case 'EXPORT':
      return {
        subject: `✅ Successful Export: ${productName}`,
        body: `
          <h1>Product Exported Successfully</h1>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Details:</strong> ${details}</p>
        `
      };
    default:
      return { subject: 'Affiliate AI Notification', body: details };
  }
};

/**
 * Simulates sending an email via SendGrid.
 * Note: In a production client-side app, you should use a backend proxy or EmailJS 
 * to avoid exposing API keys and CORS issues. This function mimics the API structure.
 */
export const sendEmailNotification = async (
  settings: AppSettings,
  type: 'VERO' | 'HIGH_PROFIT' | 'EXPORT',
  productName: string,
  details: string
): Promise<boolean> => {
  // Check global switch
  if (!settings.enableEmailNotifications || !settings.sendGridApiKey || !settings.notificationEmail) {
    return false;
  }

  // Check specific triggers
  if (type === 'VERO' && !settings.notifyOnVero) return false;
  if (type === 'HIGH_PROFIT' && !settings.notifyOnHighProfit) return false;
  if (type === 'EXPORT' && !settings.notifyOnExportSuccess) return false;

  const content = generateEmailContent(type, details, productName);

  console.log(`[NotificationService] Preparing to send email to ${settings.notificationEmail}...`);
  console.log(`[NotificationService] Subject: ${content.subject}`);

  // Simulate API Network Delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // In a real backend environment, this would be the fetch call:
  /*
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.sendGridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: settings.notificationEmail }] }],
        from: { email: 'noreply@affiliate-ai-app.com' },
        subject: content.subject,
        content: [{ type: 'text/html', value: content.body }]
      })
    });
    return response.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
  */

  // Return success for simulation
  return true;
};