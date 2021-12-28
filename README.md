# Stop Press

weaves

Appium testing on Cygwin for Android with W3C WebDriverIO

## Changes

### Tester Tools

The keys() method does not work on W3C servers, one must use
performActions(). I have added a class Actions0 to do the
formating. This now has a full W3C Actions key, KeyUp, KeyDown
implementation.

It will also snapshot the XML pages to a directory ./pages/ on AppScreen.source().dump()
It will also take an image capture of the screen.
The debugger has been extended and can return a programmatic page object that can be interacted with.

Many of the test files in specs{2,3}/ are now long sequences to get to points in the app for testing.

The user is now a tester who is logging pages, images and input.

This system interworks with https://github.com/eepgwde/robottestilo the Bash hlpr.sh for Android on
Cygwin or Linux.

### Processes for Testers

This JavaScript/Mocha system is used as a configuration tool for the
Java/Cucumber system delivering to Jenkins. We are still in the prototyping phase for the
test software, so we use a prototyping tool.

There are practical advantages to using JavaScript and Mocha. The
webdriver is wholly async in this implemenation, timeouts can be
adjusted and the Mocha test system is a programmable environment, so
conditional processing is possible. In particular, a time-out can be
captured in a try-catch and ignored.

The goal is to provide a way that a Tester can record a Scenario and
App Process Flow within the App.

The Tester should use the automated Logon process provided by the
Mocha specs2/app.login.spec.ts

At the end of the sequence, he is forced into the debugger, in which
he can:

  - Capture the current page with browser.getSignature()
  - Send and record keyboard input to the App with browser.performActions()
  - Send and record click on elements with await $().click()
  - Search for screen elements with the selectors $() and $$()

Try and record any interactions with the App using the debugger. In
particular, the click() operations.

The Appium session held in the debugger can be joined. You can use the
Appium Inspector and "Attach to Session" and the recorder can be used
to capture the XPath locations of the click operations.

#### Running the Test System

This system provides a test console onto the App. The system can be
used like this:

  rlwrap npx wdio run config/wdio.android.local2-app.conf.ts  --test app.login.spec.ts

this config/ file uses the specs2/ directory and sets the reset rules as fullReset.

The use of "rlwrap" is not necessary. It is added to provide a better
line editor for the debugger and can perform logging.

The script specs2/app.login.spec.ts has a simple sequence that
succeeds from a fullReset, it will dismiss the Consent page, and then
logs on, views the homepage and goes into the debugger. It uses this
invocation to do that.

   await browser.debug

It can be used anywhere in the JavaScript and Mocha test source.

##### Using the editor: rlwrap

rlwrap provides emacs-like editing for the debugger. Ctrl-p for
previous command, Ctrl-n for next. Arrows work.  Ctrl-a is beginning
of the line, Ctrl-e is the end-of-line. Some basic commands are:

   .help
   .exit

rlwrap has history and can log its input and output with -l so this

  rlwrap -l make.log npx wdio run config/wdio.android.local2-app.conf.ts  --test app.login.spec.ts

is my typical run. All of the console logging goes to make.log with the terminal session.

##### Extra Browser Operations

The browser object is accessible in the debugger just as in the main
source using the variable name "browser".  The debugger command line
also supports $() and $$() for selectors. And it can perform basic
JavaScript, it cannot import.

The browser has had some custom commands added - see customCommand in the source for webdriverio.

 - actions0
 - getSignature

I have tried, it is not possible to pass an object from the test
system into the debugger. (I had tried to get a new NewPage(), but
just {} appeared.)

 $ let u0 = browser.actions0("username").value

Returns an Actions0 object of the string "username" for use in a later call 

 $ browser.performActions(u0)

Also, it is possible to snapshot the current page with this

 $ browser.getSignature(descr) // where descr: string

The pages/ directory receives a file called w<hashcode>.xml{,1,2}
The hashcode used in the filename is the hexadecimal hashcode of the string of the XML page.
The descriptive string "state of app" can be added as needed.

The .xml file has the page. The .xml1 file has the hashcode and the
signature. The .xml2 file has a base64 encoded image of the screen
when the snapshot was made.

Every time getSignature() is invoked, a file session.json-id is updated. This can be used by
the "hlpr" script as its session identifier if needed.

#### Using the Page output for Debugger Actions

If you have access to the hlpr.sh script, you can use it whilst in the debugger.

If you have set up "hlpr" as described, it will be in the ./android0/
directory. Make a soft link to bring the pages directory into the
android directory.

