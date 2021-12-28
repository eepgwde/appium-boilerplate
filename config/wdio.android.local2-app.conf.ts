import { join } from 'path';
import config from './wdio.shared.local.appium.conf';

// ============
// Specs
// ============
config.specs = [
    './tests/specs2/app.*.spec.ts',
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
// weaves
// newCommandTimeout is 0 for await browser.debug()
// @ts-ignore
// @ts-ignore
config.capabilities = [
    {
        // The defaults you need to have in your config
        platformName: 'Android',
        maxInstances: 1,
        // For W3C the appium capabilities need to have an extension prefix
        // http://appium.io/docs/en/writing-running-appium/caps/
        // This is `appium:` for all Appium Capabilities which can be found here
        'appium:deviceName': 'emulator2',
        'appium:platformVersion': '11.0',
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'UiAutomator2',
        // The path to the app
        'appium:app': 'D:\\weaves\\Documents\\cache\\Mein_o2.apk',
        // @ts-ignore
        'appium:appActivity': 'canvasm.myo2.SplashActivity',
        'appium:appPackage': 'canvasm.myo2',
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        'appium:noReset': false,
        'appium:fullReset': true,
        'appium:newCommandTimeout': 0,
    },
];

exports.config = config;
