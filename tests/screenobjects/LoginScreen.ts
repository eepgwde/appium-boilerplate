import AppScreen from './AppScreen';
import Gestures from '../helpers/Gestures';
import {Local} from "../helpers/Source0";
import Actions0 = Local.Actions0;

class LoginScreen extends AppScreen {
    constructor () {
        super('id=canvasm.myo2:id/login_feature_manager_container');
    }

    private get radioButtons() {
        return $$('id=canvasm.myo2:id/radio');
    }

    private get loginContainer () {return $('id=canvasm.myo2:id/layout_login');}
    private get loginButton () {return $('id=canvasm.myo2:id/button_login');}

    private get email () {return $('id=canvasm.myo2:id/login_input_login_name');}
    private get password () {return $('id=canvasm.myo2:id/login_input_password');}

    // known as register
    private get signUpButton () {return $('id=canvasm.myo2:id/button_register');}
    private get repeatPassword () {return $('~input-repeat-password');}

    async submitLoginForm({ username, password }:{username:string; password:string;}) {
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
                    { type: 'keyDown', 'value': 'a' },
                    { type: 'keyUp', 'value': 'a' },
                    { type: 'keyDown', 'value': 'b' },
                    { type: 'keyUp', 'value': 'b' },
                ],
                "id": "default keyboard"
            },
        ]);

        // Add a pause, just to make sure the drag and drop is done
        await driver.pause(1000);
    }

    async submitLoginForm1({ username, password }:{username:string; password:string;}) {
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

    async submitSignUpForm({ username, password }:{username:string; password:string;}) {
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
        } );
        const names = await Promise.all(promises)
        const fmatch = (element) => element == type0;
        const button0 = b1[(names.findIndex(fmatch))];

        await button0.click();
    }
}

export default new LoginScreen();
