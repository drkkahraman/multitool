/**
 * Start.io Ad Service with VIP Device Exemption & 5-Minute Auto Timer
 * App ID: 206953182
 * Exempt Device ID (No Ads): c7c4deb6-6980-4bc0-bf54-27c15f612e66
 */

export const START_IO_APP_ID = '206953182';
export const EXEMPT_DEVICE_ID = 'c7c4deb6-6980-4bc0-bf54-27c15f612e66';

let adTimer: any = null;

// Determine if the current device/user is exempt from ads
export const isAdExempt = (): boolean => {
  if (typeof window !== 'undefined') {
    if ((window as any).AndroidNative?.isAdExempt) {
      return (window as any).AndroidNative.isAdExempt();
    }
    const currentDeviceId = localStorage.getItem('multitool_device_ad_id') || EXEMPT_DEVICE_ID;
    return currentDeviceId === EXEMPT_DEVICE_ID;
  }
  return true;
};

// Trigger Start.io Ad (Bypassed completely for exempt device)
export const triggerStartIoAd = (forceManual: boolean = false): void => {
  // If device is exempt and not forced manually for testing, skip ads completely
  if (isAdExempt() && !forceManual) {
    console.log(`[Start.io] Ad bypassed for exempt device ID: ${EXEMPT_DEVICE_ID}`);
    return;
  }

  try {
    if (typeof window !== 'undefined' && (window as any).AndroidNative?.showStartIoAd) {
      (window as any).AndroidNative.showStartIoAd();
    } else {
      console.log(`[Start.io] Web Ad Triggered for regular user (App ID: ${START_IO_APP_ID})`);
      window.dispatchEvent(new CustomEvent('show-startio-web-ad'));
    }
  } catch (e) {
    console.error('Error triggering Start.io ad:', e);
  }
};

// Initialize 5-minute periodic ad timer (300,000 ms) for non-exempt users
export const initPeriodicAdTimer = (): void => {
  if (adTimer) clearInterval(adTimer);

  // Do not run timer if current user is exempt
  if (isAdExempt()) {
    console.log(`[Start.io Timer] Periodic 5-min ads disabled for exempt device: ${EXEMPT_DEVICE_ID}`);
    return;
  }

  console.log('[Start.io Timer] Periodic 5-minute ad timer initialized for regular users.');
  
  // 5 Minutes = 5 * 60 * 1000 = 300000ms
  adTimer = setInterval(() => {
    console.log('[Start.io Timer] 5 minutes elapsed. Triggering periodic ad...');
    triggerStartIoAd();
  }, 300000);
};

export const getAppAdsTxtUrl = (): string => {
  return '/app-ads.txt';
};