At the end of specs2/app.login.spec.ts, you should be in the debugger
in one shell and at the command-line in the android0 directory.

 hlpr xml text

And there is button there:

 page.bttn.resource-id=canvasm.myo2:id/my_tariff_tile_details_btn

Take the string "id=canvasm.myo2:id/my_tariff_tile_details_btn" and use it in the debugger

 const butn1 = $('id=canvasm.myo2:id/my_tariff_tile_details_btn')
 butn1.click()

Watch the App and you should see the "Details" button activity.

Use browser.back() if necessary. Click the displayed buttons to see
which one does the same. It should be the "Details" button top-right.

So snapshot that in the debugger:

  browser.getSignature('id=canvasm.myo2:id/my_tariff_tile_details_btn')

You can also try the clicks in turn.

 > const clks1 = $$('//*[*/@clickable = "true"]')
 > clks1[0].click();
 > browser.getSignature("clks[0] short-menu")
 > browser.back()

clks1[2] is Ausland

### Tester to Developer

The test data should be collected. The files make.log and the files in pages/ 
should be zipped up and sent with a description of the Scenario processed.

## Developer Tasks

The pages are snapshot as text files of strings. The filename is its
hashcode w<hashcode>.xml. So only unique pages are stored.

Associated with each page file, is another file w<hashcode>.xml1 that
contains the hashcode and the signature of the page. There is a third
file w<hashcode>.xml2 that contains the screenshot at the time the
page was captured.

### Page Signatures

The signature is some combination of these and other metrics, (see
NewPage.ts for the latest).

        this.radioButtons.length
	this.radioButton.length
        this.clickables.length
        this.textNonEmpty.length
        this.resourceId.length
        this.editText.length
        this.textView.length

This is a tuple formed by counts of particular elements on the screen.
	  
	$$('/hierarchy//*[*/@resource-id = "canvasm.myo2:id/radio"]')
        $$('/hierarchy//*/android.widget.RadioButton')
        $$('//*[*/@clickable = "true"]')
	$$('//*[*/@text != ""]')
	$$('//*[*/@resource-id != ""]')
	$$('/hierarchy//*/android.widget.EditText')
	$$('/hierarchy//*/android.widget.TextView')

There is function 'hlpr xml signatures' that will list the signatures from the
XML files and as reported in the .xml1 files by appium-boilerplate.

There is another method that will show the text fields within each file: 'hlpr xml texts'.

It should be possible to match signatures with hashcodes with text fields to
annotate which hashcode/signature is for which screen.

Once you know what page you are on, you can add selector methods to obtain the elements.

## Done

Actions0 to browser.actions0(string)

signatures, page dump and image dump : NewPage.getSignature() and browser.getSignature()

Useful techniques. ConsentPage.waitForConsent() uses a wait for displayed in a try-except.
It then collects the clickables and clicks the last but one.



## To Do

Scrolling.

Clicking - find where clickable is true. Descend and log the TextView[@text]. Map the text to indices.

# appium-boilerplate

