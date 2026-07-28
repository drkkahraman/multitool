import React, { useState, useEffect } from 'react';
import { START_IO_APP_ID, EXEMPT_DEVICE_ID, isAdExempt, triggerStartIoAd } from '../services/adService';

export const StartIoAdBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [webAdActive, setWebAdActive] = useState(false);
  const isExempt = isAdExempt();

  useEffect(() => {
    const handleWebAd = () => {
      setWebAdActive(true);
    };
    window.addEventListener('show-startio-web-ad', handleWebAd);
    return () => window.removeEventListener('show-startio-web-ad', handleWebAd);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="startio-ad-banner"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '10px 16px',
          margin: '12px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          color: '#f8fafc',
          fontSize: '13px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: isExempt ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '11px',
            letterSpacing: '0.5px',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
          }}>
            {isExempt ? 'VIP Reklamsız' : 'Start.io'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
                {isExempt ? 'Geliştirici Muaf Cihaz (0 Reklam)' : 'Start.io Reklam Servisi'}
              </span>
              <span style={{
                background: isExempt ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                border: `1px solid ${isExempt ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                color: isExempt ? '#34d399' : '#818cf8',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                {isExempt ? '✨ REKLAMLARDAN MUAF' : '⏱️ HER 5 DAKİKADA BİR REKLAM'}
              </span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>
              App ID: {START_IO_APP_ID} • Muaf Cihaz ID: <code style={{ color: '#818cf8' }}>{EXEMPT_DEVICE_ID}</code>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => triggerStartIoAd(true)}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#818cf8',
              padding: '4px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)')}
            title="Manuel Reklam Önizleme"
          >
            Reklamı Test Et
          </button>
          
          <a
            href="/app-ads.txt"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#64748b',
              fontSize: '11px',
              textDecoration: 'none',
              padding: '4px 6px'
            }}
            title="app-ads.txt dosyasını görüntüle"
          >
            app-ads.txt
          </a>

          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 6px',
              marginLeft: '4px'
            }}
            title="Kapat"
          >
            ✕
          </button>
        </div>
      </div>

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
              Start.io Live Ad Preview
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Start.io Reklam Gösterimi</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: '0 0 12px 0' }}>
              App ID: <code>{START_IO_APP_ID}</code><br />
              Normal Kullanıcı periyodu: <strong>5 Dakikada bir otomatik reklam</strong>
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
              [ Start.io Interstitial / Banner Reklam Alanı ]
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
    </>
  );
};
