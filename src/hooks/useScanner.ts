// src/hooks/useScanner.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { IScannerConfig, ICameraDevice } from '../types';

export const useScanner = (
  elementId: string,
  onScanSuccess: (decodedText: string, decodedResult: any) => void,
  onScanFailure?: (errorMessage: string) => void,
  config: IScannerConfig = {}
) => {
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<ICameraDevice[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fener State'leri
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);

  // 1. Kütüphaneyi Konfigürasyonla Başlat
  useEffect(() => {
    // Eğer kullanıcı format belirtmediyse, varsayılan olarak hepsini okusun
    // Ama profesyonellik adına varsayılan listeyi geniş tutabiliriz veya boş bırakıp kütüphaneye bırakabiliriz.
    const formats = config.formatsToSupport || [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.EAN_13, // Market barkodu
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128, // Kargo/Lojistik barkodu
      Html5QrcodeSupportedFormats.UPC_A
    ];

    // Config objesini constructor'a veriyoruz
    const qrCodeInstance = new Html5Qrcode(elementId, {
        formatsToSupport: formats,
        verbose: config.verbose || false
    });
    
    setHtml5QrCode(qrCodeInstance);

    return () => {
      if (qrCodeInstance.isScanning) {
        qrCodeInstance.stop().catch(err => console.error("Cleanup error", err));
      }
    };
  }, [elementId]); // Config değişirse restart gerekir, basitlik için sadece ID'ye bağladık

  // 2. Kameraları Getir (Değişmedi)
  useEffect(() => {
    if (!html5QrCode) return;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices.map(d => ({ id: d.id, label: d.label })));
          const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
          setActiveCameraId(backCamera ? backCamera.id : devices[0].id);
        }
      })
      .catch((err) => {
        setError("Kamera bulunamadı.");
      });
  }, [html5QrCode]);

  // 3. Taramayı Başlat ve FENER KONTROLÜ YAP
  const startScan = useCallback(() => {
    if (!html5QrCode || !activeCameraId || isScanning) return;

    const qrConfig = {
      fps: config.fps || 10,
      qrbox: config.qrbox || 250,
      aspectRatio: config.aspectRatio || 1.0,
      disableFlip: config.disableFlip || false,
    };

    html5QrCode
      .start(
        activeCameraId,
        qrConfig,
        (decodedText, decodedResult) => {
          onScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          if (onScanFailure) onScanFailure(errorMessage);
        }
      )
      .then(() => {
        setIsScanning(true);
        setError(null);
        
        // --- FENER KONTROLÜ BURADA ---
        // Kamera başladıktan sonra yeteneklerini (capabilities) sorguluyoruz
        try {
            const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
            // 'torch' özelliği var mı?
            if (capabilities && (capabilities as any).torchFeature && (capabilities as any).torchFeature.isSupported()) {
                setHasTorch(true);
            } else {
                setHasTorch(false);
            }
        } catch (e) {
            // Bazı tarayıcılarda bu özellik desteklenmez
            setHasTorch(false);
        }
      })
      .catch((err) => {
        setIsScanning(false);
        setError("Tarama başlatılamadı.");
      });
  }, [html5QrCode, activeCameraId, isScanning, config, onScanSuccess, onScanFailure]);

  const stopScan = useCallback(() => {
    if (!html5QrCode || !isScanning) return;
    html5QrCode.stop().then(() => {
        setIsScanning(false);
        setHasTorch(false); // Durunca fener yeteneği de gider
        setIsTorchOn(false);
    }).catch(err => console.error(err));
  }, [html5QrCode, isScanning]);

  const switchCamera = useCallback(() => {
     // (Önceki kod ile aynı mantık, burayı kısa tutuyorum)
     if (cameras.length < 2) return;
     const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
     const nextIndex = (currentIndex + 1) % cameras.length;
     const nextCameraId = cameras[nextIndex].id;
     
     if(isScanning) {
         html5QrCode?.stop().then(() => {
             setIsScanning(false);
             setActiveCameraId(nextCameraId);
             // Kullanıcı tekrar başlatmalı veya state ile tetiklemeliyiz
         });
     } else {
         setActiveCameraId(nextCameraId);
     }
  }, [cameras, activeCameraId, isScanning, html5QrCode]);

  // 4. Fener Aç/Kapat Fonksiyonu
  const toggleTorch = useCallback(() => {
      if(!html5QrCode || !isScanning || !hasTorch) return;

      const targetStatus = !isTorchOn;
      
      html5QrCode.applyVideoConstraints({
          advanced: [{ torch: targetStatus }]
      } as any)
      .then(() => {
          setIsTorchOn(targetStatus);
      })
      .catch(err => {
          console.error("Fener hatası:", err);
          setError("Fener açılamadı.");
      });

  }, [html5QrCode, isScanning, hasTorch, isTorchOn]);

  return {
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
  };
};