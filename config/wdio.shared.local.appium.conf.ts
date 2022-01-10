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

  // The attributes that should contain text
  export const SingletonScreen = {
    androidAttrs: ['text', 'content-desc'],
    iOSAttrs: ['name', 'label'],
  }

  // Configuration for the Source0 singleton object.
  export const Source0 = {
    destDir: 'pages',
    useTempFile: false,
    prefix: 'w',
    postfix: '.xml',
    isScreenShot: false,
  }
}
