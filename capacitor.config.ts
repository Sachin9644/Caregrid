import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.caregrid.mobile',
  appName: 'CareGrid Mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#090d16',
    },
  },
};

export default config;
