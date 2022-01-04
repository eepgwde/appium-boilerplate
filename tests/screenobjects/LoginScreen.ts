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
            '*//XCUIElementTypeOther[contains(@name, "loginNameInputField")] ';
        super(v0)
    }

    private get radioButtons() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/radio' : '*//XCUIElementTypeButton';
        return $$(v0);
    }

    private get loginButton() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/button_login' :
            '*//XCUIElementTypeButton[contains(@name,"Einloggen")]';
        return $(v0);
    }

    private get email() {
        const v0 = browser.isAndroid ? 'id=canvasm.myo2:id/login_input_login_name' :
            '*//XCUIElementTypeTextField[contains(@name,"Mail")]';
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
            '*//XCUIElementTypeButton[contains(@name,"regist")]';
        return $(v0);
    }

    private get repeatPassword() {
        const v0 = browser.isAndroid ? '~input - repeat - password' : '';
        return $(v0);
    }

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
        // On smaller screens there could be a possibility that the button is not shown
        await Gestures.checkIfDisplayedWithSwipeUp(await this.loginButton, 2);
        await this.loginButton.click();
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

        await this.email.click();
        // await this.keys2("ab")
        await driver.performActions(u0.value);

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
            await $('~Login-screen').click();
        }

        // On smaller screens there could be a possibility that the button is not shown
        await Gestures.checkIfDisplayedWithSwipeUp(await this.loginButton, 2);
        await this.loginButton.click();
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
     * Find a radio button matching the string and click it.
     * @param type0
     */
    async radioButton(type0: string) {
        let b1 = await this.radioButtons
        this.log.info("buttons: count: " + b1.length)
        let promises = b1.map(async v => {
            const tag = await v.getAttribute("text");
            return tag
        });
        const names = await Promise.all(promises)
        const fmatch = (element) => element == type0;
        const button0 = b1[(names.findIndex(fmatch))];

        await button0.click();
    }
}

// This forces a Singleton.
export default new LoginScreen();
