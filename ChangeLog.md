# TODO

Appium testing on Cygwin for Android with W3C WebDriverIO
Also on iOS

## Outstanding

1. Back is not active for Menu, but centre screen away from menu does the
same. This should be a perform actions called clickAway() outside of the frame.
2. Implement iOS version of SingletonScreen. Implement clickables(), aka listButtons(), for iOS.

iOS has a different type of selector - the `-ios predicate`. XPath may not be fully supported and the XML representation
of an App is very different.

'*//XCUIElementTypeButton[contains(@name,"Cookie")]'

and has to be replaced by this construction

const selector = `type == 'XCUIElementTypeSwitch' && name CONTAINS 'Cookie'`
const switch = `-ios predicate string:${selector}`
await $(switch).click()

# ChangeLog

Appium testing on Cygwin for Android with W3C WebDriverIO
Also on iOS

## Architecture

The String prototype to support hashCode no longer reports an error. To avoid overloaded name clashes:
String::hashCode() is an integer, xHashCode is a hexadecimal string of that integer.

The properties code has been removed.

There is now no need to perform any set-up. Source0 was refactored to take advantage of the global browser object.
Summarising:

 - `AppScreen` references `NewPage`
 - `NewPage` references `Source0`
 - Source0 is now accessed with a singleton `instance`.

Browser commands use these and are in wdio.shared.conf.ts

## Demonstrating Hooks and Test Sequences

specs3/app.login.spec.ts demonstrates the full selection of hooks.

before is performed once for the test suite session. It will login if needed.

beforeEach snapshots the page that you arrive on. It will be the page last used.

There are then two tests: the first lists some buttons, the second drops into the debugger.

## Browser Custom Command: list text for known buttons on screen

This is browser.clickables()

This method allows the debugger to list the clickable buttons on a page with their associated text.
Implemented using a new singleton in NewPage Screens.SingletonScreen.

## Browser Custom Commands

These are now defined in wdio.conf.ts as part of the before() hook at the end of the find.

## Screen Present operations: testing whether a screen has appeared

There are now two operations: a non-fatal method that returns a boolean, waitForIsShown, and a fatal one, it throws
an exception, waitForIsShownFatal.

## Dev Configurations

Latest command-lines for weaves on melissa for Android only

With reset, using specs2/

    rlwrap npx wdio run config/wdio.android.local2-weaves.conf.ts  --spec app.login.spec.ts

With no reset, using specs3/

    rlwrap npx wdio run config/wdio.android.local2-weaves.conf.ts  --spec app.login.spec.ts

## Test configurations

Latest command-lines for jenkins on jenkins are these:

For Android, with reset using specs2/

    rlwrap npx wdio run config/wdio.android.local2-app.conf.ts  --spec app.login.spec.ts

For iOS, with reset using specs2/

    rlwrap npx wdio run config/wdio.ios.local2-app.conf.ts  --spec app.login.spec.ts

The .conf.ts files are the capabilities parameters

The port number, the logLevels and the outputDir are defined in wdio.shared.conf.ts

They have been set for the Jenkins system as 4724, info and logs/.

## Startup state

The noReset and fullReset properties in capabilities determine the start-up sequence.
This can now be interrogated using AppScreen.reset0, a static property. This should be the right logic:
if not(fullReset) then not(noReset) else fullReset

## Corrected XPaths for Android

The XPath for clickables was the most important error.

## Browser Custom Command: text input using performActions()

There is a class, Actions0, and the custom command is browser.actions0(string)

## Browser Custom Command: snapshot page information

The signature of a page, a dump of the XML and a screenshot can all be made with NewPage.getSignature(). This is
available with browser.getSignature()

## Browser Custom Command: screen movement

Scrolling. browser.scroll0(upward: boolean = true, band: number = 40). This moves the screen upward,
so appears to scroll down. Band is 40% of the screen about the middle.
