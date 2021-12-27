import logger from '@wdio/logger'
import {Local} from "../helpers/Source0";
import Source0 = Local.Source0;


export default class AppScreen {
    private selector: string;

    private static source0_: Local.Source0;

    static set browser(browser: object) {
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
     * Wait for an element to appear.
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
