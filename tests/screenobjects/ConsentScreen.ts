import AppScreen from './AppScreen';
import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;

/**
 * The consent screen has no info.
 *
 */
class ConsentScreen extends AppScreen {

    private get buttons() {
        const v0 = browser.isAndroid ? '//*[*/@clickable = "true"]' :
            '*//XCUIElementTypeButton[@name="Alles Akzeptieren"]' ;
        return v0;
    }

    /**
     * ConsentScreen overrides this to be non-fatal timeout.
     *
     * Wait until a button appears, then click the second from last clickable.
     * $$('id=canvasm.myo2:id/radio');
     */
    override async waitForIsShown(isShown = true, timeout: 8000): Promise<boolean | void> {
        let r0
        let r1
        try {
            r0 = $(this.selector).waitForDisplayed({
                timeout: timeout,
                reverse: !isShown
            });
            r1 = await r0
            // take photo too.
            await NewPage.getSignature("startup");

            const cbles = await $$(this.buttons)
            const butn1 = cbles[ (cbles.length > 1) ? cbles.length - 1 : 0 ]
            await butn1.click()
        } catch (error) {
            console.warn(error)
        }
        return r1
    }
}

export default new ConsentScreen(browser.isAndroid ? 'id=canvasm.myo2:id/ucHeader' :
    '*//XCUIElementTypeSwitch[contains(@name,"Cookies")]');
