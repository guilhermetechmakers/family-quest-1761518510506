import type { NotificationType } from '@/types/notification';
import type { ReminderChannel } from '@/types/reminder';
import type { Reminder } from '@/types/reminder';

// Notification dispatcher utilities for handling different notification channels
export class NotificationDispatcher {
  private static instance: NotificationDispatcher;
  private isInitialized = false;

  static getInstance(): NotificationDispatcher {
    if (!NotificationDispatcher.instance) {
      NotificationDispatcher.instance = new NotificationDispatcher();
    }
    return NotificationDispatcher.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize push notification service
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    this.isInitialized = true;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission denied');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Send push notification
  async sendPushNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return new Promise((resolve) => {
      notification.onclick = () => {
        window.focus();
        notification.close();
        resolve();
      };

      notification.onshow = () => {
        resolve();
      };

      notification.onerror = () => {
        console.error('Notification error');
        resolve();
      };
    });
  }

  // Send in-app notification (toast)
  async sendInAppNotification(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ): Promise<void> {
    // This would typically integrate with a toast library like Sonner
    // For now, we'll use a simple console log
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    
    // In a real implementation, this would trigger a toast notification
    // toast[type](title, { description: message });
  }

  // Send email notification (would typically call backend API)
  async sendEmailNotification(
    to: string,
    subject: string,
    body: string,
    htmlBody?: string
  ): Promise<void> {
    // This would typically call a backend API to send emails
    console.log('Email notification:', { to, subject, body, htmlBody });
    
    // In a real implementation, this would make an API call:
    // await api.post('/notifications/send-email', {
    //   to,
    //   subject,
    //   body,
    //   htmlBody
    // });
  }

  // Dispatch notification based on channel
  async dispatchNotification(
    channel: ReminderChannel,
    title: string,
    message: string,
    options: {
      email?: string;
      data?: any;
      actions?: any[];
    } = {}
  ): Promise<void> {
    try {
      switch (channel) {
        case 'push':
          await this.sendPushNotification(title, {
            body: message,
            data: options.data,
          });
          break;

        case 'email':
          if (!options.email) {
            throw new Error('Email address required for email notifications');
          }
          await this.sendEmailNotification(
            options.email,
            title,
            message,
            options.data?.htmlBody
          );
          break;

        case 'in_app':
          await this.sendInAppNotification(title, message, 'info');
          break;

        default:
          throw new Error(`Unsupported notification channel: ${channel}`);
      }
    } catch (error) {
      console.error('Failed to dispatch notification:', error);
      throw error;
    }
  }

  // Schedule a reminder
  async scheduleReminder(reminder: Reminder): Promise<void> {
    const scheduledTime = new Date(reminder.scheduled_time);
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // Send immediately if time has passed
      await this.dispatchNotification(
        reminder.channel,
        reminder.title,
        reminder.message,
        {
          data: reminder.metadata,
        }
      );
      return;
    }

    // Schedule for later
    setTimeout(async () => {
      try {
        await this.dispatchNotification(
          reminder.channel,
          reminder.title,
          reminder.message,
          {
            data: reminder.metadata,
          }
        );
      } catch (error) {
        console.error('Failed to send scheduled reminder:', error);
      }
    }, delay);
  }

  // Cancel a scheduled reminder
  cancelReminder(reminderId: string): void {
    // In a real implementation, this would cancel the scheduled timeout
    // For now, we'll just log it
    console.log(`Cancelled reminder: ${reminderId}`);
  }

  // Send notification for different event types
  async sendEventNotification(
    type: NotificationType,
    title: string,
    message: string,
    channel: ReminderChannel = 'in_app',
    options: {
      email?: string;
      data?: any;
    } = {}
  ): Promise<void> {
    const notificationOptions = {
      ...options,
      data: {
        type,
        timestamp: new Date().toISOString(),
        ...options.data,
      },
    };

    await this.dispatchNotification(channel, title, message, notificationOptions);
  }

  // Send milestone achievement notification
  async sendMilestoneNotification(
    goalTitle: string,
    milestoneTitle: string,
    channel: ReminderChannel = 'in_app',
    options: { email?: string; goalId?: string } = {}
  ): Promise<void> {
    const title = '🎉 Milestone Achieved!';
    const message = `Congratulations! You've reached "${milestoneTitle}" for "${goalTitle}"`;
    
    await this.sendEventNotification(
      'milestone_achieved',
      title,
      message,
      channel,
      {
        ...options,
        data: {
          goalId: options.goalId,
          milestoneTitle,
        },
      }
    );
  }

  // Send contribution approval notification
  async sendContributionApprovalNotification(
    contributorName: string,
    amount: number,
    goalTitle: string,
    channel: ReminderChannel = 'in_app',
    options: { email?: string; contributionId?: string } = {}
  ): Promise<void> {
    const title = 'Contribution Approved';
    const message = `${contributorName}'s contribution of $${amount} to "${goalTitle}" has been approved`;
    
    await this.sendEventNotification(
      'contribution_approved',
      title,
      message,
      channel,
      {
        ...options,
        data: {
          contributorName,
          amount,
          goalTitle,
        },
      }
    );
  }

  // Send goal completion notification
  async sendGoalCompletionNotification(
    goalTitle: string,
    totalAmount: number,
    channel: ReminderChannel = 'in_app',
    options: { email?: string; goalId?: string } = {}
  ): Promise<void> {
    const title = '🎊 Goal Completed!';
    const message = `Amazing work! You've successfully completed "${goalTitle}" with a total of $${totalAmount}`;
    
    await this.sendEventNotification(
      'goal_completed',
      title,
      message,
      channel,
      {
        ...options,
        data: {
          goalId: options.goalId,
          totalAmount,
        },
      }
    );
  }

  // Send family invite notification
  async sendFamilyInviteNotification(
    inviterName: string,
    familyName: string,
    channel: ReminderChannel = 'email',
    options: { email?: string; inviteToken?: string } = {}
  ): Promise<void> {
    const title = 'Family Invitation';
    const message = `${inviterName} has invited you to join the "${familyName}" family on Family Quest`;
    
    await this.sendEventNotification(
      'family_invite',
      title,
      message,
      channel,
      {
        ...options,
        data: {
          inviterName,
          familyName,
          inviteToken: options.inviteToken,
        },
      }
    );
  }
}

// Export singleton instance
export const notificationDispatcher = NotificationDispatcher.getInstance();

// Utility functions for common notification patterns
export const sendQuickNotification = async (
  title: string,
  message: string,
  channel: ReminderChannel = 'in_app'
): Promise<void> => {
  await notificationDispatcher.dispatchNotification(channel, title, message);
};

export const sendSuccessNotification = async (
  title: string,
  message: string
): Promise<void> => {
  await notificationDispatcher.sendInAppNotification(title, message, 'success');
};

export const sendErrorNotification = async (
  title: string,
  message: string
): Promise<void> => {
  await notificationDispatcher.sendInAppNotification(title, message, 'error');
};