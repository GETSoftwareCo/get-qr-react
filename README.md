 
 # 📸 GetSoftwareCo QR React

[![npm version](https://img.shields.io/npm/v/@getsoftwareco/get-qr-react.svg?style=flat-square)](https://www.npmjs.com/package/@getsoftwareco/get-qr-react)
 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Powered by GetSoftwareCo](https://img.shields.io/badge/Powered%20by-GetSoftwareCo-blue.svg?style=flat-square)](https://github.com/GetSoftwareCo)

**A modern, lightweight, and fully customizable QR & Barcode scanner for React.**

Built on top of `html5-qrcode`, this library solves common issues like ugly default UIs, lack of flashlight support, and complex camera management. It provides a plug-and-play component with a beautiful interface and a headless hook for total control.

---

## 🚀 Features

- **🎨 Modern Custom UI:** No more outdated default buttons. Comes with a sleek, rounded, and mobile-friendly interface.
- **🔦 Flashlight / Torch Support:** Essential for logistics and dark environments (Supports toggle on/off).
- **🔄 Camera Switching:** Easily switch between Front and Back cameras.
- **🛒 Multi-Format Support:** Scans QR Codes, EAN-13, UPC, Code 128, and more.
- **⚛️ Headless Hook:** Use `useScanner` to build your own UI from scratch.
- **🛡️ TypeScript Ready:** Fully typed for a great developer experience.
- **📱 Responsive:** Works perfectly on mobile and desktop devices.

---

## 📦 Installation

```bash
npm install @getsoftwareco/get-qr-react
```
# or
```
yarn add @getsoftwareco/get-qr-react
```
Note: This package requires react and react-dom (v16.8+).

💻 Usage
1. Basic Usage (Plug & Play)
The easiest way to add a scanner to your app.

```
import React from 'react';
import { GetQR } from '@getsoftwareco/get-qr-react';

const App = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>QR Scanner Demo</h1>
      
      <GetQR 
        onScanSuccess={(code, result) => {
          console.log("Scanned Code:", code);
          alert(`Scanned: ${code}`);
        }}
        onScanFailure={(error) => {
          // console.warn(error); // Optional
        }}
      />
    </div>
  );
};

export default App;
```

2. Advanced Usage (Barcodes & Flashlight)
Perfect for inventory, logistics, or supermarket apps.

```Tsx
import React from 'react';
import { GetQR, Html5QrcodeSupportedFormats } from '@getsoftwareco/get-qr-react';

const InventoryScanner = () => {
  return (
    <GetQR 
      // Only scan specific barcodes to improve performance
      formatsToSupport={[
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13, // Product Barcodes
        Html5QrcodeSupportedFormats.CODE_128, // Logistics
      ]}
      onScanSuccess={(code) => console.log("Product found:", code)}
      
      // Custom Styles
      containerStyle={{ width: '100%', maxWidth: '500px', borderRadius: 20 }}
      showControls={true} // Shows Play/Pause, Switch Camera, and Flashlight buttons
    />
  );
};
```

3. Headless Mode (Custom UI) 🛠️
Want to build your own interface? Use the useScanner hook.
 
```Tsx
import { useScanner } from '@getsoftwareco/get-qr-react';

const MyCustomScanner = () => {
  const { 
    startScan, 
    stopScan, 
    isScanning, 
    toggleTorch, 
    isTorchOn,
    activeCameraId 
  } = useScanner("my-custom-reader-id", (code) => console.log(code));

  return (
    <div>
      <div id="my-custom-reader-id" style={{ width: 300, height: 300 }} />
      
      <div className="controls">
        <button onClick={startScan} disabled={isScanning}>Start</button>
        <button onClick={stopScan} disabled={!isScanning}>Stop</button>
        <button onClick={toggleTorch}>
            {isTorchOn ? "Turn Off Light" : "Turn On Light 🔦"}
        </button>
      </div>
    </div>
  );
};
``` 


# Scanner Component

## ⚙️ Props & Configuration

| Prop              | Type             | Default      | Description                                                                 |
|-------------------|------------------|--------------|-----------------------------------------------------------------------------|
| `onScanSuccess`   | function         | Required     | Callback when a code is successfully scanned.                               |
| `onScanFailure`   | function         | undefined    | Callback when scanning fails (triggered on every frame).                    |
| `startOnMount`    | boolean          | true         | Automatically start the camera when component mounts.                       |
| `showControls`    | boolean          | true         | Show the built-in modern control panel (Start/Stop, Torch, Switch).         |
| `formatsToSupport`| Array            | All          | Array of formats (QR, EAN, UPC...) to scan.                                |
| `fps`             | number           | 10           | Frames per second. Lower saves battery.                                     |
| `qrbox`           | number           | 250          | Size of the scanning focus area (px).                                      |
| `disableFlip`     | boolean          | false        | Disable mirroring for front camera.                                        |
| `containerStyle`  | CSSProperties    | {}           | Style object for the main wrapper.                                         |

## 🏗️ Supported Formats

This package supports all major 1D and 2D code formats:

### 2D Formats
- QR Code
- Data Matrix
- Aztec
- PDF417

### 1D Formats
- EAN-13
- EAN-8
- UPC-A
- UPC-E
- Code 128
- Code 39
- Code 93
- ITF

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for bugs and feature requests.

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

---

<p align="center">
Made with ❤️ by <a href="https://getsoft.com.tr">GETSoftware Co.</a>
</p>
