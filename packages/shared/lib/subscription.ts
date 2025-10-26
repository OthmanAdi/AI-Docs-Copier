/**
 * Subscription & Trial Management
 * Using ExtensionPay + chrome.storage.sync
 */

export interface TrialStatus {
  hasAccess: boolean;
  status: 'trial' | 'premium' | 'expired';
  daysLeft?: number;
  message?: string;
}

export interface SubscriptionData {
  installDate: number;
  trialActive: boolean;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  paidAt?: number;
}

const TRIAL_DAYS = 2;
const STORAGE_KEY = 'subscription_data';

/**
 * Initialize trial on first install
 */
export async function initializeTrial(): Promise<void> {
  const data = await getSubscriptionData();

  if (!data) {
    const initialData: SubscriptionData = {
      installDate: Date.now(),
      trialActive: true,
      isPremium: false,
    };

    await chrome.storage.sync.set({ [STORAGE_KEY]: initialData });
  }
}

/**
 * Get subscription data from storage
 */
export async function getSubscriptionData(): Promise<SubscriptionData | null> {
  const result = await chrome.storage.sync.get([STORAGE_KEY]);
  return result[STORAGE_KEY] || null;
}

/**
 * Update subscription data
 */
export async function updateSubscriptionData(data: Partial<SubscriptionData>): Promise<void> {
  const current = await getSubscriptionData();
  const updated = { ...current, ...data };
  await chrome.storage.sync.set({ [STORAGE_KEY]: updated });
}

/**
 * Check trial status
 */
export async function checkTrialStatus(): Promise<TrialStatus> {
  const data = await getSubscriptionData();

  if (!data) {
    // Not initialized yet
    return {
      hasAccess: true,
      status: 'trial',
      daysLeft: TRIAL_DAYS,
    };
  }

  if (data.isPremium) {
    return {
      hasAccess: true,
      status: 'premium',
    };
  }

  const daysSinceInstall = (Date.now() - data.installDate) / (1000 * 60 * 60 * 24);
  const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceInstall);

  if (trialDaysLeft > 0) {
    return {
      hasAccess: true,
      status: 'trial',
      daysLeft: Math.ceil(trialDaysLeft),
    };
  }

  return {
    hasAccess: false,
    status: 'expired',
    message: 'Your 2-day trial has ended. Upgrade to continue using AI Docs Copier.',
  };
}

/**
 * Mark as premium (after payment)
 */
export async function activatePremium(subscriptionType: 'monthly' | 'yearly'): Promise<void> {
  await updateSubscriptionData({
    isPremium: true,
    trialActive: false,
    subscriptionType,
    paidAt: Date.now(),
  });
}

/**
 * Check if user has access (trial or premium)
 */
export async function hasAccess(): Promise<boolean> {
  const status = await checkTrialStatus();
  return status.hasAccess;
}

/**
 * Get remaining trial time in human-readable format
 */
export function formatTrialTime(daysLeft: number): string {
  if (daysLeft >= 1) {
    return `${Math.ceil(daysLeft)} day${Math.ceil(daysLeft) > 1 ? 's' : ''}`;
  }

  const hoursLeft = Math.ceil(daysLeft * 24);
  return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
}
