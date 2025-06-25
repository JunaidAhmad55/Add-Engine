
import { toast } from "@/hooks/use-toast";

const WEBHOOK_URL_KEY = 'slack_webhook_url';
const SUPPORT_WEBHOOK_URL_KEY = 'slack_support_webhook_url';

export const slackService = {
  saveWebhookUrl(url: string) {
    localStorage.setItem(WEBHOOK_URL_KEY, url);
  },

  getWebhookUrl(): string | null {
    return localStorage.getItem(WEBHOOK_URL_KEY);
  },

  clearWebhookUrl() {
    localStorage.removeItem(WEBHOOK_URL_KEY);
  },

  saveSupportWebhookUrl(url: string) {
    localStorage.setItem(SUPPORT_WEBHOOK_URL_KEY, url);
  },

  getSupportWebhookUrl(): string | null {
    return localStorage.getItem(SUPPORT_WEBHOOK_URL_KEY);
  },

  clearSupportWebhookUrl() {
    localStorage.removeItem(SUPPORT_WEBHOOK_URL_KEY);
  },

  async sendNotification(message: string): Promise<void> {
    const webhookUrl = this.getWebhookUrl();
    if (!webhookUrl) {
      console.info("Slack notifications not sent: Webhook URL is not configured.");
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to send Slack notification:', response.status, responseText);
      }
    } catch (error) {
      console.error('Error sending Slack notification:', error);
    }
  },

  async sendSupportNotification(message: string): Promise<void> {
    const webhookUrl = this.getSupportWebhookUrl();
    if (!webhookUrl) {
      toast({
        title: "Slack support not setup",
        description: "No Slack support channel configured.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to send Slack support notification:', response.status, responseText);
      }
    } catch (error) {
      console.error('Error sending Slack support notification:', error);
    }
  },
};
