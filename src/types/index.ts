// src/types/index.ts
import { Html5QrcodeSupportedFormats } from "html5-qrcode";

// Enum'ı dışarı açıyoruz ki kullanıcı import edebilsin
export { Html5QrcodeSupportedFormats };

export interface IScannerConfig {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  // Kullanıcı hangi formatları istediğini dizi olarak verebilecek
  formatsToSupport?: Html5QrcodeSupportedFormats[]; 
}

export interface IGetQRProps extends IScannerConfig {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (errorMessage: string) => void;
  startOnMount?: boolean;
  containerStyle?: React.CSSProperties;
  videoStyle?: React.CSSProperties;
  showControls?: boolean;
}

export interface ICameraDevice {
  id: string;
  label: string;
}