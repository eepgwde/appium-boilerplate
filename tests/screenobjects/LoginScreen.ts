import AppScreen from './AppScreen';
import Gestures from '../helpers/Gestures';
import {Local} from "../helpers/Source0";
import Actions0 = Local.Actions0;

/**
 * The login screen.
 *
 * It has some radioButtons on display. The one that has text matching a string is success.
 *
 * Then it clicks on, and fills email, then clicks on password and fills that.
 * The fills operations are performActions.
 *
 * The method used is submitLoginForm1()
 */
class LoginScreen extends AppScreen {
    constructor() { // [contains(@name,"Cookies")]'
        const v0 = browser.isAndroid ?
            'id=canvasm.myo2:id/login_feature_manager_container' :
            AppScreen.iosPredicate('XCUIElementTypeOther',
                'name', 'loginNameInputField');
        super(v0)
    }

    private get loginButton() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/button_login' :
            AppScreen.iosPredicate('XCUIElementTypeButton',
            'label', 'Einloggen');
        return $(v0);
    }

    private get welcomeBack() {
        const v0 = browser.isAndroid ? 'id="canvasm.myo2:id/login_welcome_back"' :
            AppScreen.iosPredicate('XCUIElementTypeButton',
                'label', 'welcome_back');
        return $(v0);
    }

    private get email() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/login_input_login_name' :
            AppScreen.iosPredicate('XCUIElementTypeTextField',
                'value', 'Mail');
        return $(v0);
    }

    private get password() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/login_input_password' :
            '*//XCUIElementTypeSecureTextField';
        return $(v0)
    }

    // known as register
    private get signUpButton() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/button_register' :
            AppScreen.iosPredicate('XCUIElementTypeButton',
                'name', 'regist');
        return $(v0);
    }

    private get repeatPassword() {
        const v0 = browser.isAndroid ? '~input - repeat - password' : '';
        return $(v0);
    }

    /**
     * Not used, setValue() does not work for Android.
     * @param username
     * @param password
     */
    async submitLoginForm({username, password}: { username: string; password: string; }) {
        await this.email.setValue(username);
        await this.password.setValue(password);

        if (await driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
            await $('~Login-screen').click();
        }

	// Not needed here, we use return '\n'

        // On smaller screens there could be a possibility that the button is not shown
        // await Gestures.checkIfDisplayedWithSwipeUp(await this.loginButton, 2);
        // await this.loginButton.click();
    }

    // Only this works! For W3C Appium not .keys()
    async keys2(str: string) {
        await driver.performActions([
            {
                type: 'key',
                actions: [
                    {type: 'keyDown', 'value': 'a'},
                    {type: 'keyUp', 'value': 'a'},
                    {type: 'keyDown', 'value': 'b'},
                    {type: 'keyUp', 'value': 'b'},
                ],
                "id": "default keyboard"
            },
        ]);

        // Add a pause, just to make sure the drag and drop is done
        await driver.pause(1000);
    }

    async submitLoginForm1({username, password}: { username: string; password: string; }) {
        let u0 = new Actions0(username)
        let p0 = new Actions0(password)

        // If not coming back, then fill in Mail field
        const halfLoggedIn = await this.welcomeBack
        if (typeof halfLoggedIn === undefined) {
            this.log.debug("")
            await this.email.click();
            await driver.performActions(u0.value);
        }

        // Add a pause, just to make sure the drag and drop is done
        await driver.pause(1000);

        await this.password.click();
        await driver.performActions(p0.value);

        if (await driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
            await $('~LoginScreen').click();
        }

        // Not needed - we use \n
        // On smaller screens there could be a possibility that the button is not shown
        // await Gestures.checkIfDisplayedWithSwipeUp(await this.loginButton, 2);
        // await this.loginButton.click();
    }

    /**
     * Unused.
     * @param username
     * @param password
     */
    async submitSignUpForm({username, password}: { username: string; password: string; }) {
        await this.email.setValue(username);
        await this.password.setValue(password);
        await this.repeatPassword.setValue(password);

        if (await driver.isKeyboardShown()) {
            /**
             * Normally we would hide the keyboard with this command `driver.hideKeyboard()`, but there is an issue for hiding the keyboard
             * on iOS when using the command. You will get an error like below
             *
             *  Request failed with status 400 due to Error Domain=com.facebook.WebDriverAgent Code=1 "The keyboard on iPhone cannot be
             *  dismissed because of a known XCTest issue. Try to dismiss it in the way supported by your application under test."
             *  UserInfo={NSLocalizedDescription=The keyboard on iPhone cannot be dismissed because of a known XCTest issue. Try to dismiss
             *  it in the way supported by your application under test.}
             *
             * That's why we click outside of the keyboard.
             */
            await $('~Login-screen').click();
        }
        // On smaller screens there could be a possibility that the button is not shown
        await Gestures.checkIfDisplayedWithSwipeUp(await this.signUpButton, 2);
        await this.signUpButton.click();
    }

    /**
     * Find a radio button matching the string and clicks it.
     *
     * This is difficult for Android, see super.buttons. Fortunately there is another XPath.
     *
     * iOS can look up the string directly, it is case-sensitive though.
     *
     * Exceptions are thrown here.
     *
     * @param type0
     */
    async radioButton(type0: string) {
        let b1 = await super.safely(super.buttons)
        if (!b1) throw 'No buttons'

        const buttonsSelector = browser.isAndroid ? 'id=canvasm.myo2:id/radio' : super.buttons ;

        const buttons = await $$(buttonsSelector)

        let promises = buttons.map(async v => {
            const tag = await v.getAttribute("text");
            return tag
        });
        const names = await Promise.all(promises)

        const type1 = type0.toLowerCase()
        const fmatch = (element: string) => element.toLowerCase() == type1;
        const button0 = buttons[(names.findIndex(fmatch))];
        if (button0 === undefined) throw `No button with text ${type0}`

        await button0.click()
    }
}

// This forces a Singleton.
export default new LoginScreen();