> **NOTE:**
> This boilerplate is for Webdriver V7 where the tests are written with `async`/`await` and TypeScript.\
> If you need a boilerplate for sync mode then check the following:
> - V7 (TypeScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/sync-mode)
> - V6 (JavaScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v6)
> - V5 (JavaScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v5)
> - V4 (JavaScript) please click [here](https://github.com/webdriverio/appium-boilerplate/tree/v4)

Boilerplate project to run Appium tests together with WebdriverIO for:

- iOS/Android Native Apps
- iOS/Android Hybrid Apps
- Android Chrome and iOS Safari browser ([check here](./README.md#automating-chrome-or-safari))

> This boilerplate uses the WebdriverIO native demo app which can be found [here](https://github.com/webdriverio/native-demo-app).

> **Note:**
> This boilerplate only handles local execution on 1 em/simulator at a time, not parallel execution. For more info about that Google on setting up a grid with Appium.


## Based on
This boilerplate is currently based on:
- **WebdriverIO:** `7.##.#`
- **Appium:** `1.22.#`

## Installation

1. Running `git clone https://github.com/webdriverio/appium-boilerplate.git`
2. Running `npm install`
3. Installing Appium on a local machine [here](./docs/APPIUM.md)
4. Setting up Android and iOS on a local machine [here](./docs/ANDROID_IOS_SETUP.md)
5. Making demo app available. Create a `./apps` directory. Download the app files (.app / .apk) with version >= `0.4.0`
[here](https://github.com/webdriverio/native-demo-app/releases). Move the files into the directory `apps`.
6. Running tests `npm run android.app` or `npm run android.app`


## How to implement in your project
Choose one of the following options:

1. Clone the git repo — `git clone https://github.com/webdriverio/appium-boilerplate.git`
2. Then copy the files to your project directory (all files in `/tests` and the `wdio.conf`-files in the `config`-folder)
3. Merge project dev dependencies with your projects dev dependencies in your `package.json`
4. Merge the scripts to your `package.json` scripts
5. Run the tests, see [Native App Tests](#native-app-tests) or [Automating Chrome of Safari](#automating-chrome-or-safari).

## Configuration files
This boilerplate uses a specific config for iOS and Android, see [configs](./config). The configs are based on a shared config
[`wdio.shared.conf.ts`](./config/wdio.shared.conf.ts).
This shared config holds **all the defaults** so the iOS and Android configs only need to hold the capabilities and specs that are needed
for running on iOS and or Android (app or browser).

Please check the [`wdio.shared.conf.ts`](./config/wdio.shared.conf.ts)-file for the minimal configuration options. Notes are added for why
a different value has been selected in comparison to the default values WebdriverIO provides.

Since we do not have Appium installed as part of this package we are going to use the globally installed version of Appium. This is
configured in [`wdio.shared.local.appium.conf.ts`](./config/wdio.shared.local.appium.conf.ts).

## Locator strategy for native apps
The locator strategy for this boilerplate is to use `accessibilityID`'s, see also the
[WebdriverIO docs](https://webdriver.io/docs/selectors#accessibility-id) or this newsletter on
[AppiumPro](https://appiumpro.com/editions/20).
`accessibilityID`'s make it easy to script once and run on iOS and Android because most of the apps already have some `accessibilityID`'s.

If `accessibilityID`'s can't be used, and for example only XPATH is available, then the following setup could be used to make cross-platform
selectors

```js
const SELECTORS = {
    WEB_VIEW_SCREEN: browser.isAndroid
        ? '*//android.webkit.WebView'
        : '*//XCUIElementTypeWebView',
};
```

> **NOTE:** If you look into the screen/page-objects you might see that a lot of selectors are made private, meaning you can use the
> elements in the spec-file itself. This has been done on purpose because one of the *best practices* is to remove all interactions from
> your spec files and implement the interactions in the page objects. This will make it easier to maintain for the future and easier to
> refactor if new interaction methods will be added or names will be adjusted.

## Native App Tests
All tests can be executed on te devices as configured in [`wdio.android.app.conf.ts`](./config/wdio.android.app.conf.ts) or
[`wdio.ios.app.conf.ts`](./config/wdio.ios.app.conf.ts). Please check the below tests on what they do or on how to run them separately.

        // For Android local execution
        npm run android.app

        // For iOS local execution
        npm run ios.app


### Drag And Drop
Drag and Drop an element can be a complex gesture to automate with Appium. The demo app has a simple puzzle that hopefully makes it easier
and fun to understand how to implement a drag and drop in WebdriverIO. The test can be found [here](./tests/specs/app.drag.and.drop.spec.ts)
and the drag and drop implementation can be found in [this](./tests/screenobjects/DragScreen.ts)-file.
This file will now only hold the [`touchAction`](https://webdriver.io/docs/api/browser/touchAction/) way of using the drag and drop Gesture.
The `touchPerform` is the *old* JSONWP way of implementing a gesture and is not W3C compatible. The `touchAction` is the new official W3C
implementation of a gesture.

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.drag.and.drop.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.drag.and.drop.spec.ts

### Form components
The Forms-tab holds some components that might be a challenge during automation:

- Input fields
- Switches
- Dropdowns / Pickers
- Native alerts

The tests and used page objects hopefully explain what you need to do to make this work and can be found
[here](./tests/specs/app.forms.spec.ts).

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.forms.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.forms.spec.ts

### Login with Biometric support
The Login screen holds a simple implementation of a Login and SignUp form. This boilerplate holds 2 different test-files for the Login
screen.

- [Default Login/Sign Up](./tests/specs/app.login.spec.ts)
- [Login through Touch-/FaceID or FingerPrint (Biometric Support)](./tests/specs/app.biometric.login.spec.ts)

The last one can be very interesting because it will give you an idea what you need to do when you need to log in with Touch-/FaceID or
FingerPrint. The [`app.biometric.login.spec.ts`](./tests/specs/app.biometric.login.spec.ts) will also enable Touch-/FaceID if needed
automatically for you for **Android Emulators** or **iOS Simulators**. It covers almost all platform versions.

> **NOTE:** The methods rely on the fact that the Android Emulator or iOS Simulator have English as the default language. If you have set up
> your test devices with a different language you might need to change certain selectors and or texts for the selectors.

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.login.spec.ts
        npm run android.app -- --spec=tests/specs/app.biometric.login.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.login.spec.ts
        npm run ios.app -- --spec=tests/specs/app.biometric.login.spec.ts

### Navigation
There are 2 types of navigation tests that explained in this boilerplate.

1. [Tab Bar](./tests/specs/app.tab.bar.navigation.spec.ts)
1. [Deep Links](./tests/specs/app.deep.link.navigation.spec.ts)

The most interesting test here will be the [Deep Links](./tests/specs/app.deep.link.navigation.spec.ts) because this might speed up your own
tests if your app supports Deep Links. Check the code and the `openDeepLinkUrl()` method in the [`Utils.ts`](./tests/helpers/Utils.ts)-file
to see how this works.

> **PRO TIP:** If you are automating iOS apps and you can use Deep Links, then you might want to try adding the capability
> `autoAcceptAlerts:true` when you start the iOS device. This capability will automatically accept all alerts, also the alert that will
> appear when you want to open your deep link in Safari.
>
> If you ware going to use this capability, then don't forget to remove the last few lines in the
> [`openDeepLinkUrl()`](./tests/helpers/Utils.ts)-method, see the comments in the method

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.tab.bar.navigation.spec.ts
        npm run android.app -- --spec=tests/specs/app.deep.link.navigation.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.tab.bar.navigation.spec.ts
        npm run ios.app -- --spec=tests/specs/app.deep.link.navigation.spec.ts

### Swiping
Swiping is basically a movement with your finger on the screen that has a starting position on the screen, an x-, and y-coordinate and an
end position, also an x-, and y-coordinate. The starting position can be seen as the first time you touch the screen, the initial *press*.
The end position can be seen as the time you release the screen. If you translate this to steps you will get:

1. Press your finger on the screen on starting position
1. Move your finger to the end position
1. Release your finger when you are on the end position

The [Swipe](./tests/specs/app.swipe.spec.ts)-test will be an example on how to do that. It uses a
[Gesture](./tests/helpers/Gestures.ts)-helper that might be useful for you in the future.

If you want to know more about Gestures and how to automate them, then we would advise you to watch
[this presentation "Swiping your way through Appium by Wim Selles"](https://youtu.be/oAJ7jwMNFVU).

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.swipe.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.swipe.spec.ts

### WebViews
The app has a WebView that will automatically load the WebdriverIO documentation page. This boilerplate holds 2 test files:

1. [Interact within a WebView with CSS Selectors](./tests/specs/app.webview.spec.ts).
   *You will also find a test that interacts between a WebView and the Native part of the app.*
1. [Automate a WebView based on Native Selectors](./tests/specs/app.webview.xpath.spec.ts). This test will compare the execution time of:

    - automating the WebView by **NOT** switching to the WebView (by using native selectors).
    - automating the WebView by **SWITCHING** to the WebView.

   Check the console for load time differences. An example time could look like this
   ```log
    // Android
    [0-0] RUNNING in Android - /tests/specs/app.webview.xpath.spec.ts
    [0-0] Test time for using XPATH It took 0.799 seconds.
    [0-0] Test time for switching to the WebView It took 0.238 seconds.
    [0-0] PASSED in Android - /tests/specs/app.webview.xpath.spec.ts

    // iOS
    [0-0] RUNNING in iOS - /tests/specs/app.webview.xpath.spec.ts
    [0-0] Test time for using XPATH It took 3.125 seconds.
    [0-0] Test time for switching to the WebView It took 1.443 seconds.
    [0-0] PASSED in iOS - /tests/specs/app.webview.xpath.spec.ts
   ```

You will also find a [WebView](./tests/helpers/WebView.ts)-helper with hopefully useful methods that can help you automate a Hybrid App.
Keep in the back of your mind that for *simplicity* of the Demo app only one WebView is used. This is also used in the WebView-helper.

More information about **Automating Hybrid Applications with Appium** and more complex WebViews can be found in
[this webinar](https://youtu.be/_mPCRxplBfo) recording.

You can run the single test with the following commands

        // For Android local execution
        npm run android.app -- --spec=tests/specs/app.webview.spec.ts
        npm run android.app -- --spec=tests/specs/app.webview.xpath.spec.ts

        // For iOS local execution
        npm run ios.app -- --spec=tests/specs/app.webview.spec.ts
        npm run ios.app -- --spec=tests/specs/app.webview.xpath.spec.ts

## Automating Chrome or Safari
Mobile web automation is almost the same as writing tests for desktop browsers. The only difference can be found in the configuration that
needs to be used. Click [here](config/wdio.ios.browser.conf.ts) to find the config for iOS Safari and
[here](config/wdio.android.browser.conf.ts) for Android Chrome.
For Android be sure that the latest version of Chrome is installed, see also
[here](./docs/FAQ.md#i-get-the-error-no-chromedriver-found-that-can-automate-chrome-). Our
[`wdio.shared.local.appium.conf.ts`](./config/wdio.shared.local.appium.conf.ts) uses the `relaxedSecurity: true` argument from Appium which
will allow Appium to automatically download the latest ChromeDriver.

For this boilerplate the testcases from the [jasmine-boilerplate](https://github.com/webdriverio/jasmine-boilerplate), created by
[Christian Bromann](https://github.com/christian-bromann), are used.

## Cloud vendors
### Sauce Labs
If you want to run the Native App tests on Sauce Labs you need to do 2 things:

- Add the [Sauce Service](#add-sauce-service) to your project
- Upload the apps to the [Sauce Labs Storage](#upload-apps-to-sauce-storage)

When the above has been executed you can follow the steps in:

- [Run app tests on the Sauce Labs Real Device Cloud](#run-app-tests-on-the-sauce-labs-real-device-cloud)
- [Run app tests on the Sauce Labs Emulators and Simulators](#run-app-tests-on-the-sauce-labs-emulators-and-simulators)

#### Add Sauce Service
Make sure you install the latest version of the `@wdio/sauce-service` with

```shell
$ npm install --save-dev @wdio/sauce-service
```

and add `services: ['sauce'],` to the config. If no `region` is provided it will automatically default to the US-Virtual/RDC cloud.
If you provide `region: 'us'` or `region: 'eu'` it will connect to the US or the EU Virtual/RDC cloud.

#### Upload apps to Sauce Storage
If you want to use Android emulators, iOS simulators or Android real devices in the Sauce Labs UI you need to upload the apps to the Sauce
Storage. You can find a script to upload them to, and the US, and EU DC in [this](./scripts)-folder. You can push the files to the storage
by executing the following steps in a terminal from the root of this project:

    cd scripts
    ./push_apps_to_sauce_storage.sh

When you've done that you will see a lot of successful logs in your terminal.

#### Run app tests on the Sauce Labs Real Device Cloud
> **NOTE:** Due to signing iOS Real Devices are not supported. Only Android Real Devices are supported.

Please check the [Android Real Devices](./config/wdio.android.app.conf.ts)-config to see the setup for Android real devices.

You can use the following scripts, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For Android Real Devices
    // On EU DC
    npm run android.sauce.rdc.app.eu
    // On US DC
    npm run android.sauce.rdc.app.us

#### Run app tests on the Sauce Labs Emulators and Simulators
Please check the following configs to verify the configurations:
- [Android Emulators](./config/saucelabs/wdio.android.emulators.app.conf.ts)
- [iOS Simulators](./config/saucelabs/wdio.ios.simulators.app.conf.ts)

The following scripts that can be used, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For Android Emulators
    // On EU DC
    npm run android.sauce.emulators.app.eu
    // On US DC
    npm run android.sauce.emulators.app.us
    // For Android Real Devices
    // On EU DC
    npm run android.sauce.rdc.app.eu
    // On US DC
    npm run android.sauce.rdc.app.us

    // For iOS
    // On EU DC
    npm run ios.sauce.simulator.app.eu
    // On US DC
    npm run ios.sauce.simulator.app.us

### BrowserStack
This boilerplate provides a setup for testing with BrowserStack. Please check the [BrowserStack](./config/browserstack)-folder to see the
setup for iOS and Android.

Make sure you install the latest version of the `@wdio/browserstack-service` with

```shell
$ npm install --save-dev @wdio/browserstack-service
```

There are 2 scripts that can be used, see the [`package.json`](./package.json), to execute the tests in the cloud:

    // For iOS
    $ npm run ios.browserstack.app

    // For Android
    $ npm run android.browserstack.app

## FAQ
See [FAQ](./docs/FAQ.md)

## Tips and Tricks
See [Tips and Tricks](./docs/TIPS_TRICKS.md)
