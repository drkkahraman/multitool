import React, { useState, useEffect } from 'react';
import {
  START_IO_APP_ID,
  isAdFreeActive,
  grantTwoHoursAdFree
} from '../services/adService';

interface StartIoAdBannerProps {
  translations?: any;
}

export const StartIoAdBanner: React.FC<StartIoAdBannerProps> = () => {
  const [webAdActive, setWebAdActive] = useState(false);
  const [webRewardedActive, setWebRewardedActive] = useState(false);
  const [rewardTimer, setRewardTimer] = useState(5);
  const [, setTick] = useState(0);

  const adFree = isAdFreeActive();

  // Reklamsız süre geri sayımı için canlı tut.
  useEffect(() => {
    if (!adFree) return;
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, [adFree]);

  useEffect(() => {
    const handleWebAd = () => setWebAdActive(true);
    const handleShowRewardedWeb = () => {
      setRewardTimer(5);
      setWebRewardedActive(true);
    };
    const handleRewardGranted = () => {
      setWebAdActive(false);
      setWebRewardedActive(false);
    };

    window.addEventListener('show-startio-web-ad', handleWebAd);
    window.addEventListener('show-rewarded-web-ad', handleShowRewardedWeb);
    window.addEventListener('startio-reward-granted', handleRewardGranted);
    return () => {
      window.removeEventListener('show-startio-web-ad', handleWebAd);
      window.removeEventListener('show-rewarded-web-ad', handleShowRewardedWeb);
      window.removeEventListener('startio-reward-granted', handleRewardGranted);
    };
  }, []);

  // Web rewarded countdown timer
  useEffect(() => {
    if (!webRewardedActive) return;
    if (rewardTimer > 0) {
      const timer = setTimeout(() => setRewardTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      grantTwoHoursAdFree();
      window.dispatchEvent(new CustomEvent('startio-reward-granted'));
      setWebRewardedActive(false);
    }
  }, [webRewardedActive, rewardTimer]);

  return (
    <>
      {webAdActive && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            color: '#f8fafc'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Start.io Web Önizleme
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Start.io Reklam Alanı</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: '0 0 12px 0' }}>
              Cihazda native interstitial gösterilir. <br />
              App ID: <code>{START_IO_APP_ID}</code>
            </p>
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px dashed rgba(99, 102, 241, 0.4)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              color: '#818cf8',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              [ Start.io Interstitial Reklam ]
            </div>
            <button
              onClick={() => setWebAdActive(false)}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {webRewardedActive && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            color: '#f8fafc'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              🎬 Ödüllü Video Reklam
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800' }}>
              Reklam İzleniyor...
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Ödülünüzü almak için lütfen sürenin dolmasını bekleyin.
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '2px dashed rgba(168, 85, 247, 0.5)',
              borderRadius: '12px',
              padding: '30px 20px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#c084fc',
                background: 'rgba(168, 85, 247, 0.15)',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(168, 85, 247, 0.4)'
              }}>
                {rewardTimer}s
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>
                🎁 Ödül: 2 Saat Reklamsız Kullanım
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Start.io / Unity Ads Rewarded Integration
            </div>
          </div>
        </div>
      )}
    </>
  );
};