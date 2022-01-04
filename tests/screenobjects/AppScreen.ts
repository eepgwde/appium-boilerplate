import logger from '@wdio/logger'
import {Local} from "../helpers/Source0";
import {Screens} from "../screenobjects/NewPage";
import Source0 = Local.Source0;
import Actions0 = Local.Actions0;
import NewPage = Screens.NewPage;

const path = require('path')

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
    constructor (selector: string) {
        this.selector = selector;
    }

    protected selector: string;

    private static source0_: Local.Source0;
    protected static browser_: WebdriverIO.Browser

    static iosPredicate(type0: string, attr0: string, name0: string): string {
        const v0 = `type == '${type0}' && ${attr0} CONTAINS '${name0}'`
        return `-ios predicate string:${v0}`
    }

    /**
     * Take this opportunity to add a custom command.
     * @param browser
     */
    static set browser(browser: WebdriverIO.Browser) {
        AppScreen.browser_ = browser
        AppScreen.source0_ = new Source0(browser)

        const rpath = path.join(process.cwd(), 'tests', 'resources',
            browser.isAndroid ? 'android' : 'ios')
        NewPage.initialize(rpath);

        const factions = (s: string) => {
            return AppScreen.perform0(s)
        }
        browser.addCommand('actions0', factions)

        const fdump = (name: string) => {
            return NewPage.getSignature(name).hashCode
        }
        browser.addCommand('getSignature', fdump)

        const fmove = (dir0: boolean = true, band: number = 40) => {
            AppScreen.move0(dir0, band)
        }
        browser.addCommand('scroll0', fmove)

        const fclickables = async () => {
            const page = await AppScreen.source0_.hashCode()
            const kPage = NewPage.pageOf(page.hashCode)
            return Array.from(kPage.textsR.values())
        }
        browser.addCommand('clicks', fclickables)
    }
    static get source() : Local.Source0 {
        return AppScreen.source0_;
    }

    protected log = logger('AppScreen')

    static async perform0(s: string) {
        const actions0 = new Actions0(s)
        await AppScreen.browser_.performActions(actions0.value)
        return s
    }
    /**
     * Uses appium W3C touchAction()
     */
    static async move0(upward: boolean = true, band0: number = 40) {
        const band = (0.5*band0 >= 50) ? 50 : band0 ;
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

        console.log(JSON.stringify(actions1))
        await driver.touchAction(actions1);
    }

    /**
     * Non-fatal timeout and drop to debugger.
     *
     * Wait until a button appears, then click the second from last clickable.
     * $$('id=canvasm.myo2:id/radio');
     */
    async waitForIsShown(isShown = true, timeout: 8000): Promise<boolean | void> {
        let r0
        let r1

        try {
            r0 = $(this.selector).waitForDisplayed({
                timeout: timeout,
                reverse: !isShown
            });
            this.log.info("selector: " + this.selector)
            r1 = await r0
        } catch (error) {
            this.log.warn(error)
            await browser.debug
        }
        return r1
    }

    /**
     * Fail if the defining element does not appear.
     *
     * @param {boolean} isShown
     */
    async waitForIsShown0 (isShown = true, timeout = 8000): Promise<boolean | void> {
        let v1 = $(this.selector).waitForDisplayed({
            timeout: timeout,
            interval: 300,
            reverse: !isShown,
        });
        this.log.info("waitForIsShown: " + v1)
        return v1;
    }

}
