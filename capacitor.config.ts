import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.courier.control',
  appName: 'Courier Control',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },

  "plugins": {
    "BarcodeScanning": {
      // plugin configuration if required
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "linear-gradient(180deg, rgba(50, 70, 80, 0.9) 0%, rgb(13, 16, 27) 100%)",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      layoutName: "COURIER CONTROL",
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
