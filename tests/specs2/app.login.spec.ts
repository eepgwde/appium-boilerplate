import LoginScreen from '../screenobjects/LoginScreen';
import AppScreen from "../screenobjects/AppScreen";
import ConsentScreen from "../screenobjects/ConsentScreen";
import HomeScreen from "../screenobjects/HomeScreen";
import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;

// weaves
// Only successful if run from fullReset.

// Illustrates the addition of commands to browser in AppScreen.
// Drops in the debugger at the end of the login.
// You should attach an Inspector and record what you do.

const slow0 = 8000;
const slow1 = 3*slow0;

describe('One session only - login and drop into debugger: ', () => {
    beforeEach(async () => {
        // System initialization
        // Set the browser for the page dumper and add commands, catalogue resources
        AppScreen.browser = browser;

        // a moment to stabilize
        browser.pause(slow0)
        // browser.getSignature() does not work here.
        const newPage = await NewPage.getSignature("startup");

        console.log('hashcode: from resource: ' + newPage.hashCode)

        const t0 = await ConsentScreen.waitForIsShown(true, slow0); // Consent has an override
        await LoginScreen.waitForIsShown(true);
        console.log('hashcode: ' + await browser.getSignature("login").hashCode);
    });

    it('should be able login successfully', async () => {
        // Always make sure you are on the right tab
        await LoginScreen.radioButton('MOCK');
        // Submit the data
        await LoginScreen.submitLoginForm1({username: 'o2udo00000002' + '\n', password: 'test' + '\n'});

        // Logging in takes a long time
        await LoginScreen.waitForIsShown(false, slow1);

        // And the homescreen should appear
        await HomeScreen.waitForIsShown(true, slow1);
        console.log('hashcode: ' + await browser.getSignature("home"));

        await browser.debug()
    });

});
