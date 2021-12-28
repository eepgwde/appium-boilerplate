import logger from '@wdio/logger'
import {Local} from "../helpers/Source0";
import Source0 = Local.Source0;
const WebDriver = require('webdriver').default

/**
 * Base class of all Page objects and the Management interface Singleton for Source0
 *
 * Not the base class of NewPage.
 *
 * This implementation has a control plane singleton. It is constructed using the static setter on the class
 * for browser. It constructs Source0 and the class has a static getter browser() to get it back.
 *
 *      AppScreen.browser = browser
 *      // and
 *      val browser1 = AppScreen.source.browser()
 *      // and browser1 === browser
 *
 *  Source0 is the logging utility with AppScreen.source().dump()
 *  which snapshots the page to a directory, usually pages/.
 *
 *  This method can also be called with hlpr app page. Source0 also writes out the session-id
 *  or sessionId. Source0 updates a file, session.json-id, every time it services dump().
 *
 * It has to be set early and is used by
 */
export default class AppScreen {
    private selector: string;

    private static source0_: Local.Source0;

    /**
     * Take this opportunity to add a custom command.
     * @param browser
     */
    static set browser(browser: WebdriverIO.Browser) {
        const factions = (s: string) => {
            const a0 = new Actions(s)
            return a0.value
        }
        browser.addCommand('actions0', factions)

        AppScreen.source0_ = new Source0(browser)
    }
    static get source() : Local.Source0 {
        return AppScreen.source0_;
    }

    protected log = logger('LoginScreen')

    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Wait for the defining element to appear or not.
     *
     * @param {boolean} isShown
     */
    async waitForIsShown (isShown = true): Promise<boolean | void> {
        let v1 = $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
        this.log.info("waitForIsShown: " + v1)
        return v1;
    }
}
