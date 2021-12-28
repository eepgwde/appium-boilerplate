import TabBar from '../screenobjects/components/TabBar';
import LoginScreen from '../screenobjects/LoginScreen';
import NativeAlert from '../screenobjects/components/NativeAlert';
import AppScreen from "../screenobjects/AppScreen";
import ConsentPage from "../screenobjects/ConsentPage";

import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;

describe('Signatures for pages,', () => {
    beforeEach(async () => {
        AppScreen.browser = browser; // set the browser for the page dumper.

        const v0 = await browser.someCommand("username")
        console.log("someCommand: " + JSON.stringify(v0));

        await NewPage.getSignature();

        const t0 = await ConsentPage.waitForConsent(); // just in case it appears
        if (t0) console.log('signature: ' + await NewPage.getSignature());
        await LoginScreen.waitForIsShown(true);
    });

    it('should be able login successfully', async () => {
        // Always make sure you are on the right tab
        await LoginScreen.radioButton('MOCK');
        // Submit the data
        await LoginScreen.submitLoginForm1({username: 'o2udo00000002' + '\n', password: 'test' + '\n'});

        await LoginScreen.waitForIsShown(false);
        await NewPage.getSignature();

        // await browser.debug()
    });

});

describe('WebdriverIO and Appium, when interacting with a login form,', () => {
    beforeEach(async () => {
        AppScreen.browser = browser; // set the browser for the page dumper.
        await ConsentPage.waitForConsent(); // just in case it appears
        await LoginScreen.waitForIsShown(true);
    });

    it('should be able login successfully', async () => {
        // Always make sure you are on the right tab
        await LoginScreen.radioButton('MOCK');
        // Submit the data
        await LoginScreen.submitLoginForm1({username: 'o2udo00000002' + '\n', password: 'test' + '\n'});
        await LoginScreen.waitForIsShown(false);
    });

});
