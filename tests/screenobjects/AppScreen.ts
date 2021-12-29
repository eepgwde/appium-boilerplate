import logger from '@wdio/logger'
import {Local} from "../helpers/Source0";
import {Screens} from "../screenobjects/NewPage";
import Source0 = Local.Source0;
import Actions0 = Local.Actions0;
import NewPage = Screens.NewPage;

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
    protected selector: string;

    private static source0_: Local.Source0;
    protected static browser_: WebdriverIO.Browser

    /**
     * Take this opportunity to add a custom command.
     * @param browser
     */
    static set browser(browser: WebdriverIO.Browser) {
        AppScreen.browser_ = browser
        AppScreen.source0_ = new Source0(browser)

        const factions = (s: string) => {
            const a0 = new Actions0(s)
            return a0.value
        }
        browser.addCommand('actions0', factions)

        const fdump = (name: string) => {
            return NewPage.getSignature(name)
        }
        browser.addCommand('getSignature', fdump)

        const fmove = (dir0: boolean, band: number) => {
            AppScreen.move0(dir0, band)
        }
        browser.addCommand('scroll0', fmove)
    }
    static get source() : Local.Source0 {
        return AppScreen.source0_;
    }

    protected log = logger('LoginScreen')

    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Uses appium W3C touchAction()
     */
    static async move0(upward: boolean = true, band: number = 40) {
        const startPercentage = Math.trunc(50 - 0.5*band);
        const endPercentage = Math.trunc(50 + 0.5*band);
        const anchorPercentage = band;

        const {width, height} = await AppScreen.browser_.getWindowSize();
        const anchor = Math.trunc(width * anchorPercentage / 100);
        const startPoint = Math.trunc(height * startPercentage / 100);
        const endPoint = Math.trunc(height * endPercentage / 100);

        const actions1 = [
            {
                action: 'press',
                x: anchor,
                y: (upward ? endPoint : startPoint ),
            },
            {
                action: 'wait',
                ms: 100,
            },
            {
                action: 'moveTo',
                x: anchor,
                y: (upward ? startPoint : endPoint ),
            },
            'release',
        ];
        const actions2 = [
            'press',
            {
                action: 'wait',
                ms: 100,
            },
            {
                action: 'moveTo',
                x: anchor,
                y: (upward ? startPoint : endPoint ),
            },
            'release',
        ];

        console.log(JSON.stringify(actions2))
        driver.touchAction(actions1);
    }

    /**
     * Wait for the defining element to appear or not.
     *
     * @param {boolean} isShown
     */
    async waitForIsShown (isShown = true, timeout = 8000): Promise<boolean | void> {
        let v1 = $(this.selector).waitForDisplayed({
            timeout: timeout,
            interval: 300,
            reverse: !isShown,
        });
        this.log.info("waitForIsShown: " + v1)
        return v1;
    }

}
