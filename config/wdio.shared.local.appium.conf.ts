import { config } from './wdio.shared.conf';

//
// ======
// Appium
// ======
// Don't start Appium in the test suite.
// =====================
// Server Configurations
// =====================
//
// config.port = 4723;
// config.hostname = 'localhost';
// config.path = '/wd/hub';

export default config;

// weaves
// Local Test Configuration
export module Site0 {
  // weaves : some problems with screenshot, so it can be switched off here.
  export const isScreenShot: boolean = false
}
