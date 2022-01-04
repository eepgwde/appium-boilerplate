import AppScreen from './AppScreen';
import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;
import logger from '@wdio/logger';

/**
 * The consent screen has no info.
 *
 */
class ConsentScreen extends AppScreen {

    protected log = logger('ConsentScreen');

    // This is now a static method in the base class.
    // iOS XCUITest needs another method, see WebDriverIO https://webdriver.io/docs/selectors/
    static ios0 : string = ""
    static {
        const v0 = `type == 'XCUIElementTypeButton' && name CONTAINS 'Alles'`
        ConsentScreen.ios0 = `-ios predicate string:${v0}`
        }

    /**
     * Android: list of buttons; iOS: the named button.
     * @private
     */
    private get buttons() {
        const v0 = browser.isAndroid ? '//*[*/@clickable = "true"]' :
            this.selector ;
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
	    this.log.info("selector: " + this.selector)
            r1 = await r0

            const cbles = await $$(this.buttons)
	    this.log.info("clickables: " + cbles.length);
            const butn1 = cbles[ (cbles.length > 1) ? cbles.length - 1 : 0 ]
	    if (!browser.isAndroid) {
	       this.log.info("consent button: " + butn1 );
	    }
            await butn1.click()
        } catch (error) {
            console.warn(error)
        }
        return r1
    }
}

export default new ConsentScreen(browser.isAndroid ? 'id=canvasm.myo2:id/ucHeader' :
    AppScreen.iosPredicate('XCUIElementTypeButton', 'name', 'Alles'));
