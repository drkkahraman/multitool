/**
 * Unity Ads Service for Multitool
 * Ads Completely Removed
 */

export const UNITY_GAME_ID = '4829774';
export const INTERSTITIAL_PLACEMENT_ID = 'Interstitial_Android';
export const REWARDED_PLACEMENT_ID = 'Rewarded_Android';

export const isAdExempt = (): boolean => true;
export const getAdFreeUntil = (): number => Infinity;
export const isAdFreeActive = (): boolean => true;
export const grantTwoHoursAdFree = (): number => Infinity;
export const getRemainingAdFreeTimeFormatted = (): string => 'Sınırsız';

// Trigger Unity Interstitial Ad (Disabled)
export const triggerUnityInterstitialAd = (): void => {
  // Ads completely disabled
};

// Legacy alias
export const triggerStartIoAd = triggerUnityInterstitialAd;

// Trigger Unity Rewarded Ad (Disabled)
export const triggerUnityRewardedAd = (): void => {
  // Ads completely disabled
};

export const trackUserActionForAd = (): void => {
  // Action counter reserved
};

// Initialize periodic ad timer (Disabled)
export const initPeriodicAdTimer = (): void => {
  // Periodic ad timer disabled completely
};

export const getAppAdsTxtUrl = (): string => {
  return '/app-ads.txt';
};
