import LoginScreen from '../screenobjects/LoginScreen';
import AppScreen from "../screenobjects/AppScreen";
import ConsentScreen from "../screenobjects/ConsentScreen";
import HomeScreen from "../screenobjects/HomeScreen";
import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;

import {Local} from "../helpers/Source0";
import log = Local.log;

// weaves
// Only successful if run from a reset: for Android this is noReset is false, for iOS noReset is false.
//
// There is a test to see if the Consent Screen has been shown or not. I haven't managed to force the condition
// to test this.

// Illustrates the addition of commands to browser in AppScreen.
// Drops in the debugger at the end of the login.
// You can record what you do within the debugger, it can $().click() and using the
// added commands, you can send keys using browser.actions0().

const slow0: number = 8000;
const slow1: number = (5*slow0);

describe('One session only - login and drop into debugger: ', () => {
    beforeEach(async () => {
        // System initialization
        // Set the browser for the page dumper and add commands, catalogue resources
        AppScreen.browser = browser;

        log.info('reset state: ' + AppScreen.reset0)

        // a moment to stabilize
        browser.pause(slow0)
        // browser.getSignature() does not work here.
        const newPage = await NewPage.getSignature("startup");

        log.info('hashcode: from resource: ' + newPage.hashCode)

        // t0 should always be true.
        const t0 = await ConsentScreen.waitForIsShown(true, slow0);
        if (t0) await ConsentScreen.assent()

        await LoginScreen.waitForIsShownFatal(true, slow0);
        log.info('hashcode: ' + await NewPage.getSignature("login").hashCode);
    });

    it('should be able login successfully', async () => {
        await LoginScreen.radioButton('MOCK')
        // Submit the data
        const password0 = 'test' + '\n';
        await LoginScreen.submitLoginForm1({username: 'o2udo00000002' + '\n', password: password0});

        // Logging in takes a long time
        await LoginScreen.waitForIsShownFatal(false, slow1);

        // And the homescreen should appear
        await HomeScreen.waitForIsShownFatal(true, slow1);
        const page = await NewPage.getSignature("home")
        log.info('hashcode: ' + page.hashCode);

        await browser.debug()
    });

});
