/**
 * All not needed configurations, for this boilerplate, are removed.
 * If you want to know which configuration options you have then you can
 * check https://webdriver.io/docs/configurationfile
 */
import AppScreen from "../tests/screenobjects/AppScreen";
import {Screens} from "../tests/screenobjects/NewPage";
import NewPage = Screens.NewPage;
import SingletonScreen = Screens.SingletonScreen;

export const config: WebdriverIO.Config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  hostname: 'localhost',
  port: 4723,
  path: '/wd/hub/',
  //
  // ==================
  // Specify Test Files
  // ==================
  // The test-files are specified in:
  // - wdio.android.browser.conf.ts
  // - wdio.android.app.conf.ts
  // - wdio.ios.browser.conf.ts
  // - wdio.ios.app.conf.ts
  //
  /**
   * NOTE: This is just a place holder and will be overwritten by each specific configuration
   */
  specs: [],
  //
  // ============
  // Capabilities
  // ============
  // The capabilities are specified in:
  // - wdio.android.browser.conf.ts
  // - wdio.android.app.conf.ts
  // - wdio.ios.browser.conf.ts
  // - wdio.ios.app.conf.ts
  //
  /**
   * NOTE: This is just a place holder and will be overwritten by each specific configuration
   */
  capabilities: [],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevel: 'silent',
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'warn',
  // logLevels: { 
  //     webdriver: 'debug',
  //     webdriverio: 'debug',
  // },
  outputDir: 'logs',
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: 'http://localhost:4723/wd/hub/',
  // Default timeout for all waitFor* commands.
  /**
   * NOTE: This has been increased for more stable Appium Native app
   * tests because they can take a bit longer.
   */
  waitforTimeout: 60000,
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 24000,
  // Default request retries count
  connectionRetryCount: 1,
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  //
  // Services are empty here but will be defined in the
  // - wdio.shared.browserstack.conf.ts
  // - wdio.shared.local.appium.conf.ts
  // - wdio.shared.sauce.conf.ts
  // configuration files
  services: [],
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  reporters: ['spec'],
  // Options to be passed to Mocha.
  mochaOpts: {
    ui: 'bdd',
    /**
     * NOTE: This has been increased for more stable Appium Native app
     * tests because they can take a bit longer.
     */
    // timeout: 3 * 60 * 1000, // 3min
    timeout: 0, // 3min
  },
  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  //
  /**
   * NOTE: No Hooks are used in this project, but feel free to add them if you need them.
   */
  onWorkerStart: function (cid, caps, specs, args, execArgv) {
    console.log('worker-start')
  },
  onComplete: function (exitCode, config, caps, result) {
    console.log('on-complete')
  },
  before(capabilities, specs, browser: any) {

    // browser commands that return Promise don't return a typed object.
    // I have tried, JSON.stringify()

    browser.addCommand('actions0', async function (stringToSend: string) {
      await AppScreen.perform0(stringToSend) // sends a string using performActions
      return stringToSend
    })
    browser.addCommand('scroll0', async (dir0: boolean = true, band: number = 40) => {
      await AppScreen.move0(dir0, band) // scrolls the App down by a percentage of the screen.
      return (dir0 ? 'page-down' : 'page-up')
    })
    browser.addCommand('getSignature', async (name: string): Promise<string> => {
      const hashCode = await NewPage.getSignature(name) // writes the page, and takes a screenshot
      return hashCode
    })
    browser.addCommand('clickables', async (): Promise<string[]> => {
      const m0 = await SingletonScreen.instance.listButtons() // lists available buttons
      const v0 = [...m0.keys()]
      return [...Array(v0.length).keys()].map((i: number): string =>
        i.toString().padStart(2, '0') + " - " + v0[i])
    })
  }
}
