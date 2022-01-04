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
        AppScreen.browser = browser; // set the browser for the page dumper and add commands

        // a moment to stabilize
        browser.pause(slow0)
    });

    it('straight to debugger', async () => {
        await browser.debug()
    });

});
