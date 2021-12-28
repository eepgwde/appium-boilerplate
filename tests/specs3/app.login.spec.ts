import TabBar from '../screenobjects/components/TabBar';
import LoginScreen from '../screenobjects/LoginScreen';
import NativeAlert from '../screenobjects/components/NativeAlert';
import AppScreen from "../screenobjects/AppScreen";
import ConsentScreen from "../screenobjects/ConsentScreen";

import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;

describe('Signatures for pages,', () => {
    beforeEach(async () => {
        AppScreen.browser = browser; // set the browser for the page dumper and add functions

        // Added by the above
        const v0 = await browser.actions0("username")
        console.log("actions0: " + JSON.stringify(v0));

        await NewPage.getSignature();

        const t0 = await ConsentScreen.waitForConsent(); // just in case it appears
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

        await browser.debug()
    });

});

describe('Signatures 2 for pages,', () => {
    beforeEach(async () => {
        AppScreen.browser = browser; // set the browser for the page dumper and add functions

        // Added by the above
        const v0 = await browser.actions0("username")
        console.log("actions0: " + JSON.stringify(v0));

        await NewPage.getSignature();

        const t0 = await ConsentScreen.waitForConsent(); // just in case it appears
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
