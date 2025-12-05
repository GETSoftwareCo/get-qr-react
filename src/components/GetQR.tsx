// src/components/GetQR.tsx
import React, { useId, useEffect } from 'react';
import { useScanner } from '../hooks/useScanner';
import { IGetQRProps } from '../types';

const GetQR: React.FC<IGetQRProps> = ({
  onScanSuccess,
  onScanFailure,
  startOnMount = true,
  containerStyle,
  videoStyle,
  showControls = true,
  ...config
}) => {
  const uniqueId = useId().replace(/:/g, "");
  const elementId = `get-qr-reader-${uniqueId}`;

  const {
    startScan,
    stopScan,
    switchCamera,
    toggleTorch,
    hasTorch,
    isTorchOn,
    isScanning,
    cameras,
    activeCameraId,
    error
  } = useScanner(elementId, onScanSuccess, onScanFailure, config);

  useEffect(() => {
    if (startOnMount && activeCameraId && !isScanning) {
      startScan();
    }
  }, [startOnMount, activeCameraId]);

  // --- Styles ---
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#000',
    fontFamily: 'sans-serif',
    ...containerStyle
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center', // Ortala
    gap: '12px', // Butonlar arası boşluk
    padding: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Hafif transparan siyah zemin
    backdropFilter: 'blur(4px)',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  };

  return (
    <div style={wrapperStyle}>
      <div id={elementId} style={{ width: '100%', minHeight: '300px', ...videoStyle }} />

      {error && (
        <div style={{ padding: 10, color: 'white', backgroundColor: '#dc2626', textAlign: 'center', fontSize: 12 }}>
          {error}
        </div>
      )}

      {showControls && (
        <div style={controlsStyle}>
          
          {/* Fener Butonu (Sadece destekleniyorsa ve tarama açıksa göster) */}
          {isScanning && hasTorch && (
             <button
               onClick={toggleTorch}
               style={{
                 ...buttonStyle,
                 backgroundColor: isTorchOn ? '#f59e0b' : '#374151', // Açıkken turuncu, kapalıyken gri
                 color: 'white'
               }}
               title="Feneri Aç/Kapat"
             >
               {isTorchOn ? '⚡ Açık' : '⚡ Kapalı'}
             </button>
          )}

          {/* Başlat / Durdur */}
          {!isScanning ? (
            <button 
              onClick={startScan} 
              style={{ ...buttonStyle, backgroundColor: '#22c55e', color: 'white' }}>
              ▶ Başlat
            </button>
          ) : (
            <button 
              onClick={stopScan} 
              style={{ ...buttonStyle, backgroundColor: '#ef4444', color: 'white' }}>
              ⏹ Durdur
            </button>
          )}

          {/* Kamera Çevir */}
          {cameras.length > 1 && (
            <button 
              onClick={switchCamera}
              style={{ ...buttonStyle, backgroundColor: '#3b82f6', color: 'white' }}>
              🔄 Çevir
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GetQR;